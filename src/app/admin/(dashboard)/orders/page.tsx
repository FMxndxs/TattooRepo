import { createClient } from '@/lib/supabase/server'
import { MessageSquare } from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10' },
  reviewing: { label: 'Em análise', color: 'text-blue-400 bg-blue-400/10' },
  quoted: { label: 'Orçado', color: 'text-purple-400 bg-purple-400/10' },
  accepted: { label: 'Aceito', color: 'text-green-400 bg-green-400/10' },
  rejected: { label: 'Recusado', color: 'text-red-400 bg-red-400/10' },
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pedidos Personalizados</h1>
        <p className="text-zinc-400 mt-1">{orders?.length ?? 0} solicitações recebidas</p>
      </div>

      <div className="space-y-4">
        {!orders?.length && (
          <div className="py-16 text-center text-zinc-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum pedido personalizado ainda.</p>
          </div>
        )}

        {orders?.map((order) => {
          const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending
          const date = new Date(order.created_at).toLocaleDateString('pt-BR')
          return (
            <div key={order.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{order.customer_name}</p>
                  <p className="text-zinc-400 text-sm">{order.customer_phone} · {date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-3">{order.description}</p>
              <div className="flex flex-wrap gap-3">
                {order.reference_url && (
                  <a href={order.reference_url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-400 text-xs hover:underline">
                    Ver referência →
                  </a>
                )}
                {order.reference_image_url && (
                  <a href={order.reference_image_url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-400 text-xs hover:underline">
                    Ver imagem →
                  </a>
                )}
                <a
                  href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${order.customer_name}! Sobre seu pedido personalizado...`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-green-400 text-xs hover:underline"
                >
                  Responder no WhatsApp →
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
