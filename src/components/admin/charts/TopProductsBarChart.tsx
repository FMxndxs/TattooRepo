'use client'

import { formatBRL } from '@/lib/utils/formatters'

interface TopProductRow {
  product_name: string
  color_name: string | null
  order_count: number
  total_qty: number
  total_revenue: number
}

interface Props {
  data: TopProductRow[]
  maxItems?: number
}

export function TopProductsBarChart({ data, maxItems = 8 }: Props) {
  if (data.length === 0) {
    return <p className="text-zinc-600 text-sm py-4">Sem dados no período.</p>
  }

  const items = data.slice(0, maxItems)
  const maxRevenue = Math.max(...items.map((r) => Number(r.total_revenue)), 1)

  return (
    <div className="space-y-2.5">
      {items.map((row, i) => {
        const pct = (Number(row.total_revenue) / maxRevenue) * 100
        const label = row.color_name ? `${row.product_name} — ${row.color_name}` : row.product_name
        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1 gap-2">
              <span
                className="text-xs text-zinc-300 truncate flex-1 min-w-0"
                title={label}
              >
                {label}
              </span>
              <span className="text-xs font-semibold text-brand-300 whitespace-nowrap">
                {formatBRL(row.total_revenue)}
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex gap-3 mt-0.5">
              <span className="text-[10px] text-zinc-600">{row.order_count} pedido{row.order_count !== 1 ? 's' : ''}</span>
              <span className="text-[10px] text-zinc-600">{row.total_qty} un.</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
