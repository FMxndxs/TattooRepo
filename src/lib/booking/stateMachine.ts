import type { BookingStatus, CancellationPolicy } from '@/types/booking'

/**
 * Fallback único usado sempre que `app_settings.cancellation_policy` não pode
 * ser lida (linha ausente, erro de query). Espelha o valor semeado em
 * `100_tattoo_domain.sql` para que o comportamento "sem config" seja idêntico
 * ao "config default recém-instalada".
 */
export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  refundable_hours_before: 72,
  reschedule_hours_before: 48,
  max_reschedules: 1,
}

/**
 * Ciclo de vida do agendamento:
 *   pending_payment → confirmed (sinal pago) → done
 *   pending_payment | confirmed → cancelled
 *   confirmed → no_show
 */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['done', 'no_show', 'cancelled'],
  cancelled: [],
  no_show: [],
  done: [],
}

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false
}

export const STATUS_META: Record<BookingStatus, { label: string; color: string }> = {
  pending_payment: { label: 'Aguardando sinal', color: 'text-yellow-400 bg-yellow-400/10' },
  confirmed:       { label: 'Confirmado',        color: 'text-brand-300 bg-brand-700/20' },
  done:            { label: 'Realizado',         color: 'text-green-400 bg-green-400/10' },
  no_show:         { label: 'Não compareceu',    color: 'text-red-400 bg-red-400/10' },
  cancelled:       { label: 'Cancelado',         color: 'text-red-400 bg-red-400/10' },
}

/** Horas entre agora e o início do agendamento. */
export function hoursUntil(startsAt: string, now: Date = new Date()): number {
  return (new Date(startsAt).getTime() - now.getTime()) / 3_600_000
}

/** O cliente pode cancelar? (sempre pode; define-se apenas se o sinal é reembolsável) */
export function isRefundable(startsAt: string, policy: CancellationPolicy, now?: Date): boolean {
  return hoursUntil(startsAt, now) >= policy.refundable_hours_before
}

/** O cliente pode remarcar? Depende da antecedência e de quantas vezes já remarcou. */
export function canReschedule(
  startsAt: string,
  reschedulesUsed: number,
  policy: CancellationPolicy,
  now?: Date,
): boolean {
  return (
    hoursUntil(startsAt, now) >= policy.reschedule_hours_before &&
    reschedulesUsed < policy.max_reschedules
  )
}
