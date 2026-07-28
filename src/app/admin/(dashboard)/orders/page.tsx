import { createClient } from '@/lib/supabase/server'
import { normalizeOrders } from '@/lib/admin/orders'
import { OrdersPanel } from '@/components/admin/OrdersPanel'
import type { CustomOrder } from '@/types'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: rawCustom } = await supabase
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false })

  const orders = normalizeOrders((rawCustom ?? []) as CustomOrder[])

  const total = orders.length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
        <p className="text-zinc-400 mt-1">{total} orçamento{total !== 1 ? 's' : ''} no total</p>
      </div>

      <OrdersPanel orders={orders} />
    </div>
  )
}
