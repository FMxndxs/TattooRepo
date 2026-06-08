import type { Order, CustomOrder, OrderItem } from '@/types'

export type AdminStatus = 'pending' | 'in_production' | 'completed' | 'cancelled'
export type OrderType = 'normal' | 'custom'

export interface AdminOrderRow {
  id: string
  type: OrderType
  customer_name: string
  customer_phone: string
  status: string
  created_at: string
  /** Formatted summary of items (normal) or description (custom) */
  summary: string
  total?: number
  reference_url?: string | null
  reference_image_url?: string | null
  // Endereço e frete — presentes apenas em pedidos normais (tipo 'normal')
  freight?: number | null
  cep?: string | null
  street?: string | null
  street_number?: string | null
  neighborhood?: string
  city?: string
  notes?: string | null
  items?: OrderItem[]
}

export const ADMIN_STATUS_OPTIONS: { value: AdminStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_production', label: 'Em produção' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

export const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10' },
  in_production: { label: 'Em produção', color: 'text-blue-400 bg-blue-400/10' },
  completed: { label: 'Concluído', color: 'text-green-400 bg-green-400/10' },
  cancelled: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10' },
  // Legacy custom_order statuses (display only, not selectable)
  reviewing: { label: 'Em análise', color: 'text-blue-400 bg-blue-400/10' },
  quoted: { label: 'Orçado', color: 'text-purple-400 bg-purple-400/10' },
  accepted: { label: 'Aceito', color: 'text-green-400 bg-green-400/10' },
  rejected: { label: 'Recusado', color: 'text-red-400 bg-red-400/10' },
  // Legacy order_status values
  confirmed: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10' },
  shipped: { label: 'Enviado', color: 'text-purple-400 bg-purple-400/10' },
  delivered: { label: 'Entregue', color: 'text-green-400 bg-green-400/10' },
}

function itemsSummary(order: Order): string {
  if (!order.items?.length) return 'Sem itens'
  const parts = order.items.map((i) => {
    const name = i.product?.name ?? 'Produto'
    return i.quantity > 1 ? `${i.quantity}× ${name}` : name
  })
  return parts.join(', ')
}

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
    total: o.total,
    freight: o.freight,
    cep: o.cep,
    street: o.street,
    street_number: o.street_number,
    neighborhood: o.neighborhood,
    city: o.city,
    notes: o.notes,
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
    reference_url: c.reference_url,
    reference_image_url: c.reference_image_url,
  }))

  return [...normal, ...custom].sort((a, b) =>
    a.customer_name.localeCompare(b.customer_name, 'pt-BR', { sensitivity: 'base' }),
  )
}
