import { trackProductClick } from '@/lib/analytics/trackProductClick'

const mockRpc = jest.fn().mockResolvedValue({ error: null })

jest.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({ rpc: mockRpc }),
}))

jest.mock('@/lib/analytics/sessionId', () => ({
  getOrCreateSessionId: () => 'test-session-id',
}))

describe('trackProductClick', () => {
  beforeEach(() => {
    mockRpc.mockClear()
  })

  it('chama register_product_click com productId e sessionId corretos', async () => {
    await trackProductClick('produto-uuid-123')
    expect(mockRpc).toHaveBeenCalledWith('register_product_click', {
      p_product_id: 'produto-uuid-123',
      p_session_id: 'test-session-id',
    })
  })

  it('nao relanca erro quando supabase falha', async () => {
    mockRpc.mockRejectedValueOnce(new Error('network error'))
    await expect(trackProductClick('produto-uuid-123')).resolves.toBeUndefined()
  })

  it('nao chama rpc quando sessionId esta vazio (SSR)', async () => {
    jest.resetModules()
    jest.doMock('@/lib/analytics/sessionId', () => ({
      getOrCreateSessionId: () => '',
    }))
    const { trackProductClick: track } = await import('@/lib/analytics/trackProductClick')
    await track('produto-uuid-123')
    expect(mockRpc).not.toHaveBeenCalled()
  })
})
