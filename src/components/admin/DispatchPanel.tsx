'use client'

/**
 * DispatchPanel — Painel de expedição para pedidos no estado `ready`.
 *
 * Três grupos por fulfillment_type:
 *  - delivery   → captura courier_name → out_for_delivery
 *  - shipping   → captura tracking_code → shipped
 *  - pickup     → marcar entregue diretamente → delivered
 */

import { useState, useTransition } from 'react'
import { Truck, Package, Store, MapPin, CheckCircle } from 'lucide-react'
import {
  dispatchLocalAction,
  markShippedAction,
  markPickedUpAction,
} from '@/app/actions/orders'
import { formatBRL } from '@/lib/utils/formatters'

interface DispatchOrder {
  id: string
  order_code: string | null
  customer_name: string
  customer_phone: string
  fulfillment_type: string | null
  courier_name: string | null
  tracking_code: string | null
  total: number
  freight: number | null
  street: string | null
  street_number: string | null
  neighborhood: string | null
  city: string | null
  cep: string | null
  created_at: string
}

interface DispatchPanelProps {
  initialOrders: DispatchOrder[]
}

export function DispatchPanel({ initialOrders }: DispatchPanelProps) {
  const [orders, setOrders] = useState<DispatchOrder[]>(initialOrders)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const deliveryOrders = orders.filter((o) => o.fulfillment_type === 'delivery')
  const shippingOrders = orders.filter((o) => o.fulfillment_type === 'shipping')
  const pickupOrders   = orders.filter((o) => o.fulfillment_type === 'pickup' || !o.fulfillment_type)

  function removeOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  function handleInput(id: string, value: string) {
    setInputs((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[id]; return e })
  }

  function dispatch(orderId: string, action: () => Promise<{ success: boolean; error?: string }>) {
    setProcessingId(orderId)
    startTransition(async () => {
      const result = await action()
      setProcessingId(null)
      if (result.success) {
        removeOrder(orderId)
      } else {
        setErrors((prev) => ({ ...prev, [orderId]: result.error ?? 'Erro ao processar' }))
      }
    })
  }

  function renderOrderCard(order: DispatchOrder, slot: React.ReactNode) {
    const address = [
      order.street && order.street_number ? `${order.street}, ${order.street_number}` : order.street,
      order.neighborhood, order.city,
      order.cep ? `CEP ${order.cep}` : null,
    ].filter(Boolean).join(' — ')

    return (
      <div key={order.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            {order.order_code && (
              <span className="text-xs font-mono font-bold text-brand-300">#{order.order_code}</span>
            )}
            <p className="text-white font-semibold">{order.customer_name}</p>
            <p className="text-zinc-500 text-xs">{order.customer_phone}</p>
          </div>
          <p className="text-brand-300 font-bold text-sm shrink-0">{formatBRL(order.total)}</p>
        </div>

        {address && (
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-500" />
            <span>{address}</span>
          </div>
        )}

        {errors[order.id] && (
          <p className="text-red-400 text-xs">{errors[order.id]}</p>
        )}

        {slot}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* ── Entrega local ───────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-amber-400">
            Entrega local ({deliveryOrders.length})
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {deliveryOrders.map((order) =>
            renderOrderCard(
              order,
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Nome do entregador"
                  value={inputs[order.id] ?? order.courier_name ?? ''}
                  onChange={(e) => handleInput(order.id, e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  disabled={processingId === order.id || isPending || !inputs[order.id]?.trim()}
                  onClick={() => dispatch(order.id, () => dispatchLocalAction(order.id, inputs[order.id] ?? ''))}
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Truck className="w-3.5 h-3.5" />
                  {processingId === order.id ? 'Enviando...' : 'Despachar'}
                </button>
              </div>,
            ),
          )}
          {deliveryOrders.length === 0 && (
            <div className="text-center text-zinc-700 text-xs border border-dashed border-zinc-800 rounded-2xl py-6">
              Nenhum pedido para entrega local
            </div>
          )}
        </div>
      </section>

      {/* ── Envio correios ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-purple-400">
            Correios / transportadora ({shippingOrders.length})
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {shippingOrders.map((order) =>
            renderOrderCard(
              order,
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Código de rastreamento (opcional)"
                  value={inputs[order.id] ?? order.tracking_code ?? ''}
                  onChange={(e) => handleInput(order.id, e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  disabled={processingId === order.id || isPending}
                  onClick={() => dispatch(order.id, () => markShippedAction(order.id, inputs[order.id] || undefined))}
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Package className="w-3.5 h-3.5" />
                  {processingId === order.id ? 'Registrando...' : 'Marcar enviado'}
                </button>
              </div>,
            ),
          )}
          {shippingOrders.length === 0 && (
            <div className="text-center text-zinc-700 text-xs border border-dashed border-zinc-800 rounded-2xl py-6">
              Nenhum pedido para envio
            </div>
          )}
        </div>
      </section>

      {/* ── Retirada ────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-semibold text-teal-400">
            Retirada ({pickupOrders.length})
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {pickupOrders.map((order) =>
            renderOrderCard(
              order,
              <button
                type="button"
                disabled={processingId === order.id || isPending}
                onClick={() => dispatch(order.id, () => markPickedUpAction(order.id))}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {processingId === order.id ? 'Registrando...' : 'Marcar retirado'}
              </button>,
            ),
          )}
          {pickupOrders.length === 0 && (
            <div className="text-center text-zinc-700 text-xs border border-dashed border-zinc-800 rounded-2xl py-6">
              Nenhum pedido para retirada
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
