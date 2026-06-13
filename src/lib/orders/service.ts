/**
 * service.ts — Camada de serviço para o ciclo de vida de pedidos.
 *
 * Funções puras que recebem um SupabaseClient injetado — sem acoplamento a
 * Server Actions, cookies ou Next.js. Testáveis de forma independente.
 *
 * Uso correto:
 *   // Em Server Actions:
 *   const client = await createClient()  // @/lib/supabase/server
 *   const result = await advanceOrderStatus(client, orderId, 'confirmed')
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { canTransition } from '@/lib/orders/stateMachine'
import type { FulfillmentType } from '@/types'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface ServiceResult {
  success: boolean
  error?: string
}

// ─── Helper interno ───────────────────────────────────────────────────────────

async function fetchCurrentStatus(
  client: SupabaseClient,
  orderId: string,
  orderType: 'normal' | 'custom',
): Promise<{ status: string; fulfillment_type: FulfillmentType | null } | null> {
  const table = orderType === 'custom' ? 'custom_orders' : 'orders'
  const { data, error } = await client
    .from(table)
    .select('status, fulfillment_type')
    .eq('id', orderId)
    .maybeSingle()
  if (error || !data) return null
  return {
    status: data.status as string,
    fulfillment_type: (data.fulfillment_type as FulfillmentType) ?? null,
  }
}

// ─── Funções de serviço ───────────────────────────────────────────────────────

/**
 * Avança um pedido para `nextStatus`, validando a transição via `canTransition`.
 * `extra` é usado para capturar courier_name (dispatch local) ou tracking_code (envio).
 */
export async function advanceOrderStatus(
  client: SupabaseClient,
  orderId: string,
  nextStatus: string,
  orderType: 'normal' | 'custom' = 'normal',
  extra?: { courier_name?: string; tracking_code?: string },
): Promise<ServiceResult> {
  const current = await fetchCurrentStatus(client, orderId, orderType)
  if (!current) return { success: false, error: 'Pedido não encontrado' }

  // custom_orders não têm fulfillment_type; o ciclo de produção é linear
  const fulfillment = orderType === 'normal' ? current.fulfillment_type : null

  if (!canTransition(current.status, nextStatus, fulfillment)) {
    return {
      success: false,
      error: `Transição inválida: ${current.status} → ${nextStatus}`,
    }
  }

  const table = orderType === 'custom' ? 'custom_orders' : 'orders'
  const payload: Record<string, unknown> = { status: nextStatus }
  if (extra?.courier_name !== undefined) payload.courier_name = extra.courier_name
  if (extra?.tracking_code !== undefined) payload.tracking_code = extra.tracking_code

  const { error } = await client.from(table).update(payload).eq('id', orderId)
  if (error) return { success: false, error: error.message }

  return { success: true }
}

/** pending → confirmed */
export async function confirmOrder(
  client: SupabaseClient,
  orderId: string,
  orderType: 'normal' | 'custom' = 'normal',
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'confirmed', orderType)
}

/** Qualquer estado não-terminal → cancelled */
export async function cancelOrder(
  client: SupabaseClient,
  orderId: string,
  orderType: 'normal' | 'custom' = 'normal',
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'cancelled', orderType)
}

/** ready → out_for_delivery + registra courier_name (apenas delivery) */
export async function dispatchLocal(
  client: SupabaseClient,
  orderId: string,
  courierName: string,
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'out_for_delivery', 'normal', {
    courier_name: courierName,
  })
}

/** ready → shipped + registra tracking_code (apenas shipping/correios) */
export async function markShipped(
  client: SupabaseClient,
  orderId: string,
  trackingCode?: string,
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'shipped', 'normal', {
    tracking_code: trackingCode,
  })
}

/** ready → delivered (retirada, sem etapa intermediária) */
export async function markPickedUp(
  client: SupabaseClient,
  orderId: string,
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'delivered', 'normal')
}

/** out_for_delivery | shipped → delivered */
export async function markDelivered(
  client: SupabaseClient,
  orderId: string,
): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'delivered', 'normal')
}
