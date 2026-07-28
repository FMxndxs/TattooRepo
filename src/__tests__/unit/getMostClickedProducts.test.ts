import { getMostClickedProducts } from '@/lib/supabase/queries'

const mockRpc = jest.fn()
const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockIn = jest.fn()
const mockLimit = jest.fn()
const mockOrder = jest.fn()

const buildChain = (result: unknown) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    then: jest.fn(),
  }
  Object.assign(chain, result)
  return chain
}

const mockSupabase = {
  rpc: mockRpc,
  from: jest.fn(),
}

jest.mock('@/lib/supabase/server', () => ({
  createClient: async () => mockSupabase,
}))

const makeProduct = (id: string) => ({
  id,
  category_id: null,
  name: `Produto ${id}`,
  slug: `produto-${id}`,
  description: null,
  price: 10,
  is_available: true,
  is_featured: false,
  allows_custom_size: false,
  allows_custom_color: false,
  print_time_minutes: 60,
  filament_grams: 20,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
  category: null,
  images: [],
  colors: [],
})

describe('getMostClickedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retorna produtos ordenados por click_count', async () => {
    const clicks = [
      { product_id: 'b', click_count: 5 },
      { product_id: 'a', click_count: 3 },
    ]
    mockRpc.mockResolvedValue({ data: clicks, error: null })

    const fromChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockResolvedValue({ data: [makeProduct('a'), makeProduct('b')], error: null }),
    }
    mockSupabase.from.mockReturnValue(fromChain)

    const result = await getMostClickedProducts(2)
    expect(result[0].id).toBe('b')
    expect(result[1].id).toBe('a')
  })

  it('usa fallback de featured quando nao ha cliques suficientes', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null })

    const featuredProduct = { ...makeProduct('featured-1'), is_featured: true }
    const fromChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [featuredProduct], error: null }),
    }
    mockSupabase.from.mockReturnValue(fromChain)

    const result = await getMostClickedProducts(8)
    expect(result.some((p) => p.id === 'featured-1')).toBe(true)
  })

  it('lanca erro quando rpc falha', async () => {
    mockRpc.mockResolvedValue({ data: null, error: new Error('rpc error') })
    await expect(getMostClickedProducts()).rejects.toThrow('rpc error')
  })
})
