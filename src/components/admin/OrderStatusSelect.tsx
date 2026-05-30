'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { ADMIN_STATUS_OPTIONS, type AdminStatus, type OrderType } from '@/lib/admin/orders'

interface OrderStatusSelectProps {
  orderId: string
  orderType: OrderType
  currentStatus: string
}

export function OrderStatusSelect({ orderId, orderType, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(next: string) {
    const prev = status
    setStatus(next)
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const table = orderType === 'custom' ? 'custom_orders' : 'orders'
    const { error: updateError } = await supabase
      .from(table)
      .update({ status: next })
      .eq('id', orderId)

    setSaving(false)

    if (updateError) {
      setStatus(prev)
      setError('Erro ao salvar')
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 disabled:opacity-50 cursor-pointer transition-colors hover:border-zinc-500"
        aria-label="Status do pedido"
      >
        {ADMIN_STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
