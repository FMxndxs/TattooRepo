import { render, screen, fireEvent } from '@testing-library/react'
import { OrderHistoryCard } from '@/components/orders/OrderHistoryCard'
import type { Order } from '@/types'

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
}))

const orderWithItems: Order = {
  id: 'order-1',
  user_id: 'user-123',
  customer_name: 'Felipe',
  customer_phone: '11999999999',
  status: 'in_production',
  total: 89.9,
  freight: null,
  cep: null,
  street: null,
  street_number: null,
  neighborhood: 'Centro',
  city: 'São Paulo',
  notes: null,
  created_at: '2026-01-15T10:00:00Z',
  items: [
    {
      id: 'item-1',
      order_id: 'order-1',
      product_id: 'prod-1',
      color_id: 'color-1',
      size_id: null,
      quantity: 2,
      unit_price: 39.9,
      product: { id: 'prod-1', name: 'Vaso Hexagonal', slug: 'vaso-hexagonal', price: 39.9, is_available: true, is_featured: false, allows_custom_color: true, allows_custom_size: false, category_id: null, description: null, print_time_minutes: null, filament_grams: null, makerworld_url: null, created_at: '', updated_at: '' },
      color: { id: 'color-1', name: 'Roxo', hex_code: '#431370', is_available: true },
      size: null,
    },
    {
      id: 'item-2',
      order_id: 'order-1',
      product_id: 'prod-2',
      color_id: null,
      size_id: 'size-1',
      quantity: 1,
      unit_price: 10.1,
      product: { id: 'prod-2', name: 'Suporte Celular', slug: 'suporte-celular', price: 10.1, is_available: true, is_featured: false, allows_custom_color: false, allows_custom_size: true, category_id: null, description: null, print_time_minutes: null, filament_grams: null, makerworld_url: null, created_at: '', updated_at: '' },
      color: null,
      size: { id: 'size-1', label: 'P', price_modifier: 0, is_available: true },
    },
  ],
}

describe('OrderHistoryCard', () => {
  it('exibe o badge de status com label correto (Em produção)', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    expect(screen.getByText('Em produção')).toBeInTheDocument()
  })

  it('exibe o status "Pendente" via STATUS_DISPLAY fallback', () => {
    const pendingOrder: Order = { ...orderWithItems, status: 'pending', items: [] }
    render(<OrderHistoryCard order={pendingOrder} />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('exibe o total formatado em BRL', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    // R$ 89,90 deve aparecer no documento
    expect(screen.getAllByText(/R\$\s*89,90/).length).toBeGreaterThan(0)
  })

  it('exibe a data formatada em pt-BR', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    expect(screen.getByText('15/01/2026')).toBeInTheDocument()
  })

  it('resumo de itens visível antes de expandir', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    expect(screen.getByText(/Vaso Hexagonal/)).toBeInTheDocument()
  })

  it('expande e exibe itens ao clicar no card', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    const toggle = screen.getByRole('button', { expanded: false })
    fireEvent.click(toggle)
    // Itens expandidos
    expect(screen.getByText('Vaso Hexagonal')).toBeInTheDocument()
    expect(screen.getByText('Suporte Celular')).toBeInTheDocument()
  })

  it('exibe cor com swatch quando item tem cor', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)
    expect(screen.getByText('Roxo')).toBeInTheDocument()
  })

  it('exibe tamanho quando item tem size', () => {
    render(<OrderHistoryCard order={orderWithItems} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('exibe fallback "Sem itens" quando order.items está vazio', () => {
    const emptyOrder: Order = { ...orderWithItems, items: [] }
    render(<OrderHistoryCard order={emptyOrder} />)
    expect(screen.getByText('Sem itens')).toBeInTheDocument()
  })
})
