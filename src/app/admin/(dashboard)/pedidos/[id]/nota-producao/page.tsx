/**
 * Nota de Produção — imprimível via Ctrl+P / window.print()
 *
 * Mostra: código do pedido, itens, cores, tamanhos, quantidades, observações.
 * NÃO mostra endereço, total nem dados de frete (informação da cozinha/produção).
 */

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrintButton } from '@/components/admin/PrintButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nota de Produção',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function NotaProducaoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_code, customer_name, notes, created_at,
      items:order_items(
        id, quantity, unit_price,
        product_name, color_name, size_label,
        product:products(name),
        color:colors(name),
        size:product_sizes(label)
      )
    `)
    .eq('id', id)
    .maybeSingle()

  if (!order) notFound()

  const createdAt = new Date(order.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      {/* Botão de impressão — não aparece no print */}
      <div className="no-print flex items-center gap-3 p-4 bg-zinc-950 border-b border-zinc-800">
        <PrintButton />
        <a href="/admin/orders" className="text-zinc-400 text-sm hover:text-white">
          ← Voltar para pedidos
        </a>
      </div>

      {/* Ticket imprimível */}
      <div className="ticket-print p-8 max-w-sm mx-auto font-mono text-sm text-black bg-white min-h-screen">
        <div className="text-center mb-6 border-b border-black pb-4">
          <p className="font-bold text-lg">IMAGINATION 3D</p>
          <p className="text-xs">NOTA DE PRODUÇÃO</p>
        </div>

        <div className="mb-4">
          {order.order_code && (
            <p className="font-bold text-xl tracking-widest text-center mb-2">
              #{order.order_code}
            </p>
          )}
          <p><span className="font-bold">Cliente:</span> {order.customer_name}</p>
          <p><span className="font-bold">Data:</span> {createdAt}</p>
        </div>

        <div className="border-t border-dashed border-black pt-4 mb-4">
          <p className="font-bold mb-2">ITENS</p>
          {order.items && order.items.length > 0 ? (
            <ul className="space-y-2">
              {(order.items as unknown as Array<{
                id: string
                quantity: number
                product_name: string | null
                color_name: string | null
                size_label: string | null
                product?: { name: string } | null
                color?: { name: string } | null
                size?: { label: string } | null
              }>).map((item) => {
                const name = item.product_name ?? item.product?.name ?? 'Produto'
                const color = item.color_name ?? (item.color as { name: string } | null)?.name
                const size = item.size_label ?? (item.size as { label: string } | null)?.label
                return (
                  <li key={item.id} className="leading-snug">
                    <span className="font-bold">{item.quantity}×</span> {name}
                    {color && <span className="block pl-4 text-xs">Cor: {color}</span>}
                    {size && <span className="block pl-4 text-xs">Tamanho: {size}</span>}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-xs italic">Sem itens registrados</p>
          )}
        </div>

        {order.notes && (
          <div className="border-t border-dashed border-black pt-4 mb-4">
            <p className="font-bold mb-1">OBSERVAÇÕES</p>
            <p className="leading-relaxed">{order.notes}</p>
          </div>
        )}

        <div className="border-t border-dashed border-black pt-4 text-center text-xs">
          <p>imagination3d.com.br</p>
        </div>
      </div>

      {/* CSS de impressão — isolado no head via tag style */}
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
