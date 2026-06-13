import type { Order, CustomOrder, OrderItem } from '@/types'
import {
  STATUS_META,
  ORDER_STATUS_OPTIONS,
  type StatusMeta,
} from '@/lib/orders/stateMachine'

// ─── Re-exports ───────────────────────────────────────────────────────────────
// Mantém compatibilidade com componentes que importam deste módulo.

export type { StatusMeta }

/** @deprecated Use STATUS_META de '@/lib/orders/stateMachine' */
export const STATUS_DISPLAY: Record<string, StatusMeta> = STATUS_META

/** @deprecated Use ORDER_STATUS_OPTIONS de '@/lib/orders/stateMachine' */
export const ADMIN_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.map((value) => ({
  value,
  label: STATUS_META[value]?.label ?? value,
}))

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Status operacionais no painel admin (ciclo de produção + cancelado). */
export type AdminStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'finishing'
  | 'ready'
  | 'out_for_delivery'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderType = 'normal' | 'custom'

export interface AdminOrderRow {
  id: string
  type: OrderType
  customer_name: string
  customer_phone: string
  status: string
  created_at: string
  /** Resumo dos itens (pedido normal) ou descrição (pedido personalizado) */
  summary: string
  /** Código amigável gerado pelo banco (ex. A4F9). Ausente/null em registros antigos pré-mig026. */
  order_code?: string | null
  /** Modalidade de atendimento (apenas pedidos normais). */
  fulfillment_type?: string | null
  total?: number
  reference_url?: string | null
  reference_image_url?: string | null
  // Endereço e frete — presentes apenas em pedidos normais
  freight?: number | null
  cep?: string | null
  street?: string | null
  street_number?: string | null
  neighborhood?: string
  city?: string
  notes?: string | null
  courier_name?: string | null
  tracking_code?: string | null
  items?: OrderItem[]
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

function itemsSummary(order: Order): string {
  if (!order.items?.length) return 'Sem itens'
  const parts = order.items.map((i) => {
    const name = i.product_name ?? i.product?.name ?? 'Produto'
    return i.quantity > 1 ? `${i.quantity}× ${name}` : name
  })
  return parts.join(', ')
}

// ─── Normalizador ─────────────────────────────────────────────────────────────

/**
 * Combina orders e custom_orders em uma lista uniforme AdminOrderRow[],
 * ordenada por data de criação (mais recente primeiro).
 */
export function normalizeOrders(
  orders: Order[],
  customOrders: CustomOrder[],
): AdminOrderRow[] {
  const normal: AdminOrderRow[] = orders.map((o) => ({
    id: o.id,
    type: 'normal',
    customer_name: o.customer_name || '—',
    customer_phone: o.customer_phone || '—',
    status: o.status,
    created_at: o.created_at,
    summary: itemsSummary(o),
    order_code: o.order_code ?? null,
    fulfillment_type: o.fulfillment_type ?? null,
    total: o.total,
    freight: o.freight,
    cep: o.cep,
    street: o.street,
    street_number: o.street_number,
    neighborhood: o.neighborhood,
    city: o.city,
    notes: o.notes,
    courier_name: o.courier_name ?? null,
    tracking_code: o.tracking_code ?? null,
    items: o.items,
  }))

  const custom: AdminOrderRow[] = customOrders.map((c) => ({
    id: c.id!,
    type: 'custom',
    customer_name: c.customer_name || '—',
    customer_phone: c.customer_phone || '—',
    status: c.status ?? 'pending',
    created_at: c.created_at!,
    summary: c.description,
    order_code: c.order_code ?? null,
    reference_url: c.reference_url,
    reference_image_url: c.reference_image_url,
  }))

  // Mais recentes primeiro
  return [...normal, ...custom].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}
