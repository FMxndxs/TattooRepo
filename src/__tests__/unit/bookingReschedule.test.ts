// P2-c da auditoria de segurança: reschedulesUsed era fornecido pelo cliente e
// hardcoded em 0 no único caller (src/app/agendamento/[token]/page.tsx), tornando
// `max_reschedules` inaplicável. Agora o contador vive em bookings.reschedules_used
// (migration 105) e rescheduleBookingByToken não aceita mais esse parâmetro.

jest.mock('@/lib/calendar/google', () => ({
  createCalendarEvent: jest.fn(),
  deleteCalendarEvent: jest.fn(),
  updateCalendarEvent: jest.fn(),
}))

import { rescheduleBookingByToken } from '@/lib/booking/service'
import { updateCalendarEvent } from '@/lib/calendar/google'

const POLICY = { refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 }

function makeClient(booking: Record<string, unknown>, updateResult: { error: unknown } = { error: null }) {
  // `.update().eq()` precisa servir dois usos: o de expireStaleHolds, que
  // encadeia mais um `.lt(...)`, e o do próprio reschedule, que é aguardado
  // direto após o `.eq(...)`. O objeto retornado por eq() é ao mesmo tempo
  // uma Promise (thenable) e tem um método `.lt()` que resolve a mesma Promise.
  const update = jest.fn().mockImplementation(() => ({
    eq: jest.fn().mockImplementation(() => {
      const promise = Promise.resolve(updateResult) as Promise<typeof updateResult> & { lt?: jest.Mock }
      promise.lt = jest.fn().mockResolvedValue(updateResult)
      return promise
    }),
  }))

  return {
    from: jest.fn((table: string) => {
      if (table === 'bookings') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: booking, error: null }),
            }),
          }),
          update,
        }
      }
      // app_settings
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { value: POLICY },
              error: null,
            }),
          }),
        }),
      }
    }),
    _update: update,
  }
}

describe('rescheduleBookingByToken — contador de remarcações', () => {
  const farFuture = new Date(Date.now() + 200 * 3_600_000).toISOString() // bem além de reschedule_hours_before

  beforeEach(() => jest.clearAllMocks())

  it('lê reschedules_used do banco e incrementa no update quando permitido', async () => {
    const booking = {
      id: 'b1',
      status: 'confirmed',
      starts_at: farFuture,
      reschedules_used: 0,
      gcal_event_id: null,
      service: { duration_min: 60 },
    }
    const client = makeClient(booking)

    const result = await rescheduleBookingByToken(client as never, 'token-1', farFuture)

    expect(result.success).toBe(true)
    expect(client._update).toHaveBeenCalledWith(
      expect.objectContaining({ reschedules_used: 1 }),
    )
  })

  it('bloqueia quando reschedules_used já atingiu max_reschedules da política', async () => {
    const booking = {
      id: 'b2',
      status: 'confirmed',
      starts_at: farFuture,
      reschedules_used: 1, // === POLICY.max_reschedules
      gcal_event_id: null,
      service: { duration_min: 60 },
    }
    const client = makeClient(booking)

    const result = await rescheduleBookingByToken(client as never, 'token-2', farFuture)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/limite de remarcações/)
    expect(client._update).not.toHaveBeenCalled()
  })

  it('trata reschedules_used ausente (null) como 0', async () => {
    const booking = {
      id: 'b3',
      status: 'confirmed',
      starts_at: farFuture,
      reschedules_used: null,
      gcal_event_id: null,
      service: { duration_min: 60 },
    }
    const client = makeClient(booking)

    const result = await rescheduleBookingByToken(client as never, 'token-3', farFuture)

    expect(result.success).toBe(true)
    expect(client._update).toHaveBeenCalledWith(
      expect.objectContaining({ reschedules_used: 1 }),
    )
  })

  it('espelha a remarcação no Google Calendar quando o booking tem gcal_event_id', async () => {
    const booking = {
      id: 'b4',
      status: 'confirmed',
      starts_at: farFuture,
      reschedules_used: 0,
      gcal_event_id: 'evt-123',
      service: { duration_min: 60 },
    }
    const client = makeClient(booking)

    await rescheduleBookingByToken(client as never, 'token-4', farFuture)

    expect(updateCalendarEvent).toHaveBeenCalledWith('evt-123', expect.objectContaining({ startsAt: farFuture }))
  })
})
