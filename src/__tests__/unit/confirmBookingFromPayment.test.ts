// Dois achados do runbook D-B3 corrigidos aqui:
// 1. GCal indisponível durante a confirmação não pode travar o booking em
//    pending_payment com o sinal já pago — o banco confirma primeiro, o espelho no
//    Google Calendar é best-effort (try/catch), nunca derruba o `success: true`.
// 2. Pagamento aprovado depois do hold de 20min expirar (booking já 'cancelled' por
//    expireStaleHolds) tenta reativar automaticamente SE E SÓ SE cancel_reason for
//    'hold_expired' — nunca quando o próprio cliente cancelou (cancel_reason 'customer').
//    A constraint bookings_no_overlap do banco é a defesa final contra double-booking.

jest.mock('@/lib/calendar/google', () => ({
  createCalendarEvent: jest.fn(),
  deleteCalendarEvent: jest.fn(),
  updateCalendarEvent: jest.fn(),
}))

import { confirmBookingFromPayment } from '@/lib/booking/service'
import { createCalendarEvent } from '@/lib/calendar/google'

function makeClient(booking: Record<string, unknown> | null, updateResult: { error: unknown } = { error: null }) {
  const updateEq = jest.fn().mockResolvedValue(updateResult)
  const update = jest.fn().mockReturnValue({ eq: updateEq })

  return {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({ data: booking, error: null }),
        }),
      }),
      update,
    }),
    _update: update,
    _updateEq: updateEq,
  }
}

const baseBooking = {
  id: 'b1',
  status: 'pending_payment',
  cancel_reason: null,
  starts_at: '2026-08-01T10:00:00.000Z',
  ends_at: '2026-08-01T11:00:00.000Z',
  customer_name: 'Cliente Teste',
  customer_phone: '11999999999',
  notes: null,
  service: { name: 'Flash' },
}

describe('confirmBookingFromPayment', () => {
  beforeEach(() => jest.clearAllMocks())

  it('é idempotente: já confirmado não atualiza nem chama o calendário de novo', async () => {
    const client = makeClient({ ...baseBooking, status: 'confirmed' })

    const result = await confirmBookingFromPayment(client as never, 'pay-1')

    expect(result.success).toBe(true)
    expect(client._update).not.toHaveBeenCalled()
    expect(createCalendarEvent).not.toHaveBeenCalled()
  })

  it('confirma no banco mesmo se o Google Calendar falhar', async () => {
    const client = makeClient({ ...baseBooking })
    ;(createCalendarEvent as jest.Mock).mockRejectedValue(new Error('GOOGLE_SA_EMAIL não configurado'))
    const consoleErr = jest.spyOn(console, 'error').mockImplementation(() => {})

    const result = await confirmBookingFromPayment(client as never, 'pay-2')

    expect(result.success).toBe(true)
    expect(client._update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'confirmed', hold_expires_at: null }),
    )
    expect(consoleErr).toHaveBeenCalled()
    consoleErr.mockRestore()
  })

  it('grava o gcal_event_id quando o Google Calendar responde com sucesso', async () => {
    const client = makeClient({ ...baseBooking })
    ;(createCalendarEvent as jest.Mock).mockResolvedValue('evt-999')

    await confirmBookingFromPayment(client as never, 'pay-3')

    expect(client._update).toHaveBeenCalledWith(expect.objectContaining({ gcal_event_id: 'evt-999' }))
  })

  it('reativa um booking cancelado por hold_expired quando o pagamento chega atrasado', async () => {
    const client = makeClient({ ...baseBooking, status: 'cancelled', cancel_reason: 'hold_expired' })

    const result = await confirmBookingFromPayment(client as never, 'pay-4')

    expect(result.success).toBe(true)
    expect(client._update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'confirmed', cancel_reason: null }),
    )
  })

  it('NUNCA reativa um booking cancelado pelo próprio cliente (cancel_reason customer)', async () => {
    const client = makeClient({ ...baseBooking, status: 'cancelled', cancel_reason: 'customer' })

    const result = await confirmBookingFromPayment(client as never, 'pay-5')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
    expect(client._update).not.toHaveBeenCalled()
  })

  it('retorna erro acionável quando a reativação colide com outra reserva (23P01)', async () => {
    const client = makeClient(
      { ...baseBooking, status: 'cancelled', cancel_reason: 'hold_expired' },
      { error: { code: '23P01', message: 'exclusion_violation' } },
    )

    const result = await confirmBookingFromPayment(client as never, 'pay-6')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/ocupado por outra reserva/)
  })

  it('rejeita transições inválidas normais (ex: done → confirmed)', async () => {
    const client = makeClient({ ...baseBooking, status: 'done' })

    const result = await confirmBookingFromPayment(client as never, 'pay-7')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
  })
})
