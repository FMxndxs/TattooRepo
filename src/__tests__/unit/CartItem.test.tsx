import { render, screen, fireEvent } from '@testing-library/react'
import { CartItem } from '@/components/cart/CartItem'
import type { CartItem as CartItemType } from '@/types'

const mockItem: CartItemType = {
  product: {
    id: 'p1',
    category_id: null,
    name: 'Suporte de Fone',
    slug: 'suporte-de-fone',
    description: null,
    print_time_minutes: 120,
    filament_grams: 45,
    price: 29.9,
    is_available: true,
    is_featured: false,
    allows_custom_size: false,
    allows_custom_color: true,
    created_at: '',
    updated_at: '',
  },
  quantity: 2,
  selected_color: { id: 'c1', name: 'Preto', hex_code: '#1a1a1a', is_available: true },
  selected_size: null,
  unit_price: 29.9,
}

describe('CartItem', () => {
  it('exibe o nome do produto', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} onUpdateQuantity={() => {}} />)
    expect(screen.getByText('Suporte de Fone')).toBeInTheDocument()
  })

  it('exibe a cor selecionada', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} onUpdateQuantity={() => {}} />)
    expect(screen.getByText('Preto')).toBeInTheDocument()
  })

  it('exibe o subtotal (preco x quantidade)', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} onUpdateQuantity={() => {}} />)
    expect(screen.getByText(/R\$\s*59,80/)).toBeInTheDocument()
  })

  it('chama onRemove ao clicar em remover', () => {
    const onRemove = jest.fn()
    render(<CartItem item={mockItem} onRemove={onRemove} onUpdateQuantity={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /remover/i }))
    expect(onRemove).toHaveBeenCalled()
  })

  it('chama onUpdateQuantity ao alterar quantidade', () => {
    const onUpdate = jest.fn()
    render(<CartItem item={mockItem} onRemove={() => {}} onUpdateQuantity={onUpdate} />)
    fireEvent.click(screen.getByRole('button', { name: /\+/ }))
    expect(onUpdate).toHaveBeenCalledWith(3)
  })
})
