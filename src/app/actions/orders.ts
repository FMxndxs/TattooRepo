'use server'

/**
 * actions/orders.ts — Server Actions para o ciclo de vida de pedidos.
 *
 * São wrappers finos que:
 *   1. Verificam autenticação e permissão de admin
 *   2. Delegam à camada de serviço (service.ts)
 *   3. Chamam revalidatePath após sucesso
 *
 * Nunca contêm lógica de negócio — essa responsabilidade é de service.ts.
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  advanceOrderStatus,
  cancelOrder,
  dispatchLocal,
  markShipped,
  markPickedUp,
  markDelivered,
} from '@/lib/orders/service'
import type { OrderType } from '@/lib/admin/orders'

// ─── Helper de autorização ────────────────────────────────────────────────────

async function assertAdmin() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: profile } = await client
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) throw new Error('Acesso negado: requer permissão de admin')

  return client
}

function revalidateOrders() {
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
}

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * Avança o status de um pedido ou custom_order para `nextStatus`.
 * Valida a transição antes de executar.
 */
export async function advanceOrderStatusAction(
  orderId: string,
  nextStatus: string,
  orderType: OrderType = 'normal',
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await advanceOrderStatus(client, orderId, nextStatus, orderType)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Cancela um pedido (qualquer estado não-terminal → cancelled).
 */
export async function cancelOrderAction(
  orderId: string,
  orderType: OrderType = 'normal',
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await cancelOrder(client, orderId, orderType)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Despacha para entrega local: ready → out_for_delivery.
 * Registra o nome do entregador.
 */
export async function dispatchLocalAction(
  orderId: string,
  courierName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await dispatchLocal(client, orderId, courierName)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Registra envio pelos correios: ready → shipped.
 * Opcionalmente registra o código de rastreamento.
 */
export async function markShippedAction(
  orderId: string,
  trackingCode?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await markShipped(client, orderId, trackingCode)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Marca como retirado (pickup): ready → delivered.
 */
export async function markPickedUpAction(
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await markPickedUp(client, orderId)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Marca como entregue: out_for_delivery | shipped → delivered.
 */
export async function markDeliveredAction(
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const result = await markDelivered(client, orderId)
    if (result.success) revalidateOrders()
    return result
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
