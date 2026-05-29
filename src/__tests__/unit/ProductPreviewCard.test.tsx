import { render, screen, fireEvent, act } from '@testing-library/react'
import { ProductPreviewCard } from '@/components/chatbot/ProductPreviewCard'
import type { Product } from '@/types'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('motion/react', () => ({
  motion: {
    button: ({ children, onClick, className, 'aria-label': ariaLabel, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>{children}</button>
    ),
  },
  useReducedMotion: () => true,
}))

jest.mock('@/components/ui/MotionPrimitives', () => ({
  LayerReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockProduct: Product = {
  id: 'p1',
  category_id: 'cat1',
  name: 'Suporte Hexagonal',
  slug: 'suporte-hexagonal',
  description: 'Um suporte decorativo',
  print_time_minutes: 90,
  filament_grams: 30,
  price: 24.9,
  is_available: true,
  is_featured: true,
  allows_custom_size: false,
  allows_custom_color: false,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
  images: [{ id: 'i1', url: '/test.jpg', alt: 'suporte', is_primary: true, sort_order: 0 }],
}

describe('ProductPreviewCard', () => {
  it('exibe o nome do produto', () => {
    render(<ProductPreviewCard product={mockProduct} />)
    expect(screen.getByText('Suporte Hexagonal')).toBeInTheDocument()
  })

  it('exibe o preco formatado em BRL', () => {
    render(<ProductPreviewCard product={mockProduct} />)
    expect(screen.getByText(/24,90/)).toBeInTheDocument()
  })

  it('preco usa cor brand-300', () => {
    const { container } = render(<ProductPreviewCard product={mockProduct} />)
    const price = container.querySelector('[class*="brand-300"]')
    expect(price).toBeInTheDocument()
  })

  it('botao de adicionar ao carrinho esta visivel', () => {
    render(<ProductPreviewCard product={mockProduct} />)
    expect(screen.getByLabelText(/Adicionar Suporte Hexagonal/)).toBeInTheDocument()
  })

  it('botao Ver esta visivel', () => {
    render(<ProductPreviewCard product={mockProduct} />)
    expect(screen.getByLabelText(/Ver Suporte Hexagonal/)).toBeInTheDocument()
  })

  it('adicionar ao carrinho muda texto do botao para ✓', async () => {
    const { useCartStore } = require('@/lib/store/cartStore')
    const addItem = jest.fn()
    jest.spyOn(useCartStore, 'getState').mockReturnValue({ addItem })
    // using mock implementation via store direct
    render(<ProductPreviewCard product={mockProduct} />)
    const addBtn = screen.getByLabelText(/Adicionar Suporte Hexagonal/)
    await act(async () => {
      fireEvent.click(addBtn)
    })
    expect(screen.getByText('✓')).toBeInTheDocument()
  })
})
