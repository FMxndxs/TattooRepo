'use client'

import { useState, useMemo } from 'react'
import { Check, X, Search } from 'lucide-react'
import { STATUS_META, canTransition } from '@/lib/booking/stateMachine'
import { advanceBookingStatusAction } from '@/app/actions/services'
import { formatBRL, formatPhone } from '@/lib/utils/formatters'
import type { Booking, Service, BookingStatus } from '@/types/booking'

interface BookingWithService extends Booking {
  service: Service
}

interface BookingsTableProps {
  bookings: BookingWithService[]
}

type FilterTab = 'todos' | 'proximos'

export function BookingsTable({ bookings: initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings)
  const [tab, setTab] = useState<FilterTab>('proximos')
  const [search, setSearch] = useState('')
  const [advancingId, setAdvancingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const now = new Date()

  const filtered = useMemo(() => {
    let result = bookings

    if (tab === 'proximos') {
      result = result.filter((b) => new Date(b.starts_at) >= now)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((b) =>
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.toLowerCase().includes(q) ||
        b.service?.name.toLowerCase().includes(q)
      )
    }

    return result
  }, [bookings, tab, search])

  async function handleAdvanceStatus(booking: BookingWithService, nextStatus: BookingStatus) {
    setError(null)
    setAdvancingId(booking.id)

    const result = await advanceBookingStatusAction(booking.id, nextStatus)
    setAdvancingId(null)

    if (!result.success) {
      setError(result.error || 'Erro ao atualizar status')
      return
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: nextStatus } : b))
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500">
        <p>Nenhum agendamento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setTab('proximos')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'proximos'
                ? 'bg-brand-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => setTab('todos')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'todos'
                ? 'bg-brand-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todos
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="search"
            placeholder="Buscar por nome ou serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <span className="text-zinc-500 text-sm shrink-0">
          {filtered.length} agendamento{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((booking) => {
          const statusMeta = STATUS_META[booking.status]
          const date = new Date(booking.starts_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          const nextStatuses: BookingStatus[] = ['done', 'no_show'].filter((s) =>
            canTransition(booking.status, s as BookingStatus)
          ) as BookingStatus[]

          return (
            <div
              key={booking.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusMeta.color}`}>
                      {statusMeta.label}
                    </span>
                    <span className="text-zinc-400 text-sm">{date}</span>
                  </div>

                  <h4 className="text-white font-bold mb-1">
                    {booking.customer_name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <span>
                      📱 {formatPhone(booking.customer_phone)}
                    </span>
                    <span>
                      🎨 {booking.service?.name}
                    </span>
                    {booking.deposit_amount > 0 && (
                      <span>
                        💰 Sinal: {formatBRL(booking.deposit_amount)}
                      </span>
                    )}
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Notas: {booking.notes}
                    </p>
                  )}
                </div>

                {nextStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {nextStatuses.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() => handleAdvanceStatus(booking, nextStatus)}
                        disabled={advancingId === booking.id}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          nextStatus === 'done'
                            ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                            : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                        }`}
                      >
                        {nextStatus === 'done' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Realizado
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Não Compareceu
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
