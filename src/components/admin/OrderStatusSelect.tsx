'use client'

import { useState, useTransition } from 'react'
import { nextStatuses, STATUS_META } from '@/lib/orders/stateMachine'
import { advanceOrderStatusAction } from '@/app/actions/orders'

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Monta opções: estado atual (desabilitado) + próximos válidos
  const validNext = nextStatuses(status)

  function handleChange(next: string) {
    if (next === status) return
    const prev = status
    setStatus(next)
    setError(null)

    startTransition(async () => {
      const result = await advanceOrderStatusAction(orderId, next)
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
        aria-label="Status do orçamento"
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
