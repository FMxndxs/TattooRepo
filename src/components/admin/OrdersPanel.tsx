'use client'

import { useState } from 'react'
import { Package, MessageSquare, Search } from 'lucide-react'
import { OrderStatusSelect } from './OrderStatusSelect'
import {
  STATUS_DISPLAY,
  type AdminOrderRow,
  type OrderType,
} from '@/lib/admin/orders'

type TabValue = 'all' | 'normal' | 'custom'

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'normal', label: 'Normais' },
  { value: 'custom', label: 'Customizados' },
]

interface OrdersPanelProps {
  orders: AdminOrderRow[]
}

export function OrdersPanel({ orders }: OrdersPanelProps) {
  const [tab, setTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) => {
    if (tab === 'normal' && o.type !== 'normal') return false
    if (tab === 'custom' && o.type !== 'custom') return false
    if (search) {
      const q = search.toLowerCase()
      return (
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div>
      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === value
                  ? 'bg-brand-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="search"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <span className="text-zinc-500 text-sm shrink-0">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-zinc-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum pedido encontrado.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map((order, i) => {
          const prev = i > 0 ? filtered[i - 1] : null
          const showCustomerHeader =
            !prev ||
            order.customer_name.localeCompare(prev.customer_name, 'pt-BR', { sensitivity: 'base' }) !== 0

          const statusMeta = STATUS_DISPLAY[order.status] ?? STATUS_DISPLAY['pending']
          const date = new Date(order.created_at).toLocaleDateString('pt-BR')
          const phone = order.customer_phone.replace(/\D/g, '')
          const waText = encodeURIComponent(`Olá ${order.customer_name}! Sobre seu pedido...`)

          return (
            <div key={order.id}>
              {showCustomerHeader && (
                <div className="pt-4 pb-2 first:pt-0">
                  <span className="text-brand-300 font-bold uppercase tracking-widest text-xs">
                    {order.customer_name}
                  </span>
                  <div className="mt-1 h-px bg-zinc-800" />
                </div>
              )}

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.type === 'custom' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-700/20 text-brand-300">
                        <MessageSquare className="w-3 h-3" />
                        Custom
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        <Package className="w-3 h-3" />
                        Normal
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusMeta.color}`}>
                      {statusMeta.label}
                    </span>
                    {order.total !== undefined && (
                      <span className="text-zinc-400 text-xs">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 text-xs shrink-0">{date}</span>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {order.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-zinc-500 text-xs">{order.customer_phone}</span>

                  <a
                    href={`https://wa.me/${phone}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 text-xs hover:underline"
                  >
                    WhatsApp →
                  </a>

                  {order.reference_url && (
                    <a href={order.reference_url} target="_blank" rel="noopener noreferrer"
                      className="text-brand-300 text-xs hover:underline">
                      Referência →
                    </a>
                  )}
                  {order.reference_image_url && (
                    <a href={order.reference_image_url} target="_blank" rel="noopener noreferrer"
                      className="text-brand-300 text-xs hover:underline">
                      Imagem →
                    </a>
                  )}

                  <div className="ml-auto">
                    <OrderStatusSelect
                      orderId={order.id}
                      orderType={order.type as OrderType}
                      currentStatus={order.status}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
