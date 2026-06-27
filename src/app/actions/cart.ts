'use server'

/**
 * actions/cart.ts — Server Actions para o ciclo de vida do carrinho/checkout.
 *
 * Substituem a chamada direta ao Supabase (clientQueries.createOrder) para:
 *  1. Recomputar preços no servidor (fonte de verdade = banco, não localStorage)
 *  2. Criação atômica via RPC (header + itens em uma transação)
 *  3. Rate limiting por IP (proteção contra automação)
 *  4. Validação de fulfillment_type (rejeita null quando CEP foi informado)
 */

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, extractIp } from '@/lib/security/rateLimit'
import type { FulfillmentType } from '@/types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Item do carrinho serializado para envio ao server action. */
export interface OrderItemInput {
  productId: string
  colorId: string | null
  sizeId: string | null
  quantity: number
  /** Snapshot do nome do produto (display apenas — não é revalidado). */
  productName: string
  /** Snapshot do nome da cor (display apenas). */
  colorName: string | null
  /** Snapshot da label do tamanho (display apenas). */
  sizeLabel: string | null
}

export interface CreateOrderInput {
  items: OrderItemInput[]
  customerName: string
  customerPhone: string
  /**
   * null quando o CEP não foi informado/geocodificado (modo 'unknown').
   * O server action armazena null no banco nesses casos.
   */
  fulfillmentType: FulfillmentType | null
  /** Valor do frete em R$ (null quando retirada/envio externo ou a combinar). */
  freight: number | null
  cep?: string
  street?: string
  streetNumber?: string
  neighborhood: string
  city: string
  notes?: string
}

export interface CreateOrderSuccess {
  orderId: string
  /** Total recalculado no servidor (preços atuais do banco). */
  serverTotal: number
}

export type CreateOrderResult = CreateOrderSuccess | { error: string }

// 10 pedidos por minuto por IP
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Cria um pedido de forma segura:
 *  - Autenticação via sessão (não aceita user_id do cliente)
 *  - Preços recomputados a partir do banco de dados
 *  - Inserção atômica via RPC create_order_atomic
 *  - Rate limiting por IP
 */
export async function createOrderAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  // 0. Rate limit
  const reqHeaders = await headers()
  const ip = extractIp(reqHeaders)
  const rl = checkRateLimit(`order:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)
  if (rl.limited) {
    return { error: 'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.' }
  }

  // 1. Autenticação — user_id vem da sessão, nunca do cliente
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'É necessário fazer login para finalizar o pedido.' }
  }

  // 2. Validação básica de entrada
  if (!input.items.length) {
    return { error: 'O carrinho está vazio.' }
  }
  if (!input.neighborhood || !input.city) {
    return { error: 'Bairro e cidade são obrigatórios.' }
  }

  // 3. Validação de fulfillment quando CEP foi informado
  // (quando não há CEP, o modo é 'unknown' e null é aceito — a combinar)
  const hasCep = Boolean(input.cep && input.cep.length === 8)
  if (hasCep && !input.fulfillmentType) {
    return { error: 'Escolha como deseja receber o pedido antes de continuar.' }
  }

  // 4. Busca preços atuais no banco (fonte de verdade)
  const productIds = [...new Set(input.items.map((i) => i.productId))]
  const sizeIds = [...new Set(input.items.map((i) => i.sizeId).filter(Boolean) as string[])]

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price')
    .in('id', productIds)

  if (productsError || !products || products.length < productIds.length) {
    return { error: 'Erro ao verificar preços dos produtos. Tente novamente.' }
  }

  const priceMap = new Map(products.map((p) => [p.id as string, Number(p.price)]))

  // Busca modificadores de tamanho
  const sizeModMap = new Map<string, number>()
  if (sizeIds.length > 0) {
    const { data: sizes } = await supabase
      .from('product_sizes')
      .select('id, price_modifier')
      .in('id', sizeIds)
    for (const s of sizes ?? []) {
      sizeModMap.set(s.id as string, Number(s.price_modifier ?? 0))
    }
  }

  // 5. Recomputa o total autoritativo
  let itemsSubtotal = 0
  const itemsJson: Record<string, unknown>[] = []

  for (const item of input.items) {
    const basePrice = priceMap.get(item.productId)
    if (basePrice === undefined) {
      return { error: `Produto não encontrado: ${item.productName}. Recarregue a página.` }
    }
    const sizeMod = item.sizeId ? (sizeModMap.get(item.sizeId) ?? 0) : 0
    const unitPrice = basePrice + sizeMod
    itemsSubtotal += unitPrice * item.quantity

    itemsJson.push({
      product_id: item.productId,
      color_id: item.colorId ?? '',
      size_id: item.sizeId ?? '',
      quantity: item.quantity,
      unit_price: unitPrice,
      product_name: item.productName,
      color_name: item.colorName,
      size_label: item.sizeLabel,
    })
  }

  const freight = input.freight ?? 0
  const serverTotal = itemsSubtotal + freight

  // 6. Criação atômica via RPC (header + itens em uma transação)
  const { data: orderId, error: rpcError } = await supabase.rpc('create_order_atomic', {
    p_user_id:        user.id,
    p_total:          serverTotal,
    p_freight:        input.freight,
    p_fulfillment_type: input.fulfillmentType ?? 'pickup',
    p_cep:            input.cep ?? null,
    p_street:         input.street ?? null,
    p_street_number:  input.streetNumber ?? null,
    p_neighborhood:   input.neighborhood,
    p_city:           input.city,
    p_notes:          input.notes ?? null,
    p_customer_name:  input.customerName,
    p_customer_phone: input.customerPhone,
    p_items:          JSON.stringify(itemsJson),
  })

  if (rpcError || !orderId) {
    console.error('[createOrderAction] RPC error:', rpcError)
    return { error: 'Erro ao registrar o pedido. Tente novamente.' }
  }

  return { orderId: String(orderId), serverTotal }
}
