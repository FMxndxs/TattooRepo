/**
 * Página de Despacho / Expedição
 *
 * Mostra pedidos no estado `ready`, agrupados por fulfillment_type.
 * Permite:
 *  - delivery: definir courier_name e avançar para out_for_delivery
 *  - shipping: registrar tracking_code e avançar para shipped
 *  - pickup: marcar como entregue diretamente
 */

import { createClient } from '@/lib/supabase/server'
import { DispatchPanel } from '@/components/admin/DispatchPanel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Despacho — Admin Imagination 3D',
  robots: { index: false, follow: false },
}

export default async function DespachPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, order_code, customer_name, customer_phone,
      fulfillment_type, courier_name, tracking_code,
      total, freight, street, street_number, neighborhood, city, cep,
      created_at
    `)
    .eq('status', 'ready')
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Despacho</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Pedidos prontos aguardando envio, entrega ou retirada.
        </p>
      </div>

      <DispatchPanel initialOrders={orders ?? []} />
    </div>
  )
}
