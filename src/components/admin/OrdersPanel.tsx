'use client'

import { useState, useMemo } from 'react'
import {
  Package, MessageSquare, Search, Trash2, X, Check,
  ChevronDown, ChevronUp, MapPin, Truck, ChevronLeft, ChevronRight,
  ArrowUpDown, Printer,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { OrderStatusSelect } from './OrderStatusSelect'
import {
  STATUS_DISPLAY,
  ADMIN_STATUS_OPTIONS,
  type AdminOrderRow,
  type AdminStatus,
  type OrderType,
} from '@/lib/admin/orders'
import { formatBRL } from '@/lib/utils/formatters'
import { buildOrderConfirmationUrl } from '@/lib/utils/whatsapp'
import type { FulfillmentType } from '@/types'

type TabValue = 'all' | 'normal' | 'custom'
type SortDir = 'desc' | 'asc'

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'normal', label: 'Normais' },
  { value: 'custom', label: 'Customizados' },
]

const PAGE_SIZE = 20

interface OrdersPanelProps {
  orders: AdminOrderRow[]
}

export function OrdersPanel({ orders: initialOrders }: OrdersPanelProps) {
  const [tab, setTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminStatus | 'all'>('all')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [orders, setOrders] = useState<AdminOrderRow[]>(initialOrders)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  async function handleDelete(order: AdminOrderRow) {
    setDeletingId(order.id)
    setDeleteError(null)

    const supabase = createClient()
    const table = order.type === 'custom' ? 'custom_orders' : 'orders'
    const { error } = await supabase.from(table).delete().eq('id', order.id)

    setDeletingId(null)
    setConfirmingId(null)

    if (error) {
      setDeleteError(order.id)
      return
    }

    setOrders((prev) => prev.filter((o) => o.id !== order.id))
  }

  function resetPage() { setPage(1) }

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      if (tab === 'normal' && o.type !== 'normal') return false
      if (tab === 'custom' && o.type !== 'custom') return false
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.toLowerCase().includes(q)
        )
      }
      return true
    })

    result = result.slice().sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === 'desc' ? -diff : diff
    })

    return result
  }, [orders, tab, search, statusFilter, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isDeleting = (id: string) => deletingId === id
  const isConfirming = (id: string) => confirmingId === id

  return (
    <div>
      {/* Tabs + search + filtros */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Abas */}
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setTab(value); resetPage() }}
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

          {/* Busca */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Buscar por nome ou telefone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage() }}
              className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <span className="text-zinc-500 text-sm shrink-0">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filtros secundários */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro por status */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as AdminStatus | 'all'); resetPage() }}
            className="bg-zinc-900 border border-zinc-800 text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="all">Todos os status</option>
            {ADMIN_STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Toggle ordenação por data */}
          <button
            onClick={() => { setSortDir((d) => d === 'desc' ? 'asc' : 'desc'); resetPage() }}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 hover:text-white rounded-xl px-3 py-2 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortDir === 'desc' ? 'Mais recentes' : 'Mais antigos'}
          </button>
        </div>
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
        {paginated.map((order) => {
          const expanded = expandedId === order.id
          const statusMeta = STATUS_DISPLAY[order.status] ?? STATUS_DISPLAY['pending']
          const date = new Date(order.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
          })
          const phone = order.customer_phone.replace(/\D/g, '')
          const waText = encodeURIComponent(`Olá ${order.customer_name}! Sobre seu pedido...`)

          return (
            <div key={order.id} className="bg-zinc-900 rounded-2xl border border-zinc-800">
              {/* Header do card */}
              <div className="p-5">
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
                    {order.order_code && (
                      <span className="text-xs font-mono font-bold text-brand-300 bg-brand-700/15 px-2 py-0.5 rounded">
                        #{order.order_code}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusMeta.color}`}>
                      {statusMeta.label}
                    </span>
                    {order.total !== undefined && (
                      <span className="text-zinc-400 text-xs">
                        {formatBRL(order.total)}
                      </span>
                    )}
                    {/* Badge de frete */}
                    {order.type === 'normal' && order.freight != null && (
                      <span className="flex items-center gap-1 text-xs text-green-400/80">
                        <Truck className="w-3 h-3" />
                        frete {formatBRL(order.freight)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs shrink-0">{date}</span>
                    {/* Botão expandir — só pedidos normais têm detalhe */}
                    {order.type === 'normal' && (
                      <button
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                        aria-label={expanded ? 'Recolher detalhes' : 'Ver detalhes'}
                      >
                        {expanded
                          ? <ChevronUp className="w-4 h-4" />
                          : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Nome do cliente */}
                <p className="text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
                  {order.customer_name}
                </p>

                <p className="text-zinc-300 text-sm leading-relaxed mb-3 line-clamp-2">
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

                  <div className="ml-auto flex items-center gap-2">
                    {/* Botão de confirmação WhatsApp (apenas pedidos no estado pending) */}
                    {order.order_code && order.status === 'pending' && (
                      <a
                        href={buildOrderConfirmationUrl({
                          customerPhone: order.customer_phone,
                          orderCode: order.order_code,
                          customerName: order.customer_name !== '—' ? order.customer_name : undefined,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Confirmar pedido via WhatsApp"
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-600/15 text-green-400 hover:bg-green-600/25 text-xs font-medium transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Confirmar WA
                      </a>
                    )}
                    <OrderStatusSelect
                      orderId={order.id}
                      orderType={order.type as OrderType}
                      currentStatus={order.status}
                      fulfillmentType={order.fulfillment_type as FulfillmentType | null}
                    />

                    {isConfirming(order.id) ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(order)}
                          disabled={isDeleting(order.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                          aria-label="Confirmar exclusão"
                        >
                          <Check className="w-3 h-3" />
                          {isDeleting(order.id) ? '...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => { setConfirmingId(null); setDeleteError(null) }}
                          disabled={isDeleting(order.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                          aria-label="Cancelar exclusão"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setConfirmingId(order.id); setDeleteError(null) }}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        aria-label="Excluir pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {deleteError === order.id && (
                    <span className="text-red-400 text-xs w-full text-right">Erro ao excluir</span>
                  )}
                </div>
              </div>

              {/* Painel de detalhes expansível (apenas pedidos normais) */}
              {expanded && order.type === 'normal' && (
                <div className="border-t border-zinc-800 px-5 py-4 space-y-4">

                  {/* Itens do pedido */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Itens
                      </p>
                      <ul className="space-y-1.5">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-300 font-medium">
                              {item.quantity}×
                            </span>
                            <span className="text-zinc-200">{item.product?.name ?? 'Produto'}</span>
                            {item.color && (
                              <span className="flex items-center gap-1 text-zinc-400 text-xs">
                                <span
                                  className="w-3 h-3 rounded-full border border-zinc-600 inline-block shrink-0"
                                  style={{ backgroundColor: (item.color as { hex_code: string }).hex_code }}
                                />
                                {(item.color as { name: string }).name}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-zinc-500 text-xs">
                                {(item.size as { label: string }).label}
                              </span>
                            )}
                            <span className="ml-auto text-zinc-400 text-xs">
                              {formatBRL(item.unit_price * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Endereço */}
                  {(order.street || order.cep) && (
                    <div>
                      <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Endereço de entrega
                      </p>
                      <div className="flex items-start gap-2 text-sm text-zinc-300">
                        <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                        <span>
                          {[
                            order.street && order.street_number
                              ? `${order.street}, ${order.street_number}`
                              : order.street,
                            order.neighborhood,
                            order.city,
                            order.cep ? `CEP ${order.cep}` : null,
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Frete */}
                  <div>
                    <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      Frete
                    </p>
                    <p className="text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-zinc-500 shrink-0" />
                      {order.freight != null
                        ? <span className="text-green-400 font-medium">{formatBRL(order.freight)} — entrega própria</span>
                        : <span className="text-amber-400">A combinar — retirada ou courier</span>}
                    </p>
                  </div>

                  {/* Observações */}
                  {order.notes && (
                    <div>
                      <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        Observações
                      </p>
                      <p className="text-zinc-300 text-sm leading-relaxed">{order.notes}</p>
                    </div>
                  )}

                  {/* Botões de ticket imprimível */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <a
                      href={`/admin/pedidos/${order.id}/nota-producao`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Nota de produção
                    </a>
                    {(order.fulfillment_type === 'delivery' || order.fulfillment_type === 'shipping') && (
                      <a
                        href={`/admin/pedidos/${order.id}/etiqueta-envio`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Etiqueta de envio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-zinc-400">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:text-white disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:text-white disabled:opacity-40 transition-colors"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
