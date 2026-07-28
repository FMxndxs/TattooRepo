import {
  canTransition,
  nextStatuses,
  isTerminal,
  STATUS_META,
  CUSTOM_ORDER_STATUS_OPTIONS,
} from '@/lib/orders/stateMachine'

// ─── isTerminal ───────────────────────────────────────────────────────────────

describe('isTerminal', () => {
  it.each(['accepted', 'rejected', 'cancelled'])(
    '%s é terminal',
    (status) => expect(isTerminal(status)).toBe(true),
  )

  it.each(['pending', 'reviewing', 'quoted'])(
    '%s não é terminal',
    (status) => expect(isTerminal(status)).toBe(false),
  )
})

// ─── STATUS_META ──────────────────────────────────────────────────────────────

describe('STATUS_META', () => {
  it('cobre todos os status do ciclo de orçamento', () => {
    const expected = ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'cancelled']
    for (const s of expected) {
      expect(STATUS_META[s]).toBeDefined()
      expect(STATUS_META[s].label).toBeTruthy()
      expect(STATUS_META[s].color).toBeTruthy()
    }
  })
})

// ─── nextStatuses ─────────────────────────────────────────────────────────────

describe('nextStatuses', () => {
  it('pending → reviewing | cancelled', () => {
    expect(nextStatuses('pending')).toEqual(expect.arrayContaining(['reviewing', 'cancelled']))
    expect(nextStatuses('pending')).toHaveLength(2)
  })

  it('reviewing → quoted | cancelled', () => {
    expect(nextStatuses('reviewing')).toEqual(expect.arrayContaining(['quoted', 'cancelled']))
  })

  it('quoted → accepted | rejected', () => {
    expect(nextStatuses('quoted')).toEqual(expect.arrayContaining(['accepted', 'rejected']))
  })

  it.each(['accepted', 'rejected', 'cancelled'])(
    '%s não tem próximos estados (terminal)',
    (status) => expect(nextStatuses(status)).toHaveLength(0),
  )
})

// ─── canTransition ────────────────────────────────────────────────────────────

describe('canTransition', () => {
  it('permite transições válidas no fluxo de orçamento', () => {
    expect(canTransition('pending', 'reviewing')).toBe(true)
    expect(canTransition('reviewing', 'quoted')).toBe(true)
    expect(canTransition('quoted', 'accepted')).toBe(true)
    expect(canTransition('quoted', 'rejected')).toBe(true)
  })

  it('permite cancelar de qualquer estado não-terminal', () => {
    expect(canTransition('pending', 'cancelled')).toBe(true)
    expect(canTransition('reviewing', 'cancelled')).toBe(true)
    expect(canTransition('quoted', 'cancelled')).toBe(false) // quoted só vai para accepted/rejected
  })

  it('bloqueia transições inválidas', () => {
    expect(canTransition('pending', 'quoted')).toBe(false)
    expect(canTransition('pending', 'accepted')).toBe(false)
    expect(canTransition('reviewing', 'accepted')).toBe(false)
  })

  it('bloqueia qualquer transição a partir de terminais', () => {
    expect(canTransition('accepted', 'pending')).toBe(false)
    expect(canTransition('rejected', 'pending')).toBe(false)
    expect(canTransition('cancelled', 'pending')).toBe(false)
  })
})

// ─── CUSTOM_ORDER_STATUS_OPTIONS ──────────────────────────────────────────────

describe('CUSTOM_ORDER_STATUS_OPTIONS', () => {
  it('inclui todos os status do ciclo de orçamento', () => {
    const expected = ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'cancelled']
    for (const s of expected) {
      expect(CUSTOM_ORDER_STATUS_OPTIONS).toContain(s)
    }
  })
})
