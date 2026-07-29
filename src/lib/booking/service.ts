import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '@/lib/calendar/google'
import { createPixPayment, getPayment } from '@/lib/payments/mercadopago'
import { canTransition, canReschedule, isRefundable, DEFAULT_CANCELLATION_POLICY } from '@/lib/booking/stateMachine'
import type { Booking, CancellationPolicy } from '@/types/booking'

export interface ServiceResult<T = undefined> {
  success: boolean
  error?: string
  data?: T
}

const HOLD_MINUTES = 20

/**
 * Cancela holds pending_payment expirados. A constraint de exclusão do banco
 * não pode checar `hold_expires_at > now()` (índice exige função IMMUTABLE),
 * então isso libera o slot antes de qualquer insert/update que dependa dele.
 */
async function expireStaleHolds(client: SupabaseClient): Promise<void> {
  await client
    .from('bookings')
    .update({ status: 'cancelled', cancel_reason: 'hold_expired' })
    .eq('status', 'pending_payment')
    .lt('hold_expires_at', new Date().toISOString())
}

/** Cria o evento no Google Calendar sem derrubar a confirmação se o Google falhar —
 *  o banco é a fonte da verdade (ver CLAUDE.md); o espelho pode ficar defasado. */
async function mirrorToCalendar(
  client: SupabaseClient,
  bookingId: string,
  params: { summary: string; description: string; startsAt: string; endsAt: string },
): Promise<void> {
  try {
    const eventId = await createCalendarEvent(params)
    await client.from('bookings').update({ gcal_event_id: eventId }).eq('id', bookingId)
  } catch (err) {
    console.error('[booking] falha ao espelhar no Google Calendar:', err)
  }
}

/**
 * Cria um agendamento pendente + gera o Pix do sinal.
 * A constraint `bookings_no_overlap` (banco) é a defesa final contra corrida
 * entre dois clientes escolhendo o mesmo slot ao mesmo tempo.
 */
export async function createBooking(
  client: SupabaseClient,
  params: {
    service_id: string
    starts_at: string
    customer_name: string
    customer_phone: string
    customer_email: string
    notes?: string
  },
): Promise<ServiceResult<{ booking: Booking; pix: { qr_code: string | null; qr_code_base64: string | null } }>> {
  const { data: service, error: serviceErr } = await client
    .from('services')
    .select('*')
    .eq('id', params.service_id)
    .eq('is_active', true)
    .maybeSingle()
  if (serviceErr || !service) return { success: false, error: 'Serviço não encontrado' }

  await expireStaleHolds(client)

  const startsAt = new Date(params.starts_at)
  const endsAt = new Date(startsAt.getTime() + service.duration_min * 60_000)
  const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60_000)

  const { data: booking, error: insertErr } = await client
    .from('bookings')
    .insert({
      service_id: service.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      customer_email: params.customer_email,
      notes: params.notes ?? null,
      status: 'pending_payment',
      deposit_amount: service.deposit_amount,
      hold_expires_at: holdExpiresAt.toISOString(),
    })
    .select('*')
    .single()

  if (insertErr) {
    // exclusion_violation = horário acabou de ser ocupado por outra reserva
    if (insertErr.code === '23P01') return { success: false, error: 'Este horário acabou de ser reservado. Escolha outro.' }
    return { success: false, error: insertErr.message }
  }

  // Sem sinal (ex: orçamento personalizado) — confirma direto, sem Pix.
  if (Number(service.deposit_amount) <= 0) {
    await client.from('bookings').update({ status: 'confirmed', hold_expires_at: null }).eq('id', booking.id)
    return { success: true, data: { booking: { ...booking, status: 'confirmed' }, pix: { qr_code: null, qr_code_base64: null } } }
  }

  try {
    const pix = await createPixPayment({
      bookingId: booking.id,
      amount: Number(service.deposit_amount),
      description: `Sinal — ${service.name}`,
      payerEmail: params.customer_email,
      payerFirstName: params.customer_name.split(' ')[0],
      idempotencyKey: booking.id,
    })
    await client.from('bookings').update({ mp_payment_id: String(pix.id) }).eq('id', booking.id)
    return {
      success: true,
      data: { booking, pix: { qr_code: pix.qr_code, qr_code_base64: pix.qr_code_base64 } },
    }
  } catch (err) {
    // Falhou ao criar o Pix — desfaz o hold do slot.
    await client.from('bookings').delete().eq('id', booking.id)
    return { success: false, error: err instanceof Error ? err.message : 'Erro ao gerar Pix' }
  }
}

/**
 * Confirma um agendamento a partir de um pagamento aprovado (chamado pelo webhook).
 * Idempotente: se já estiver confirmed, não faz nada.
 */
export async function confirmBookingFromPayment(
  client: SupabaseClient,
  mpPaymentId: string,
): Promise<ServiceResult> {
  const { data: booking, error } = await client
    .from('bookings')
    .select('*, service:services(*)')
    .eq('mp_payment_id', mpPaymentId)
    .maybeSingle()
  if (error || !booking) return { success: false, error: 'Agendamento não encontrado para este pagamento' }
  if (booking.status === 'confirmed') return { success: true } // idempotente

  // Pagamento aprovado depois do hold de 20min expirar: expireStaleHolds já cancelou o
  // booking. Só tentamos reativar se o cancelamento foi automático (hold_expired) — nunca
  // se o próprio cliente cancelou de propósito (cancel_reason 'customer').
  const isLatePaymentRevival = booking.status === 'cancelled' && booking.cancel_reason === 'hold_expired'
  if (!canTransition(booking.status, 'confirmed') && !isLatePaymentRevival) {
    return { success: false, error: `Transição inválida: ${booking.status} → confirmed` }
  }

  // Confirma no banco ANTES de tentar o espelho — o banco é a fonte da verdade
  // (ver CLAUDE.md); uma falha do Google Calendar não pode deixar um sinal pago
  // preso em pending_payment.
  const { error: updateErr } = await client
    .from('bookings')
    .update({ status: 'confirmed', hold_expires_at: null, cancel_reason: null })
    .eq('id', booking.id)

  if (updateErr) {
    // exclusion_violation: o horário foi ocupado por outra reserva enquanto este
    // estava cancelado por hold expirado — a constraint bookings_no_overlap impede
    // o double-booking. Não há como confirmar automaticamente; precisa de humano.
    if (updateErr.code === '23P01') {
      return {
        success: false,
        error: 'Pagamento aprovado, mas este horário foi ocupado por outra reserva enquanto o hold estava expirado. Contate o cliente para reagendar ou estornar o sinal.',
      }
    }
    return { success: false, error: updateErr.message }
  }

  await mirrorToCalendar(client, booking.id, {
    summary: `${booking.service?.name ?? 'Sessão'} — ${booking.customer_name}`,
    description: `Tel: ${booking.customer_phone}${booking.notes ? `\nObs: ${booking.notes}` : ''}`,
    startsAt: booking.starts_at,
    endsAt: booking.ends_at,
  })

  return { success: true }
}

export async function getPolicy(client: SupabaseClient): Promise<CancellationPolicy> {
  // `app_settings` (key/value), não `settings` (config de frete legada, colunas fixas).
  const { data } = await client.from('app_settings').select('value').eq('key', 'cancellation_policy').maybeSingle()
  return (data?.value as CancellationPolicy) ?? DEFAULT_CANCELLATION_POLICY
}

export async function cancelBookingByToken(client: SupabaseClient, token: string): Promise<ServiceResult> {
  const { data: booking, error } = await client.from('bookings').select('*').eq('manage_token', token).maybeSingle()
  if (error || !booking) return { success: false, error: 'Agendamento não encontrado' }
  if (!canTransition(booking.status, 'cancelled')) return { success: false, error: 'Este agendamento não pode ser cancelado' }

  if (booking.gcal_event_id) await deleteCalendarEvent(booking.gcal_event_id)
  const { error: updateErr } = await client
    .from('bookings')
    .update({ status: 'cancelled', cancel_reason: 'customer' })
    .eq('id', booking.id)
  if (updateErr) return { success: false, error: updateErr.message }

  const policy = await getPolicy(client)
  const refundable = isRefundable(booking.starts_at, policy)
  return { success: true, data: undefined, error: refundable ? undefined : 'Fora do prazo de reembolso do sinal — política do estúdio.' }
}

export async function rescheduleBookingByToken(
  client: SupabaseClient,
  token: string,
  newStartsAt: string,
): Promise<ServiceResult> {
  const { data: booking, error } = await client
    .from('bookings')
    .select('*, service:services(*)')
    .eq('manage_token', token)
    .maybeSingle()
  if (error || !booking) return { success: false, error: 'Agendamento não encontrado' }
  if (booking.status !== 'confirmed') return { success: false, error: 'Apenas agendamentos confirmados podem ser remarcados' }

  // reschedules_used vem do banco, não do cliente — evita burlar max_reschedules.
  const reschedulesUsed = booking.reschedules_used ?? 0
  const policy = await getPolicy(client)
  if (!canReschedule(booking.starts_at, reschedulesUsed, policy)) {
    return { success: false, error: 'Fora do prazo ou limite de remarcações da política do estúdio' }
  }

  await expireStaleHolds(client)

  const durationMin = booking.service?.duration_min ?? 60
  const newEndsAt = new Date(new Date(newStartsAt).getTime() + durationMin * 60_000).toISOString()

  const { error: updateErr } = await client
    .from('bookings')
    .update({ starts_at: newStartsAt, ends_at: newEndsAt, reschedules_used: reschedulesUsed + 1 })
    .eq('id', booking.id)
  if (updateErr) {
    if (updateErr.code === '23P01') return { success: false, error: 'Novo horário indisponível' }
    return { success: false, error: updateErr.message }
  }

  if (booking.gcal_event_id) await updateCalendarEvent(booking.gcal_event_id, { startsAt: newStartsAt, endsAt: newEndsAt })
  return { success: true }
}

/** Consulta um pagamento direto na API do MP — usado pelo webhook antes de confiar no payload. */
export { getPayment }
