'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { createBookingAction } from '@/app/actions/bookings'
import { bookingSchema, type BookingFormData } from '@/lib/validations/booking'
import { formatBRL } from '@/lib/utils/formatters'
import type { Service, Slot } from '@/types/booking'

type Step = 'service' | 'slots' | 'form' | 'success'

export default function AgendarPage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('service')
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{
    qrCode: string | null
    qrCodeBase64: string | null
    copyText: string | null
    manageToken: string
  } | null>(null)
  const [loadingServices, setLoadingServices] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  // Load services on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')

        if (error) throw error
        setServices(data || [])

        // Check for service preselection via query param
        const serviceSlug = searchParams.get('service')
        if (serviceSlug && data) {
          const found = data.find((s) => s.slug === serviceSlug)
          if (found) {
            setSelectedService(found)
            setStep('slots')
          }
        }
      } catch (err) {
        console.error('Failed to load services:', err)
      } finally {
        setLoadingServices(false)
      }
    }

    loadServices()
  }, [searchParams])

  // Fetch available slots when service is selected
  useEffect(() => {
    if (!selectedService || step !== 'slots') return

    async function fetchSlots() {
      setSlotsLoading(true)
      setSlotsError(null)
      try {
        const supabase = createClient()
        const today = new Date()
        const inThirtyDays = new Date(today)
        inThirtyDays.setDate(inThirtyDays.getDate() + 30)

        const { data, error } = await supabase.rpc('get_available_slots', {
          p_service_id: selectedService!.id,
          p_from: today.toISOString().split('T')[0],
          p_to: inThirtyDays.toISOString().split('T')[0],
        })

        if (error) throw error
        setSlots(data || [])
      } catch (err) {
        setSlotsError('Não foi possível carregar os horários. Tente novamente.')
        console.error('Failed to fetch slots:', err)
      } finally {
        setSlotsLoading(false)
      }
    }

    fetchSlots()
  }, [selectedService, step])

  // Group slots by date
  const groupedSlots: Record<string, Slot[]> = {}
  slots.forEach((slot) => {
    const date = slot.slot_start.split('T')[0]
    if (!groupedSlots[date]) groupedSlots[date] = []
    groupedSlots[date].push(slot)
  })

  const sortedDates = Object.keys(groupedSlots).sort()

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setSelectedSlot(null)
    setSlots([])
    setStep('slots')
  }

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot)
    reset({
      service_id: selectedService!.id,
      starts_at: slot.slot_start,
    })
    setStep('form')
  }

  const handleBackFromSlots = () => {
    setSelectedService(null)
    setSelectedSlot(null)
    setSlots([])
    setStep('service')
  }

  const handleBackFromForm = () => {
    setSelectedSlot(null)
    setStep('slots')
  }

  const onFormSubmit = async (data: BookingFormData) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await createBookingAction(data)

      if (!result.success) {
        setSubmitError(result.error || 'Erro ao criar agendamento')
        return
      }

      // Success
      const { qr_code, qr_code_base64 } = result.data!.pix
      setSuccessData({
        qrCode: qr_code,
        qrCodeBase64: qr_code_base64,
        copyText: qr_code,
        manageToken: result.data!.booking.manage_token,
      })
      setStep('success')
    } catch (err) {
      setSubmitError('Erro ao processar seu agendamento. Tente novamente.')
      console.error('Form submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Step 1: Service Selection
  // ─────────────────────────────────────────────────────────────────

  if (step === 'service') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">Agendar tatuagem</h1>
          <p className="text-zinc-400">
            Escolha o serviço desejado e reserve seu horário
          </p>
        </div>

        {loadingServices ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">Carregando serviços...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">Nenhum serviço disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service)}
                className="text-left bg-zinc-900 border border-zinc-800 hover:border-brand-500 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-brand-500/20"
              >
                <h2 className="text-xl font-bold text-white mb-1">{service.name}</h2>
                <p className="text-zinc-400 text-sm mb-4">{service.description}</p>

                <div className="flex items-center gap-2 text-zinc-300 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  {service.duration_min} minutos
                </div>

                <div className="space-y-1">
                  {service.price_from !== null && (
                    <p className="text-brand-300 font-semibold">
                      A partir de {formatBRL(service.price_from)}
                    </p>
                  )}
                  {service.deposit_amount > 0 && (
                    <p className="text-yellow-400 text-sm">
                      Sinal de {formatBRL(service.deposit_amount)} para confirmar
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // Step 2: Slot Selection
  // ─────────────────────────────────────────────────────────────────

  if (step === 'slots') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button
            onClick={handleBackFromSlots}
            className="mb-4 text-brand-300 hover:text-brand-200 font-medium text-sm transition-colors"
          >
            ← Voltar para serviços
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedService?.name}
          </h1>
          <p className="text-zinc-400">Escolha um horário disponível</p>
        </div>

        {slotsLoading && (
          <div className="text-center py-12">
            <p className="text-zinc-400">Carregando horários disponíveis...</p>
          </div>
        )}

        {slotsError && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{slotsError}</p>
          </div>
        )}

        {!slotsLoading && slots.length === 0 && !slotsError && (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">Nenhum horário disponível para os próximos 30 dias</p>
            <button
              onClick={handleBackFromSlots}
              className="text-brand-300 hover:text-brand-200 font-medium transition-colors"
            >
              Escolher outro serviço
            </button>
          </div>
        )}

        {sortedDates.map((date) => {
          const dateObj = new Date(date)
          const dayLabel = dateObj.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
          })

          return (
            <div key={date} className="mb-8">
              <h2 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                {dayLabel}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {groupedSlots[date].map((slot, idx) => {
                  const time = slot.slot_start.split('T')[1].slice(0, 5)
                  const isSelected = selectedSlot?.slot_start === slot.slot_start
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSlot(slot)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        isSelected
                          ? 'bg-brand-700 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 hover:border-brand-500'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // Step 3: Booking Form
  // ─────────────────────────────────────────────────────────────────

  if (step === 'form') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <button
            onClick={handleBackFromForm}
            className="mb-4 text-brand-300 hover:text-brand-200 font-medium text-sm transition-colors"
          >
            ← Voltar para horários
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Confirmar dados</h1>
          <p className="text-zinc-400">
            {selectedService?.name} • {selectedSlot && new Date(selectedSlot.slot_start).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
            })}{' '}
            às {selectedSlot && selectedSlot.slot_start.split('T')[1].slice(0, 5)}
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8">
          {submitError && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
            {/* Nome completo */}
            <div>
              <label htmlFor="customer_name" className="block text-white text-sm font-medium mb-1.5">
                Nome completo
              </label>
              <input
                id="customer_name"
                placeholder="Seu nome completo"
                {...register('customer_name')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.customer_name && (
                <p role="alert" className="text-red-400 text-xs mt-1">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            {/* Telefone/WhatsApp */}
            <div>
              <label htmlFor="customer_phone" className="block text-white text-sm font-medium mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                id="customer_phone"
                placeholder="(11) 99999-9999"
                {...register('customer_phone')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.customer_phone && (
                <p role="alert" className="text-red-400 text-xs mt-1">
                  {errors.customer_phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="customer_email" className="block text-white text-sm font-medium mb-1.5">
                E-mail
              </label>
              <input
                id="customer_email"
                type="email"
                placeholder="seu@email.com"
                {...register('customer_email')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.customer_email && (
                <p role="alert" className="text-red-400 text-xs mt-1">
                  {errors.customer_email.message}
                </p>
              )}
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="notes" className="block text-white text-sm font-medium mb-1.5">
                Observações <span className="text-zinc-500 font-normal">(opcional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Alguma informação importante que devemos saber?"
                {...register('notes')}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
              />
              {errors.notes && (
                <p role="alert" className="text-red-400 text-xs mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-700 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors"
            >
              {submitting ? 'Processando...' : 'Confirmar agendamento'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // Step 4: Success
  // ─────────────────────────────────────────────────────────────────

  if (step === 'success' && successData) {
    const hasDeposit = successData.qrCodeBase64 !== null

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
          {hasDeposit ? (
            <>
              <Check className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">Agendamento criado!</h1>
              <p className="text-zinc-400 mb-8">
                Seu horário foi reservado. Complete o pagamento do sinal para confirmar sua data.
              </p>

              {successData.qrCodeBase64 && (
                <div className="mb-8 p-6 bg-zinc-800/50 rounded-xl">
                  <p className="text-sm text-zinc-400 mb-4">Código Pix</p>
                  <img
                    src={`data:image/png;base64,${successData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 mx-auto mb-4"
                  />

                  {successData.copyText && (
                    <div className="space-y-3">
                      <div className="text-xs text-zinc-500 mb-2">Ou copie o código abaixo:</div>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={successData.copyText}
                          className="w-full bg-zinc-700/50 border border-zinc-600 text-zinc-200 text-xs px-3 py-2 rounded-lg font-mono text-center"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(successData.copyText!)
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-300 hover:text-brand-200 text-xs font-medium transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-300 mb-6">
                ⏱️ Este código expira em 20 minutos. Escaneie ou copie o código Pix para pagar o sinal e confirmar seu horário.
              </div>
            </>
          ) : (
            <>
              <Check className="w-16 h-16 text-brand-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-2">Reserva confirmada!</h1>
              <p className="text-zinc-400">
                Seu agendamento foi confirmado. Você receberá um e-mail de confirmação em breve.
              </p>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2">
              Guarde o link abaixo para cancelar ou remarcar seu horário quando quiser:
            </p>
            <a
              href={`/agendamento/${successData.manageToken}`}
              className="text-brand-300 hover:text-brand-200 text-sm font-medium underline break-all"
            >
              {`${typeof window !== 'undefined' ? window.location.origin : ''}/agendamento/${successData.manageToken}`}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return null
}
