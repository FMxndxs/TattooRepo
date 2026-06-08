import { formatBRL } from '@/lib/utils/formatters'
import type { DeliveryQuote } from '@/types'

interface CartSummaryProps {
  itemCount: number
  total: number
  deliveryQuote?: DeliveryQuote | null
}

export function CartSummary({ itemCount, total, deliveryQuote }: CartSummaryProps) {
  const freight = deliveryQuote?.freight ?? null
  const grandTotal = total + (freight ?? 0)

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-3">
      <h2 className="text-white font-bold text-lg">Resumo do pedido</h2>

      <div className="flex justify-between text-zinc-400 text-sm">
        <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
        <span>{formatBRL(total)}</span>
      </div>

      {/* Linha de frete */}
      <div className="flex justify-between text-zinc-400 text-sm">
        <span>Frete</span>
        <span>
          {!deliveryQuote && '—'}
          {deliveryQuote?.mode === 'delivery' && freight !== null && (
            <span className="text-green-400">{formatBRL(freight)}</span>
          )}
          {deliveryQuote?.mode === 'pickup_or_courier' && (
            <span className="text-amber-400">a combinar</span>
          )}
          {deliveryQuote?.mode === 'unknown' && (
            <span className="text-zinc-500">a combinar</span>
          )}
        </span>
      </div>

      <div className="border-t border-zinc-800 pt-3 flex justify-between">
        <span className="text-white font-semibold">Total</span>
        <div className="text-right">
          <span className="text-brand-300 font-black text-xl">{formatBRL(grandTotal)}</span>
          {(deliveryQuote?.mode === 'pickup_or_courier' || deliveryQuote?.mode === 'unknown') && (
            <p className="text-zinc-500 text-xs mt-0.5">+ frete a combinar</p>
          )}
        </div>
      </div>
    </div>
  )
}
