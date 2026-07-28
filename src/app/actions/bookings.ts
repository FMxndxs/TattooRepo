'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createBooking, cancelBookingByToken, rescheduleBookingByToken } from '@/lib/booking/service'
import { bookingSchema, type BookingFormData } from '@/lib/validations/booking'

/**
 * Cria o agendamento + Pix do sinal. Usa o client admin (service role) porque
 * `bookings` não tem policy pública de insert — toda escrita passa por aqui,
 * validada em código, não por RLS de cliente anônimo.
 */
export async function createBookingAction(input: BookingFormData) {
  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }

  const client = createAdminClient()
  return createBooking(client, parsed.data)
}

export async function cancelBookingAction(token: string) {
  const client = createAdminClient()
  return cancelBookingByToken(client, token)
}

export async function rescheduleBookingAction(token: string, newStartsAt: string, reschedulesUsed: number) {
  const client = createAdminClient()
  return rescheduleBookingByToken(client, token, newStartsAt, reschedulesUsed)
}
