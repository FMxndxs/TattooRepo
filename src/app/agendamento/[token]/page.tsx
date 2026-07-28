'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, Clock, AlertCircle, CheckCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { cancelBookingAction, rescheduleBookingAction } from '@/app/actions/bookings'
import { STATUS_META } from '@/lib/booking/stateMachine'
import { formatBRL } from '@/lib/utils/formatters'
import type { BookingStatus } from '@/types/booking'

interface BookingDetails {
  id: string
  service_name: string
  starts_at: string
  ends_at: string
  status: BookingStatus
  deposit_amount: number
  customer_name: string
}

type Step = 'view' | 'rescheduling'

export default function AgendamentoPage() {
  const params = useParams()
  const token = params.token as string

  const [step, setStep] = useState<Step>('view')
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelWarning, setCancelWarning] = useState<string | null>(null)
  const [rescheduling, setRescheduling] = useState(false)
  const [rescheduleError, setRescheduleError] = useState<string | null>(null)
  const [newDateTime, setNewDateTime] = useState('')
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)

  // Load booking on mount
  useEffect(() => {
    async function loadBooking() {
      try {
        const supabase = createClient()
        const { data, error: rpcError } = await supabase.rpc('get_booking_by_token', {
          p_token: token,
        })

        if (rpcError) throw rpcError

        if (!data || data.length === 0) {
          setError('Agendamento não encontrado')
          setLoading(false)
          return
        }

        setBooking(data[0])
        // Set default new datetime to current booking start time
        setNewDateTime(data[0].starts_at)
      } catch (err) {
        console.error('Failed to load booking:', err)
        setError('Erro ao carregar agendamento')
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [token])

  const handleCancelClick = () => {
    setShowConfirmCancel(true)
  }

  const handleConfirmCancel = async () => {
    setCancelling(true)
    setCancelError(null)
    setCancelWarning(null)

    try {
      const result = await cancelBookingAction(token)

      if (!result.success) {
        setCancelError(result.error || 'Erro ao cancelar agendamento')
        return
      }

      // Show warning if present, but still consider it a success
      if (result.error) {
        setCancelWarning(result.error)
      }

      // Reload booking to reflect status change
      const supabase = createClient()
      const { data } = await supabase.rpc('get_booking_by_token', {
        p_token: token,
      })

      if (data && data.length > 0) {
        setBooking(data[0])
      }

      setShowConfirmCancel(false)
    } catch (err) {
      setCancelError('Erro ao processar cancelamento')
      console.error('Cancel error:', err)
    } finally {
      setCancelling(false)
    }
  }

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDateTime) return

    setRescheduling(true)
    setRescheduleError(null)

    try {
      const result = await rescheduleBookingAction(token, newDateTime, 0)

      if (!result.success) {
        setRescheduleError(result.error || 'Erro ao remarcar agendamento')
        return
      }

      // Reload booking
      const supabase = createClient()
      const { data } = await supabase.rpc('get_booking_by_token', {
        p_token: token,
      })

      if (data && data.length > 0) {
        setBooking(data[0])
      }

      setStep('view')
    } catch (err) {
      setRescheduleError('Erro ao processar remarcação')
      console.error('Reschedule error:', err)
    } finally {
      setRescheduling(false)
    }
  }

  const canCancel =
    booking && (booking.status === 'pending_payment' || booking.status === 'confirmed')
  const canReschedule = booking && booking.status === 'confirmed'

  const statusMeta = booking ? STATUS_META[booking.status] : null

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-zinc-400">Carregando agendamento...</p>
      </div>
    )
  }

  // Not found
  if (error && !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
          <p className="text-zinc-400">Verifique o link do seu agendamento</p>
        </div>
      </div>
    )
  }

  if (!booking) return null

  // View step
  if (step === 'view') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Seu agendamento</h1>
          <p className="text-zinc-400">Gerencie sua reserva de tatuagem</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-6">
          {/* Booking Details */}
          <div>
            <h2 className="text-white font-semibold mb-4">Informações</h2>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-zinc-400 text-sm">Serviço</span>
                <span className="text-white font-medium">{booking.service_name}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-zinc-400 text-sm">Data e Hora</span>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {new Date(booking.starts_at).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-brand-300 text-sm">
                    {booking.starts_at.split('T')[1].slice(0, 5)}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-zinc-400 text-sm">Cliente</span>
                <span className="text-white font-medium">{booking.customer_name}</span>
              </div>

              {booking.deposit_amount > 0 && (
                <div className="flex items-start justify-between">
                  <span className="text-zinc-400 text-sm">Sinal</span>
                  <span className="text-yellow-400 font-medium">
                    {formatBRL(booking.deposit_amount)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <span className="text-zinc-400 text-sm">Status</span>
                {statusMeta && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.color}`}>
                    {statusMeta.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Warnings */}
          {cancelWarning && (
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-sm">{cancelWarning}</p>
            </div>
          )}

          {cancelError && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{cancelError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-6 border-t border-zinc-800">
            {canReschedule && (
              <button
                onClick={() => setStep('rescheduling')}
                className="w-full py-3 px-4 bg-brand-700 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
              >
                Remarcar
              </button>
            )}

            {canCancel && (
              <>
                {!showConfirmCancel ? (
                  <button
                    onClick={handleCancelClick}
                    className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-red-400 font-semibold rounded-xl transition-colors border border-zinc-700"
                  >
                    Cancelar agendamento
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-sm">Tem certeza que deseja cancelar?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirmCancel(false)}
                        className="flex-1 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Não, manter
                      </button>
                      <button
                        onClick={handleConfirmCancel}
                        disabled={cancelling}
                        className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                      >
                        {cancelling ? 'Cancelando...' : 'Sim, cancelar'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!canCancel && booking.status !== 'done' && (
              <p className="text-zinc-500 text-sm text-center">
                Este agendamento não pode ser modificado
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Reschedule step
  if (step === 'rescheduling') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button
            onClick={() => {
              setStep('view')
              setRescheduleError(null)
            }}
            className="mb-4 text-brand-300 hover:text-brand-200 font-medium text-sm transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Remarcar agendamento</h1>
          <p className="text-zinc-400">Escolha uma nova data e hora</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          {rescheduleError && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{rescheduleError}</p>
            </div>
          )}

          <form onSubmit={handleReschedule} className="space-y-5">
            <div>
              <label htmlFor="newDateTime" className="block text-white text-sm font-medium mb-1.5">
                Nova data e hora
              </label>
              <input
                id="newDateTime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Selecione uma data e hora disponíveis
              </p>
            </div>

            <button
              type="submit"
              disabled={rescheduling || !newDateTime}
              className="w-full bg-brand-700 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors"
            >
              {rescheduling ? 'Processando...' : 'Confirmar nova data'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return null
}
