import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/catalog/ProductCard'
import type { Product } from '@/types'

const mockTrack = jest.fn()
jest.mock('@/lib/analytics/trackProductClick', () => ({
  trackProductClick: (...args: unknown[]) => mockTrack(...args),
}))

const mockProduct: Product = {
  id: '1',
  category_id: 'cat1',
  name: 'Suporte de Fone',
  slug: 'suporte-de-fone',
  description: 'Suporte elegante para fone de ouvido',
  print_time_minutes: 120,
  filament_grams: 45,
  price: 29.9,
  is_available: true,
  is_featured: true,
  allows_custom_size: false,
  allows_custom_color: true,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
  images: [{ id: 'img1', url: '/test.jpg', alt: 'Suporte', is_primary: true, sort_order: 0 }],
  colors: [{ id: 'c1', name: 'Preto', hex_code: '#1a1a1a', is_available: true }],
}

describe('ProductCard', () => {
  beforeEach(() => mockTrack.mockClear())

  it('chama trackProductClick ao clicar no card', () => {
    render(<ProductCard product={mockProduct} />)
    fireEvent.click(screen.getByRole('link'))
    expect(mockTrack).toHaveBeenCalledWith(mockProduct.id)
  })

  it('exibe o nome do produto', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Suporte de Fone')).toBeInTheDocument()
  })

  it('exibe o preco formatado em reais', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/R\$\s*29,90/)).toBeInTheDocument()
  })

  it('preco usa cor brand (nao orange)', () => {
    const { container } = render(<ProductCard product={mockProduct} />)
    const price = container.querySelector('[class*="brand"]')
    expect(price).not.toBeNull()
  })

  it('exibe badge "Destaque" quando is_featured=true', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Destaque')).toBeInTheDocument()
  })

  it('nao exibe badge "Destaque" quando is_featured=false', () => {
    render(<ProductCard product={{ ...mockProduct, is_featured: false }} />)
    expect(screen.queryByText('Destaque')).not.toBeInTheDocument()
  })

  it('exibe link para a pagina do produto', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/suporte-de-fone')
  })

  it('exibe "Indisponivel" quando produto nao esta disponivel', () => {
    render(<ProductCard product={{ ...mockProduct, is_available: false }} />)
    expect(screen.getByText('Indisponível')).toBeInTheDocument()
  })
})
