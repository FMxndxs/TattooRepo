/**
 * service.ts — Camada de serviço para o ciclo de vida de orçamentos
 * (custom_orders). Funções puras que recebem um SupabaseClient injetado —
 * sem acoplamento a Server Actions, cookies ou Next.js. Testáveis de forma
 * independente.
 *
 * Uso correto:
 *   // Em Server Actions:
 *   const client = await createClient()  // @/lib/supabase/server
 *   const result = await advanceOrderStatus(client, orderId, 'reviewing')
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { canTransition } from '@/lib/orders/stateMachine'

export interface ServiceResult {
  success: boolean
  error?: string
}

async function fetchCurrentStatus(client: SupabaseClient, orderId: string): Promise<string | null> {
  const { data, error } = await client
    .from('custom_orders')
    .select('status')
    .eq('id', orderId)
    .maybeSingle()
  if (error || !data) return null
  return data.status as string
}

/** Avança um orçamento para `nextStatus`, validando a transição via `canTransition`. */
export async function advanceOrderStatus(
  client: SupabaseClient,
  orderId: string,
  nextStatus: string,
): Promise<ServiceResult> {
  const current = await fetchCurrentStatus(client, orderId)
  if (current === null) return { success: false, error: 'Orçamento não encontrado' }

  if (!canTransition(current, nextStatus)) {
    return { success: false, error: `Transição inválida: ${current} → ${nextStatus}` }
  }

  const { error } = await client.from('custom_orders').update({ status: nextStatus }).eq('id', orderId)
  if (error) return { success: false, error: error.message }

  return { success: true }
}

/** Qualquer estado não-terminal → cancelled. */
export async function cancelOrder(client: SupabaseClient, orderId: string): Promise<ServiceResult> {
  return advanceOrderStatus(client, orderId, 'cancelled')
}
