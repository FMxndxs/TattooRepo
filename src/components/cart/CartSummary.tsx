import { formatBRL } from '@/lib/utils/formatters'

interface CartSummaryProps {
  itemCount: number
  total: number
}

export function CartSummary({ itemCount, total }: CartSummaryProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-3">
      <h2 className="text-white font-bold text-lg">Resumo do pedido</h2>
      <div className="flex justify-between text-zinc-400 text-sm">
        <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
      </div>
      <div className="border-t border-zinc-800 pt-3 flex justify-between">
        <span className="text-white font-semibold">Total</span>
        <span className="text-brand-300 font-black text-xl">{formatBRL(total)}</span>
      </div>
    </div>
  )
}
