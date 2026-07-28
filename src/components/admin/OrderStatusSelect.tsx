'use client'

import { useState, useTransition } from 'react'
import { nextStatuses, STATUS_META } from '@/lib/orders/stateMachine'
import { advanceOrderStatusAction } from '@/app/actions/orders'
import type { OrderType } from '@/lib/admin/orders'
import type { FulfillmentType } from '@/types'

interface OrderStatusSelectProps {
  orderId: string
  orderType: OrderType
  currentStatus: string
  /** Necessário para inferir transições corretas no estado `ready` */
  fulfillmentType?: FulfillmentType | null
}

export function OrderStatusSelect({
  orderId,
  orderType,
  currentStatus,
  fulfillmentType,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Monta opções: estado atual (desabilitado) + próximos válidos
  const validNext = nextStatuses(status, fulfillmentType)

  function handleChange(next: string) {
    if (next === status) return
    const prev = status
    setStatus(next)
    setError(null)

    startTransition(async () => {
      const result = await advanceOrderStatusAction(orderId, next, orderType)
      if (!result.success) {
        setStatus(prev)
        setError(result.error ?? 'Erro ao salvar')
      }
    })
  }

  const currentMeta = STATUS_META[status]

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending || validNext.length === 0}
        className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 disabled:opacity-50 cursor-pointer transition-colors hover:border-zinc-500"
        aria-label="Status do pedido"
      >
        {/* Status atual (não é transição) */}
        <option value={status} disabled>
          {currentMeta?.label ?? status}
        </option>
        {/* Próximos estados válidos */}
        {validNext.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s]?.label ?? s}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
