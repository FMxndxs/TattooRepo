import { render, screen, waitFor } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('motion/react', () => ({
  motion: {
    button: ({ children, onClick, className, 'aria-label': ariaLabel }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>{children}</button>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  useReducedMotion: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/ui/MotionPrimitives', () => ({
  LayerReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import type { Product } from '@/types'

const makeProduct = (id: string, price: number, featured = false): Product => ({
  id,
  category_id: 'cat1',
  name: `Produto ${id}`,
  slug: `produto-${id}`,
  description: null,
  print_time_minutes: null,
  filament_grams: null,
  price,
  is_available: true,
  is_featured: featured,
  allows_custom_size: false,
  allows_custom_color: false,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
})

const mockProducts = [
  makeProduct('a', 30, true),
  makeProduct('b', 10, false),
  makeProduct('c', 20, false),
  makeProduct('d', 5, false),
  makeProduct('e', 40, true),
]

jest.mock('@/lib/supabase/clientQueries', () => ({
  getProductsByCategory: jest.fn(),
}))

import { getProductsByCategory } from '@/lib/supabase/clientQueries'
const mockGetProducts = getProductsByCategory as jest.MockedFunction<typeof getProductsByCategory>

import { ProductPreviewList } from '@/components/chatbot/ProductPreviewList'

beforeEach(() => {
  mockGetProducts.mockResolvedValue(mockProducts)
})

describe('ProductPreviewList — loading state', () => {
  it('exibe skeletons enquanto carrega', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {})) // never resolves
    const { container } = render(<ProductPreviewList categorySlug="decoracao-test-a" />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('ProductPreviewList — success state', () => {
  it('exibe 3 produtos por padrao apos o fetch', async () => {
    render(<ProductPreviewList categorySlug="games-test-b" />)
    await waitFor(() => {
      expect(screen.getAllByText(/Produto/).length).toBe(3)
    })
  })

  it('subFilter=featured exibe apenas produtos em destaque', async () => {
    render(<ProductPreviewList categorySlug="games-test-c" subFilter="featured" />)
    await waitFor(() => {
      // mockProducts tem 2 com is_featured=true (a, e)
      expect(screen.getAllByText(/Produto/).length).toBe(2)
    })
  })

  it('subFilter=sort-price-asc ordena por menor preco', async () => {
    render(<ProductPreviewList categorySlug="games-test-d" subFilter="sort-price-asc" />)
    await waitFor(() => {
      const names = screen.getAllByText(/Produto ./).map((el) => el.textContent ?? '')
      // Sorted asc: d(5), b(10), c(20)
      expect(names[0]).toContain('d')
      expect(names[1]).toContain('b')
      expect(names[2]).toContain('c')
    })
  })

  it('respeita o limit customizado', async () => {
    render(<ProductPreviewList categorySlug="bonecos-test-e" limit={2} />)
    await waitFor(() => {
      expect(screen.getAllByText(/Produto/).length).toBe(2)
    })
  })
})

describe('ProductPreviewList — error state', () => {
  it('exibe mensagem de erro quando fetch falha', async () => {
    mockGetProducts.mockRejectedValueOnce(new Error('Erro de rede'))
    render(<ProductPreviewList categorySlug="escritorio-test-f" />)
    await waitFor(() => {
      expect(screen.getByText(/Não consegui carregar/)).toBeInTheDocument()
    })
  })
})

describe('ProductPreviewList — empty state', () => {
  it('exibe mensagem de categoria vazia quando fetch retorna array vazio', async () => {
    mockGetProducts.mockResolvedValueOnce([])
    render(<ProductPreviewList categorySlug="maquiagem-test-g" />)
    await waitFor(() => {
      expect(screen.getByText(/sendo abastecida/)).toBeInTheDocument()
    })
  })
})
