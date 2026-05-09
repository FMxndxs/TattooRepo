'use client'
import { render, screen } from '@testing-library/react'
import { ProductDetail } from '@/app/product/[slug]/ProductDetail'
import type { Product } from '@/types'

const base: Product = {
  id: 'p1',
  category_id: 'cat1',
  name: 'Vaso Fiori',
  slug: 'vaso-fiori',
  description: 'Vaso decorativo com design espiral.',
  print_time_minutes: 180,
  filament_grams: 80,
  price: 45,
  is_available: true,
  is_featured: false,
  allows_custom_size: false,
  allows_custom_color: true,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
  images: [{ id: 'img1', url: '/test.jpg', alt: 'Vaso', is_primary: true, sort_order: 0 }],
  colors: [{ id: 'c1', name: 'Roxo', hex_code: '#431370', is_available: true }],
}

describe('ProductDetail — bloco MakerWorld', () => {
  it('não exibe o bloco de referência quando makerworld_url é null', () => {
    render(<ProductDetail product={base} />)
    expect(screen.queryByText(/MakerWorld/i)).not.toBeInTheDocument()
  })

  it('exibe o bloco de referência quando makerworld_url está presente', () => {
    const product = { ...base, makerworld_url: 'https://makerworld.com/en/models/1102758-flower-vase' }
    render(<ProductDetail product={product} />)
    expect(screen.getByText(/MakerWorld/i)).toBeInTheDocument()
  })

  it('link de referência aponta para a URL do MakerWorld', () => {
    const url = 'https://makerworld.com/en/models/1102758-flower-vase'
    const product = { ...base, makerworld_url: url }
    render(<ProductDetail product={product} />)
    const link = screen.getByRole('link', { name: /MakerWorld/i })
    expect(link).toHaveAttribute('href', url)
  })

  it('disclaimer menciona imagem ilustrativa', () => {
    const product = { ...base, makerworld_url: 'https://makerworld.com/en/models/1102758-flower-vase' }
    render(<ProductDetail product={product} />)
    expect(screen.getByText(/ilustrativa/i)).toBeInTheDocument()
  })
})
