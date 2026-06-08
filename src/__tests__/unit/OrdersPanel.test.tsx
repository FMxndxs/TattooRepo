import { render, screen, fireEvent } from '@testing-library/react'
import { OrdersPanel } from '@/components/admin/OrdersPanel'
import type { AdminOrderRow } from '@/lib/admin/orders'

// OrderStatusSelect makes async Supabase calls — mock it
jest.mock('@/components/admin/OrderStatusSelect', () => ({
  OrderStatusSelect: ({ currentStatus }: { currentStatus: string }) => (
    <select defaultValue={currentStatus} aria-label="Status do pedido">
      <option value={currentStatus}>{currentStatus}</option>
    </select>
  ),
}))

const orders: AdminOrderRow[] = [
  {
    id: 'o1',
    type: 'normal',
    customer_name: 'Carlos Lima',
    customer_phone: '(11) 93333-3333',
    status: 'pending',
    created_at: '2026-05-10T10:00:00Z',
    summary: '2× Vaso Hexagonal',
    total: 99.9,
  },
  {
    id: 'c1',
    type: 'custom',
    customer_name: 'Ana Silva',
    customer_phone: '(11) 91111-1111',
    status: 'pending',
    created_at: '2026-05-11T10:00:00Z',
    summary: 'Caixa com logotipo',
  },
  {
    id: 'o2',
    type: 'normal',
    customer_name: 'Ana Silva',
    customer_phone: '(11) 91111-1111',
    status: 'completed',
    created_at: '2026-05-12T10:00:00Z',
    summary: '1× Suporte de Mesa',
    total: 39.9,
  },
]

describe('OrdersPanel', () => {
  it('renders all orders in "Todos" tab by default', () => {
    render(<OrdersPanel orders={orders} />)
    expect(screen.getByText('2× Vaso Hexagonal')).toBeInTheDocument()
    expect(screen.getByText('Caixa com logotipo')).toBeInTheDocument()
    expect(screen.getByText('1× Suporte de Mesa')).toBeInTheDocument()
  })

  it('shows only normal orders in "Normais" tab', () => {
    render(<OrdersPanel orders={orders} />)
    fireEvent.click(screen.getByRole('button', { name: 'Normais' }))
    expect(screen.getByText('2× Vaso Hexagonal')).toBeInTheDocument()
    expect(screen.queryByText('Caixa com logotipo')).not.toBeInTheDocument()
  })

  it('shows only custom orders in "Customizados" tab', () => {
    render(<OrdersPanel orders={orders} />)
    fireEvent.click(screen.getByRole('button', { name: 'Customizados' }))
    expect(screen.getByText('Caixa com logotipo')).toBeInTheDocument()
    expect(screen.queryByText('2× Vaso Hexagonal')).not.toBeInTheDocument()
  })

  it('filters by customer name search', () => {
    render(<OrdersPanel orders={orders} />)
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'Carlos' } })
    expect(screen.getByText('2× Vaso Hexagonal')).toBeInTheDocument()
    expect(screen.queryByText('Caixa com logotipo')).not.toBeInTheDocument()
  })

  it('shows customer name in each card (name shown per order, not as external group header)', () => {
    render(<OrdersPanel orders={orders} />)
    // Ana Silva has 2 orders; her name appears in each order card as a <p>
    const nameEls = screen.getAllByText('Ana Silva')
    const cardNames = nameEls.filter(
      (el) => el.tagName === 'P' && el.className.includes('brand-300'),
    )
    expect(cardNames.length).toBe(2)
  })

  it('shows empty state when no orders match filter', () => {
    render(<OrdersPanel orders={orders} />)
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'zzznobody' } })
    expect(screen.getByText('Nenhum pedido encontrado.')).toBeInTheDocument()
  })
})
