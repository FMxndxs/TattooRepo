import {
  canTransition,
  nextStatuses,
  isTerminal,
  STATUS_META,
  ORDER_STATUS_OPTIONS,
} from '@/lib/orders/stateMachine'
import type { FulfillmentType } from '@/types'

// ─── isTerminal ───────────────────────────────────────────────────────────────

describe('isTerminal', () => {
  it.each(['delivered', 'cancelled', 'completed', 'rejected'])(
    '%s é terminal',
    (status) => expect(isTerminal(status)).toBe(true),
  )

  it.each(['pending', 'confirmed', 'in_production', 'finishing', 'ready', 'out_for_delivery', 'shipped'])(
    '%s não é terminal',
    (status) => expect(isTerminal(status)).toBe(false),
  )
})

// ─── STATUS_META ──────────────────────────────────────────────────────────────

describe('STATUS_META', () => {
  it('cobre todos os status do ciclo de produção', () => {
    const expected = [
      'pending', 'confirmed', 'in_production', 'finishing', 'ready',
      'out_for_delivery', 'shipped', 'delivered', 'cancelled', 'completed',
    ]
    for (const s of expected) {
      expect(STATUS_META[s]).toBeDefined()
      expect(STATUS_META[s].label).toBeTruthy()
      expect(STATUS_META[s].color).toBeTruthy()
    }
  })

  it('cobre os status do ciclo de orçamento de custom_orders', () => {
    const expected = ['reviewing', 'quoted', 'accepted', 'rejected']
    for (const s of expected) {
      expect(STATUS_META[s]).toBeDefined()
    }
  })
})

// ─── nextStatuses — fluxo principal ──────────────────────────────────────────

describe('nextStatuses — fluxo principal', () => {
  it('pending → confirmed | cancelled', () => {
    expect(nextStatuses('pending')).toEqual(expect.arrayContaining(['confirmed', 'cancelled']))
    expect(nextStatuses('pending')).toHaveLength(2)
  })

  it('confirmed → in_production | cancelled', () => {
    expect(nextStatuses('confirmed')).toEqual(expect.arrayContaining(['in_production', 'cancelled']))
  })

  it('in_production → finishing | cancelled', () => {
    expect(nextStatuses('in_production')).toEqual(
      expect.arrayContaining(['finishing', 'cancelled']),
    )
  })

  it('finishing → ready | cancelled', () => {
    expect(nextStatuses('finishing')).toEqual(
      expect.arrayContaining(['ready', 'cancelled']),
    )
  })

  it('out_for_delivery → delivered | cancelled', () => {
    expect(nextStatuses('out_for_delivery')).toEqual(
      expect.arrayContaining(['delivered', 'cancelled']),
    )
  })

  it('shipped → delivered | cancelled', () => {
    expect(nextStatuses('shipped')).toEqual(
      expect.arrayContaining(['delivered', 'cancelled']),
    )
  })
})

// ─── nextStatuses — estado ready (depende de fulfillment) ────────────────────

describe('nextStatuses — estado ready', () => {
  it('delivery → out_for_delivery (+ cancelled)', () => {
    const next = nextStatuses('ready', 'delivery')
    expect(next).toContain('out_for_delivery')
    expect(next).toContain('cancelled')
    expect(next).not.toContain('shipped')
    expect(next).not.toContain('delivered')
  })

  it('shipping → shipped (+ cancelled)', () => {
    const next = nextStatuses('ready', 'shipping')
    expect(next).toContain('shipped')
    expect(next).toContain('cancelled')
    expect(next).not.toContain('out_for_delivery')
    expect(next).not.toContain('delivered')
  })

  it('pickup → delivered (+ cancelled)', () => {
    const next = nextStatuses('ready', 'pickup')
    expect(next).toContain('delivered')
    expect(next).toContain('cancelled')
    expect(next).not.toContain('out_for_delivery')
    expect(next).not.toContain('shipped')
  })

  it('fulfillment desconhecido → todos os três + cancelled', () => {
    const next = nextStatuses('ready', null)
    expect(next).toContain('out_for_delivery')
    expect(next).toContain('shipped')
    expect(next).toContain('delivered')
    expect(next).toContain('cancelled')
  })

  it('sem fulfillment → todos os três + cancelled', () => {
    const next = nextStatuses('ready')
    expect(next).toContain('out_for_delivery')
    expect(next).toContain('shipped')
    expect(next).toContain('delivered')
    expect(next).toContain('cancelled')
  })
})

// ─── nextStatuses — terminais ─────────────────────────────────────────────────

describe('nextStatuses — estados terminais', () => {
  it.each(['delivered', 'cancelled', 'completed', 'rejected'])(
    '%s não tem próximos estados',
    (status) => expect(nextStatuses(status)).toHaveLength(0),
  )
})

// ─── nextStatuses — custom_orders ────────────────────────────────────────────

describe('nextStatuses — ciclo de orçamento (custom_orders)', () => {
  it('accepted → in_production | cancelled', () => {
    expect(nextStatuses('accepted')).toEqual(
      expect.arrayContaining(['in_production', 'cancelled']),
    )
  })

  it('reviewing → quoted | cancelled', () => {
    expect(nextStatuses('reviewing')).toEqual(
      expect.arrayContaining(['quoted', 'cancelled']),
    )
  })

  it('quoted → accepted | rejected', () => {
    expect(nextStatuses('quoted')).toEqual(
      expect.arrayContaining(['accepted', 'rejected']),
    )
  })
})

// ─── canTransition ────────────────────────────────────────────────────────────

describe('canTransition', () => {
  it('permite transições válidas no fluxo principal', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true)
    expect(canTransition('confirmed', 'in_production')).toBe(true)
    expect(canTransition('in_production', 'finishing')).toBe(true)
    expect(canTransition('finishing', 'ready')).toBe(true)
  })

  it('permite cancelar de qualquer estado não-terminal', () => {
    const nonTerminal = ['pending', 'confirmed', 'in_production', 'finishing',
                         'ready', 'out_for_delivery', 'shipped']
    for (const s of nonTerminal) {
      expect(canTransition(s, 'cancelled')).toBe(true)
    }
  })

  it('bloqueia transições inválidas', () => {
    expect(canTransition('pending', 'in_production')).toBe(false)
    expect(canTransition('pending', 'delivered')).toBe(false)
    expect(canTransition('confirmed', 'ready')).toBe(false)
    expect(canTransition('finishing', 'shipped')).toBe(false)
  })

  it('bloqueia qualquer transição a partir de terminais', () => {
    expect(canTransition('delivered', 'cancelled')).toBe(false)
    expect(canTransition('cancelled', 'pending')).toBe(false)
    expect(canTransition('completed', 'confirmed')).toBe(false)
  })

  // Transições de `ready` com fulfillment
  describe('ready com fulfillment', () => {
    const cases: [string, FulfillmentType, boolean][] = [
      ['out_for_delivery', 'delivery',  true],
      ['shipped',          'delivery',  false],
      ['delivered',        'delivery',  false],
      ['shipped',          'shipping',  true],
      ['out_for_delivery', 'shipping',  false],
      ['delivered',        'shipping',  false],
      ['delivered',        'pickup',    true],
      ['out_for_delivery', 'pickup',    false],
      ['shipped',          'pickup',    false],
    ]
    it.each(cases)(
      'ready → %s (fulfillment=%s) deve ser %s',
      (to, fulfillment, expected) =>
        expect(canTransition('ready', to, fulfillment)).toBe(expected),
    )
  })

  it('permite custom_order: accepted → in_production', () => {
    expect(canTransition('accepted', 'in_production')).toBe(true)
  })

  it('bloqueia custom_order: accepted → confirmed (pula etapa)', () => {
    expect(canTransition('accepted', 'confirmed')).toBe(false)
  })
})

// ─── ORDER_STATUS_OPTIONS ─────────────────────────────────────────────────────

describe('ORDER_STATUS_OPTIONS', () => {
  it('inclui todos os status do ciclo de produção', () => {
    const expected: string[] = [
      'pending', 'confirmed', 'in_production', 'finishing', 'ready',
      'out_for_delivery', 'shipped', 'delivered', 'cancelled',
    ]
    for (const s of expected) {
      expect(ORDER_STATUS_OPTIONS).toContain(s)
    }
  })

  it('não inclui status exclusivos de custom_orders', () => {
    expect(ORDER_STATUS_OPTIONS).not.toContain('reviewing')
    expect(ORDER_STATUS_OPTIONS).not.toContain('quoted')
    expect(ORDER_STATUS_OPTIONS).not.toContain('accepted')
    expect(ORDER_STATUS_OPTIONS).not.toContain('rejected')
  })
})
