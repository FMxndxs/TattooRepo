import { createClient } from '@/lib/supabase/server'
import { ProductionQueue } from '@/components/admin/ProductionQueue'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fila de Produção — Admin Imagination 3D',
  robots: { index: false, follow: false },
}

export default async function ProducaoPage() {
  const supabase = await createClient()

  // Pedidos normais em produção
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, order_code, customer_name, status, fulfillment_type, total, created_at,
      items:order_items(product_name, quantity)
    `)
    .in('status', ['confirmed', 'in_production', 'finishing'])
    .order('created_at', { ascending: true })

  // Pedidos personalizados em produção (accepted = aguardando iniciar)
  const { data: customOrders } = await supabase
    .from('custom_orders')
    .select('id, order_code, customer_name, status, description, created_at')
    .in('status', ['accepted', 'in_production', 'finishing'])
    .order('created_at', { ascending: true })

  // Normalizar para o formato ProductionCard
  const normalOrders = (orders ?? []).map((o) => ({
    id: o.id,
    type: 'normal' as const,
    order_code: o.order_code ?? null,
    customer_name: o.customer_name || '—',
    status: o.status,
    fulfillment_type: o.fulfillment_type ?? null,
    summary: (o.items as Array<{ product_name: string | null; quantity: number }>)
      ?.map((i) => i.quantity > 1 ? `${i.quantity}× ${i.product_name ?? 'Produto'}` : (i.product_name ?? 'Produto'))
      .join(', ') ?? '',
    total: o.total ?? null,
    created_at: o.created_at,
  }))

  const customOrderCards = (customOrders ?? []).map((c) => ({
    id: c.id,
    type: 'custom' as const,
    order_code: c.order_code ?? null,
    customer_name: c.customer_name || '—',
    status: c.status,
    fulfillment_type: null,
    summary: c.description ?? '',
    total: null,
    created_at: c.created_at,
  }))

  const initialCards = [...normalOrders, ...customOrderCards].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Fila de Produção</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Pedidos confirmados e em impressão. Atualiza em tempo real.
        </p>
      </div>

      <ProductionQueue initialCards={initialCards} />
    </div>
  )
}
