import type { CustomOrder } from '@/types'
import { STATUS_META, CUSTOM_ORDER_STATUS_OPTIONS, type StatusMeta } from '@/lib/orders/stateMachine'

export type { StatusMeta }
export { STATUS_META, CUSTOM_ORDER_STATUS_OPTIONS }

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Status do ciclo de orçamento exibidos no painel admin. */
export type AdminStatus = 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'cancelled'

export interface AdminOrderRow {
  id: string
  customer_name: string
  customer_phone: string
  status: string
  created_at: string
  /** Descrição do orçamento. */
  summary: string
  /** Código amigável gerado pelo banco (ex. A4F9). Ausente em registros antigos pré-mig026. */
  order_code?: string | null
  reference_url?: string | null
  reference_image_url?: string | null
}

// ─── Normalizador ─────────────────────────────────────────────────────────────

/** Converte custom_orders em AdminOrderRow[], ordenado por data (mais recente primeiro). */
export function normalizeOrders(customOrders: CustomOrder[]): AdminOrderRow[] {
  return customOrders
    .map((c) => ({
      id: c.id!,
      customer_name: c.customer_name || '—',
      customer_phone: c.customer_phone || '—',
      status: c.status ?? 'pending',
      created_at: c.created_at!,
      summary: c.description,
      order_code: c.order_code ?? null,
      reference_url: c.reference_url,
      reference_image_url: c.reference_image_url,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
