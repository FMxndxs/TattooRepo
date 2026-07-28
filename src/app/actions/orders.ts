'use server'

/**
 * actions/orders.ts — Server Actions para o ciclo de vida de orçamentos (custom_orders).
 *
 * Um estúdio de tatuagem não envia produtos físicos — orçamentos são processados
 * através do ciclo de cotação e aceção, sem despacho/rastreamento.
 *
 * São wrappers finos que:
 *   1. Verificam autenticação e permissão de admin
 *   2. Delegam à camada de serviço (service.ts)
 *   3. Chamam revalidatePath após sucesso
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  advanceOrderStatus,
  cancelOrder,
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
 * Avança o status de um orçamento (custom_order) para `nextStatus`.
 * Valida a transição antes de executar.
 */
export async function advanceOrderStatusAction(
  orderId: string,
  nextStatus: string,
  orderType: OrderType = 'custom',
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
 * Cancela um orçamento (qualquer estado não-terminal → cancelled).
 */
export async function cancelOrderAction(
  orderId: string,
  orderType: OrderType = 'custom',
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
