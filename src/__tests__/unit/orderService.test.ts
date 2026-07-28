import { advanceOrderStatus, cancelOrder } from '@/lib/orders/service'

// ─── Mock do Supabase client ──────────────────────────────────────────────────

function makeClient(currentStatus: string, updateError: Error | null = null) {
  const mockUpdate = jest.fn(() => ({
    eq: jest.fn().mockResolvedValue({ error: updateError }),
  }))

  const mockFrom = jest.fn((table: string) => {
    if (table === 'custom_orders') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn().mockResolvedValue({
              data: { status: currentStatus },
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
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'reviewing')
    expect(result.success).toBe(true)
    expect(_mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'reviewing' }))
  })

  it('rejeita transição inválida (pending → accepted)', async () => {
    const { from } = makeClient('pending')
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'accepted')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
  })

  it('rejeita transição de estado terminal (accepted → reviewing)', async () => {
    const { from } = makeClient('accepted')
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'reviewing')
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Transição inválida/)
  })

  it('retorna erro se orçamento não encontrado', async () => {
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    }
    const result = await advanceOrderStatus(client as never, 'unknown', 'reviewing')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Orçamento não encontrado')
  })

  it('retorna erro se update do banco falha', async () => {
    const { from } = makeClient('pending', new Error('RLS denied'))
    const result = await advanceOrderStatus({ from } as never, 'order-1', 'reviewing')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

// ─── cancelOrder ──────────────────────────────────────────────────────────────

describe('cancelOrder', () => {
  it.each(['pending', 'reviewing'])(
    'cancela orçamento no estado %s',
    async (status) => {
      const { from, _mockUpdate } = makeClient(status)
      const result = await cancelOrder({ from } as never, 'order-1')
      expect(result.success).toBe(true)
      expect(_mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'cancelled' }))
    },
  )

  it('não cancela orçamento já aceito (terminal)', async () => {
    const { from } = makeClient('accepted')
    const result = await cancelOrder({ from } as never, 'order-1')
    expect(result.success).toBe(false)
  })
})
