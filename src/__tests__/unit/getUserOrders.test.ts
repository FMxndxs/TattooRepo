/**
 * Unit tests for getUserOrders()
 * Mocks the Supabase browser client to verify query shape.
 */

const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockOrder = jest.fn()

jest.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}))

import { getUserOrders } from '@/lib/supabase/clientQueries'

beforeEach(() => {
  jest.clearAllMocks()
  // Default chain: select → eq → order
  mockSelect.mockReturnValue({ eq: mockEq })
  mockEq.mockReturnValue({ order: mockOrder })
  mockOrder.mockResolvedValue({ data: [], error: null })
})

describe('getUserOrders', () => {
  it('chama .eq("user_id", userId)', async () => {
    await getUserOrders('user-123')
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
  })

  it('ordena por created_at descending', async () => {
    await getUserOrders('user-123')
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('retorna array vazio em caso de erro', async () => {
    mockOrder.mockResolvedValue({ data: null, error: new Error('DB error') })
    const result = await getUserOrders('user-123')
    expect(result).toEqual([])
  })

  it('retorna os dados quando a query tem sucesso', async () => {
    const fakeOrders = [
      { id: 'order-1', user_id: 'user-123', status: 'pending', total: 49.9, created_at: '2026-01-01', items: [] },
    ]
    mockOrder.mockResolvedValue({ data: fakeOrders, error: null })
    const result = await getUserOrders('user-123')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('order-1')
  })

  it('retorna array vazio quando data é null sem erro', async () => {
    mockOrder.mockResolvedValue({ data: null, error: null })
    const result = await getUserOrders('user-123')
    expect(result).toEqual([])
  })
})
