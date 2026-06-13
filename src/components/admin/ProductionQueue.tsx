'use client'

/**
 * ProductionQueue — Fila de produção 3D com Supabase Realtime.
 *
 * Mostra pedidos nos estados: confirmed | in_production | finishing
 * (mais custom_orders em accepted | in_production | finishing).
 *
 * Organizado em lanes por status. Novos pedidos confirmados aparecem
 * instantaneamente via subscription realtime sem precisar de refresh.
 */

import { useEffect, useState, useTransition } from 'react'
import { useReducedMotion } from 'motion/react'
import { Printer, Wrench, CheckCircle2, Clock, Layers, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { advanceOrderStatusAction } from '@/app/actions/orders'
import { STATUS_META } from '@/lib/orders/stateMachine'
import { formatBRL } from '@/lib/utils/formatters'
import type { FulfillmentType } from '@/types'
import type { OrderType } from '@/lib/admin/orders'

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface ProductionCard {
  id: string
  type: OrderType
  order_code: string | null
  customer_name: string
  status: string
  fulfillment_type: FulfillmentType | null
  summary: string
  total: number | null
  created_at: string
}

// ─── Constantes de lane ────────────────────────────────────────────────────────

const PRODUCTION_STATUSES = ['confirmed', 'in_production', 'finishing'] as const
type ProductionStatus = (typeof PRODUCTION_STATUSES)[number]

const LANE_CONFIG: Record<ProductionStatus, { label: string; icon: React.ReactNode; action: string; next: string }> = {
  confirmed:     { label: 'Confirmados',  icon: <CheckCircle2 className="w-4 h-4" />, action: 'Iniciar impressão', next: 'in_production' },
  in_production: { label: 'Imprimindo',   icon: <Printer className="w-4 h-4" />,     action: 'Acabamento',       next: 'finishing' },
  finishing:     { label: 'Acabamento',   icon: <Wrench className="w-4 h-4" />,       action: 'Marcar pronto',    next: 'ready' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elapsedLabel(created_at: string): string {
  const diff = Date.now() - new Date(created_at).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface ProductionQueueProps {
  initialCards: ProductionCard[]
}

export function ProductionQueue({ initialCards }: ProductionQueueProps) {
  const [cards, setCards] = useState<ProductionCard[]>(initialCards)
  const [advancingId, setAdvancingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const reduced = useReducedMotion()

  // ── Supabase Realtime subscription ────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('production_queue')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          // Filtra apenas os status relevantes no servidor (melhor performance)
          filter: `status=in.(confirmed,in_production,finishing)`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as Record<string, unknown>
            setCards((prev) => [
              ...prev,
              {
                id: row.id as string,
                type: 'normal',
                order_code: row.order_code as string | null,
                customer_name: (row.customer_name as string) || '—',
                status: row.status as string,
                fulfillment_type: row.fulfillment_type as FulfillmentType | null,
                summary: '',  // Não disponível via evento; será preenchido na recarga
                total: row.total as number | null,
                created_at: row.created_at as string,
              },
            ])
          }

          if (payload.eventType === 'UPDATE') {
            const row = payload.new as Record<string, unknown>
            const newStatus = row.status as string
            if (PRODUCTION_STATUSES.includes(newStatus as ProductionStatus)) {
              // Status ainda está na fila — atualizar
              setCards((prev) =>
                prev.map((c) =>
                  c.id === (row.id as string) ? { ...c, status: newStatus } : c,
                ),
              )
            } else {
              // Saiu da fila (pronto, cancelado, etc.) — remover
              setCards((prev) => prev.filter((c) => c.id !== (row.id as string)))
            }
          }

          if (payload.eventType === 'DELETE') {
            const row = payload.old as Record<string, unknown>
            setCards((prev) => prev.filter((c) => c.id !== (row.id as string)))
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_orders',
          filter: `status=in.(accepted,in_production,finishing)`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as Record<string, unknown>
            const status = row.status as string
            const relevantStatus = status === 'accepted' ? 'confirmed' : status
            if (!PRODUCTION_STATUSES.includes(relevantStatus as ProductionStatus) && status !== 'accepted') {
              setCards((prev) => prev.filter((c) => c.id !== (row.id as string)))
              return
            }
            setCards((prev) => {
              const exists = prev.find((c) => c.id === (row.id as string))
              if (exists) return prev.map((c) => c.id === (row.id as string) ? { ...c, status } : c)
              return [
                ...prev,
                {
                  id: row.id as string,
                  type: 'custom',
                  order_code: row.order_code as string | null,
                  customer_name: (row.customer_name as string) || '—',
                  status,
                  fulfillment_type: null,
                  summary: (row.description as string) ?? '',
                  total: null,
                  created_at: row.created_at as string,
                },
              ]
            })
          }
          if (payload.eventType === 'DELETE') {
            const row = payload.old as Record<string, unknown>
            setCards((prev) => prev.filter((c) => c.id !== (row.id as string)))
          }
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Ação de avanço de status ───────────────────────────────────────────────
  function handleAdvance(card: ProductionCard, laneConfig: typeof LANE_CONFIG[ProductionStatus]) {
    setAdvancingId(card.id)
    setErrors((prev) => { const e = { ...prev }; delete e[card.id]; return e })

    startTransition(async () => {
      const result = await advanceOrderStatusAction(card.id, laneConfig.next, card.type)
      setAdvancingId(null)

      if (!result.success) {
        setErrors((prev) => ({ ...prev, [card.id]: result.error ?? 'Erro ao avançar' }))
      }
      // Sucesso: o realtime ou revalidatePath vai atualizar os cards
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const isEmpty = cards.length === 0

  return (
    <div>
      {isEmpty && (
        <div className="py-20 text-center text-zinc-500">
          <Layers className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-lg">Fila vazia — nenhum pedido em produção.</p>
          <p className="text-sm mt-1 text-zinc-600">Novos pedidos confirmados aparecem aqui automaticamente.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTION_STATUSES.map((laneStatus) => {
          const lane = LANE_CONFIG[laneStatus]
          // Para custom_orders, "accepted" aparece na lane "confirmed"
          const laneCards = cards.filter((c) => {
            if (laneStatus === 'confirmed') return c.status === 'confirmed' || (c.type === 'custom' && c.status === 'accepted')
            return c.status === laneStatus
          })

          return (
            <div key={laneStatus} className="flex flex-col gap-3">
              {/* Lane header */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${STATUS_META[laneStatus]?.color ?? ''} border-current/20`}>
                {lane.icon}
                <span className="text-sm font-semibold">{lane.label}</span>
                <span className="ml-auto text-xs opacity-70">{laneCards.length}</span>
              </div>

              {/* Cards */}
              {laneCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col gap-3"
                  style={reduced ? undefined : { transition: 'opacity 0.2s' }}
                >
                  {/* Header do card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      {card.order_code && (
                        <span className="text-xs font-mono font-bold text-brand-300">
                          #{card.order_code}
                        </span>
                      )}
                      <p className="text-white font-semibold text-sm truncate">
                        {card.customer_name}
                      </p>
                      {card.type === 'custom' && (
                        <span className="text-xs text-brand-300 bg-brand-700/10 px-1.5 py-0.5 rounded self-start">
                          Custom
                        </span>
                      )}
                    </div>
                    {/* Badge de tempo decorrido */}
                    <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                      <Clock className="w-3 h-3" />
                      {elapsedLabel(card.created_at)}
                    </div>
                  </div>

                  {/* Resumo */}
                  {card.summary && (
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                      {card.summary}
                    </p>
                  )}

                  {/* Total */}
                  {card.total != null && (
                    <p className="text-brand-300 font-bold text-sm">
                      {formatBRL(card.total)}
                    </p>
                  )}

                  {/* Erro */}
                  {errors[card.id] && (
                    <p className="text-red-400 text-xs">{errors[card.id]}</p>
                  )}

                  {/* Botão de ação */}
                  <button
                    type="button"
                    disabled={advancingId === card.id || isPending}
                    onClick={() => handleAdvance(card, lane)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-brand-700/15 text-brand-300 hover:bg-brand-700/30 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {advancingId === card.id ? 'Salvando...' : lane.action}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {laneCards.length === 0 && (
                <div className="py-6 text-center text-zinc-700 text-xs border border-dashed border-zinc-800 rounded-2xl">
                  Vazio
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
