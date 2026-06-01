'use client'

import { useState } from 'react'
import { ChevronDown, Package } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { STATUS_DISPLAY } from '@/lib/admin/orders'
import { formatBRL } from '@/lib/utils/formatters'
import type { Order } from '@/types'

interface OrderHistoryCardProps {
  order: Order
}

function itemsSummary(order: Order): string {
  if (!order.items?.length) return 'Sem itens'
  const parts = order.items.map((i) => {
    const name = i.product?.name ?? 'Produto'
    return i.quantity > 1 ? `${i.quantity}× ${name}` : name
  })
  return parts.join(', ')
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const reduced = useReducedMotion()

  const statusMeta = STATUS_DISPLAY[order.status] ?? STATUS_DISPLAY['pending']
  const date = new Date(order.created_at).toLocaleDateString('pt-BR')
  const summary = itemsSummary(order)

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Card header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 flex flex-col gap-3 hover:bg-zinc-800/40 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              <Package className="w-3 h-3" />
              Pedido
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
            <span className="text-brand-300 font-bold text-sm">
              {formatBRL(order.total)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-zinc-500 text-xs">{date}</span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </motion.span>
          </div>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{summary}</p>
      </button>

      {/* Expanded items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="items"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0.08 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-5 py-4 space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Qtd */}
                      <span className="shrink-0 text-xs font-bold text-brand-300 bg-brand-700/15 rounded-full w-7 h-7 flex items-center justify-center">
                        {item.quantity}×
                      </span>

                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {item.product?.name ?? 'Produto'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {/* Cor */}
                          {item.color && (
                            <span className="flex items-center gap-1 text-xs text-zinc-400">
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-zinc-700 shrink-0"
                                style={{ backgroundColor: item.color.hex_code }}
                                aria-label={item.color.name}
                              />
                              {item.color.name}
                            </span>
                          )}
                          {/* Tamanho */}
                          {item.size && (
                            <span className="text-xs text-zinc-500">{item.size.label}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-zinc-300 font-semibold tabular-nums">
                      {formatBRL(item.unit_price)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">Detalhes dos itens não disponíveis.</p>
              )}

              {/* Total */}
              <div className="pt-2 border-t border-zinc-800/60 flex justify-between text-sm font-bold">
                <span className="text-zinc-400">Total</span>
                <span className="text-brand-300 tabular-nums">{formatBRL(order.total)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
