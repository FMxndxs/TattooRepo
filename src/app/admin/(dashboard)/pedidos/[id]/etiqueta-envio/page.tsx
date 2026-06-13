/**
 * Etiqueta de Envio — imprimível via Ctrl+P / window.print()
 *
 * Mostra: código, cliente, endereço completo, total, fulfillment, courier/tracking.
 * Apenas para pedidos com fulfillment_type = delivery | shipping.
 */

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/utils/formatters'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Etiqueta de Envio',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EtiquetaEnvioPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_code, customer_name, customer_phone,
      status, fulfillment_type, courier_name, tracking_code,
      total, freight, cep, street, street_number, neighborhood, city,
      notes, created_at
    `)
    .eq('id', id)
    .maybeSingle()

  if (!order) notFound()

  // Etiqueta só faz sentido para delivery/shipping
  const isDeliverable = order.fulfillment_type === 'delivery' || order.fulfillment_type === 'shipping'

  const createdAt = new Date(order.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const address = [
    order.street && order.street_number
      ? `${order.street}, ${order.street_number}`
      : order.street,
    order.neighborhood,
    order.city,
    order.cep ? `CEP ${order.cep}` : null,
  ]
    .filter(Boolean)
    .join(' — ')

  return (
    <>
      {/* Botão de impressão — não aparece no print */}
      <div className="no-print flex items-center gap-3 p-4 bg-zinc-950 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-brand-700 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Imprimir (Ctrl+P)
        </button>
        <a href="/admin/orders" className="text-zinc-400 text-sm hover:text-white">
          ← Voltar para pedidos
        </a>
        {!isDeliverable && (
          <span className="text-amber-400 text-xs">
            ⚠ Pedido sem fulfillment de envio — etiqueta pode estar incompleta.
          </span>
        )}
      </div>

      {/* Ticket imprimível */}
      <div className="ticket-print p-8 max-w-sm mx-auto font-mono text-sm text-black bg-white min-h-screen">
        <div className="text-center mb-6 border-b border-black pb-4">
          <p className="font-bold text-lg">IMAGINATION 3D</p>
          <p className="text-xs">ETIQUETA DE ENVIO</p>
        </div>

        <div className="mb-4">
          {order.order_code && (
            <p className="font-bold text-xl tracking-widest text-center mb-2">
              #{order.order_code}
            </p>
          )}
          <p className="text-xs text-center mb-4">{createdAt}</p>

          <div className="border border-black p-3 mb-3">
            <p className="font-bold mb-1">DESTINATÁRIO</p>
            <p className="font-bold">{order.customer_name}</p>
            <p>{order.customer_phone}</p>
          </div>

          {address && (
            <div className="border border-black p-3 mb-3">
              <p className="font-bold mb-1">ENDEREÇO</p>
              <p className="leading-relaxed">{address}</p>
            </div>
          )}

          <div className="border border-black p-3 mb-3">
            <p className="font-bold mb-1">MODALIDADE</p>
            {order.fulfillment_type === 'delivery' && (
              <p>Entrega própria{order.courier_name ? ` — ${order.courier_name}` : ''}</p>
            )}
            {order.fulfillment_type === 'shipping' && (
              <p>Envio pelos correios{order.tracking_code ? ` — ${order.tracking_code}` : ''}</p>
            )}
            {order.fulfillment_type === 'pickup' && <p>Retirada</p>}
            {!order.fulfillment_type && <p>A definir</p>}
          </div>
        </div>

        <div className="border-t border-dashed border-black pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">TOTAL</span>
            <span className="font-bold text-lg">{formatBRL(order.total)}</span>
          </div>
          {order.freight != null && (
            <div className="flex justify-between items-center text-xs mt-1">
              <span>Frete</span>
              <span>{formatBRL(order.freight)}</span>
            </div>
          )}
        </div>

        {order.notes && (
          <div className="border-t border-dashed border-black pt-4 mb-4">
            <p className="font-bold mb-1">OBS</p>
            <p className="leading-relaxed">{order.notes}</p>
          </div>
        )}

        <div className="border-t border-dashed border-black pt-4 text-center text-xs">
          <p>imagination3d.com.br</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .ticket-print {
            margin: 0 !important;
            padding: 1cm !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  )
}
