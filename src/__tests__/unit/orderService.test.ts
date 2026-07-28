import { advanceOrderStatus, confirmOrder, cancelOrder } from '@/lib/orders/service'

// ─── Mock do Supabase client ──────────────────────────────────────────────────

function makeClient(
  currentStatus: string,
  fulfillmentType: string | null = null,
  updateError: Error | null = null,
) {
  const mockUpdate = jest.fn(() => ({
    eq: jest.fn().mockResolvedValue({ error: updateError }),
  }))

  const mockFrom = jest.fn((table: string) => {
    if (table === 'orders' || table === 'custom_orders') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { status: currentStatus, fulfillment_type: fulfillmentType },
              error: null,
            }),
          })),
        })),
        update: mockUpdate,
      }
    }
    return {} as never
  })

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: mockFrom as any,
    _mockUpdate: mockUpdate,
  }
}

// ─── advanceOrderStatus ────────────────────────────────────────────────────────

describe('advanceOrderStatus', () => {
  it('avança status quando a transição é válida', async () => {
    const { from, _mockUpdate } = makeClient('pending')
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'confirmed')
    expect(result.success).toBe(true)
    expect(_mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'confirmed' }))
  })

  it('rejeita transição inválida (pending → in_production)', async () => {
    const { from } = makeClient('pending')
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'in_production')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
  })

  it('rejeita transição de estado terminal (delivered → confirmed)', async () => {
    const { from } = makeClient('delivered')
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'confirmed')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
  })

  it('retorna erro se pedido não encontrado', async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    }
    const result = await advanceOrderStatus(client as never, 'unknown', 'confirmed')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Pedido não encontrado')
  })

  it('retorna erro se update do banco falha', async () => {
    const { from } = makeClient('pending', null, new Error('RLS denied'))
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'confirmed')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('passa extra campos (courier_name) no update', async () => {
    const { from, _mockUpdate } = makeClient('ready', 'delivery')
    const result = await advanceOrderStatus(
      { from } as never,
      'order-1',
      'out_for_delivery',
      'normal',
      { courier_name: 'Carlos Moto' },
    )
    expect(result.success).toBe(true)
    expect(_mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'out_for_delivery', courier_name: 'Carlos Moto' }),
    )
  })
})

// ─── fulfillment-aware transitions ────────────────────────────────────────────

describe('advanceOrderStatus — fulfillment type', () => {
  it('delivery: ready → out_for_delivery ✓', async () => {
    const { from } = makeClient('ready', 'delivery')
    const result = await advanceOrderStatus({ from } as never, 'o1', 'out_for_delivery')
    expect(result.success).toBe(true)
  })

  it('delivery: ready → shipped ✗', async () => {
    const { from } = makeClient('ready', 'delivery')
    const result = await advanceOrderStatus({ from } as never, 'o1', 'shipped')
    expect(result.success).toBe(false)
  })

  it('shipping: ready → shipped ✓', async () => {
    const { from } = makeClient('ready', 'shipping')
    const result = await advanceOrderStatus({ from } as never, 'o1', 'shipped')
    expect(result.success).toBe(true)
  })

  it('pickup: ready → delivered ✓', async () => {
    const { from } = makeClient('ready', 'pickup')
    const result = await advanceOrderStatus({ from } as never, 'o1', 'delivered')
    expect(result.success).toBe(true)
  })
})

// ─── confirmOrder ──────────────────────────────────────────────────────────────

describe('confirmOrder', () => {
  it('confirma pedido pendente', async () => {
    const { from, _mockUpdate } = makeClient('pending')
    const result = await confirmOrder({ from } as never, 'order-1')
    expect(result.success).toBe(true)
    expect(_mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'confirmed' }))
  })

  it('rejeita confirmar pedido já confirmado', async () => {
    const { from } = makeClient('confirmed')
    const result = await confirmOrder({ from } as never, 'order-1')
    expect(result.success).toBe(false)
  })

  it('confirma custom_order accepted (accepted → in_production é confirmação de produção)', async () => {
    // Para custom_order, "confirmed" não é uma transição válida de "accepted"
    // A transição correta é accepted → in_production
    const { from } = makeClient('accepted')
    const result = await confirmOrder({ from } as never, 'order-1', 'custom')
    // confirmed não é um próximo estado de accepted
    expect(result.success).toBe(false)
  })
})

// ─── cancelOrder ──────────────────────────────────────────────────────────────

describe('cancelOrder', () => {
  it.each(['pending', 'confirmed', 'in_production', 'finishing', 'ready'])(
    'cancela pedido no estado %s',
    async (status) => {
      const { from, _mockUpdate } = makeClient(status)
      const result = await cancelOrder({ from } as never, 'order-1')
      expect(result.success).toBe(true)
      expect(_mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'cancelled' }))
    },
  )

  it('não cancela pedido já entregue (terminal)', async () => {
    const { from } = makeClient('delivered')
    const result = await cancelOrder({ from } as never, 'order-1')
    expect(result.success).toBe(false)
  })
})
