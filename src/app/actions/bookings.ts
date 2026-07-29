'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createBooking, cancelBookingByToken, rescheduleBookingByToken } from '@/lib/booking/service'
import { bookingSchema, type BookingFormData } from '@/lib/validations/booking'
import { checkRateLimit, extractIp } from '@/lib/security/rateLimit'

async function assertNotRateLimited(bucket: string, limit: number, windowMs: number): Promise<string | null> {
  const ip = extractIp(await headers())
  const result = checkRateLimit(`${bucket}:${ip}`, limit, windowMs)
  if (result.limited) {
    return `Muitas tentativas. Tente novamente em ${result.retryAfter ?? 60}s.`
  }
  return null
}

/**
 * Cria o agendamento + Pix do sinal. Usa o client admin (service role) porque
 * `bookings` não tem policy pública de insert — toda escrita passa por aqui,
 * validada em código, não por RLS de cliente anônimo.
 */
export async function createBookingAction(input: BookingFormData) {
  const rateLimitError = await assertNotRateLimited('booking:create', 5, 10 * 60_000)
  if (rateLimitError) return { success: false, error: rateLimitError }

  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }

  const client = createAdminClient()
  return createBooking(client, parsed.data)
}

export async function cancelBookingAction(token: string) {
  const rateLimitError = await assertNotRateLimited('booking:cancel', 10, 10 * 60_000)
  if (rateLimitError) return { success: false, error: rateLimitError }

  const client = createAdminClient()
  return cancelBookingByToken(client, token)
}

export async function rescheduleBookingAction(token: string, newStartsAt: string) {
  const rateLimitError = await assertNotRateLimited('booking:reschedule', 10, 10 * 60_000)
  if (rateLimitError) return { success: false, error: rateLimitError }

  const client = createAdminClient()
  return rescheduleBookingByToken(client, token, newStartsAt)
}
