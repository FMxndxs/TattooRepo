import { canTransition, hoursUntil, isRefundable, canReschedule } from '@/lib/booking/stateMachine'

describe('canTransition', () => {
  it('permite pending_payment -> confirmed', () => {
    expect(canTransition('pending_payment', 'confirmed')).toBe(true)
  })

  it('permite confirmed -> done, no_show, cancelled', () => {
    expect(canTransition('confirmed', 'done')).toBe(true)
    expect(canTransition('confirmed', 'no_show')).toBe(true)
    expect(canTransition('confirmed', 'cancelled')).toBe(true)
  })

  it('bloqueia transicoes a partir de estados terminais', () => {
    expect(canTransition('done', 'confirmed')).toBe(false)
    expect(canTransition('cancelled', 'confirmed')).toBe(false)
    expect(canTransition('no_show', 'done')).toBe(false)
  })

  it('bloqueia pending_payment -> done (pula a confirmacao)', () => {
    expect(canTransition('pending_payment', 'done')).toBe(false)
  })
})

describe('hoursUntil', () => {
  it('calcula horas entre agora e o inicio do agendamento', () => {
    const now = new Date('2026-07-28T10:00:00Z')
    const startsAt = '2026-07-30T10:00:00Z'
    expect(hoursUntil(startsAt, now)).toBe(48)
  })
})

describe('isRefundable', () => {
  const policy = { refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 }
  const now = new Date('2026-07-28T10:00:00Z')

  it('reembolsavel quando dentro do prazo', () => {
    expect(isRefundable('2026-08-01T10:00:00Z', policy, now)).toBe(true) // 96h
  })

  it('nao reembolsavel quando fora do prazo', () => {
    expect(isRefundable('2026-07-29T10:00:00Z', policy, now)).toBe(false) // 24h
  })
})

describe('canReschedule', () => {
  const policy = { refundable_hours_before: 72, reschedule_hours_before: 48, max_reschedules: 1 }
  const now = new Date('2026-07-28T10:00:00Z')

  it('permite remarcar com antecedencia e sem ter usado o limite', () => {
    expect(canReschedule('2026-08-01T10:00:00Z', 0, policy, now)).toBe(true)
  })

  it('bloqueia remarcacao sem antecedencia suficiente', () => {
    expect(canReschedule('2026-07-29T10:00:00Z', 0, policy, now)).toBe(false) // 24h < 48h
  })

  it('bloqueia remarcacao apos atingir o limite de vezes', () => {
    expect(canReschedule('2026-08-01T10:00:00Z', 1, policy, now)).toBe(false)
  })
})
