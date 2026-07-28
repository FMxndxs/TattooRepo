import { render, screen, fireEvent } from '@testing-library/react'
import { OrdersPanel } from '@/components/admin/OrdersPanel'
import type { AdminOrderRow } from '@/lib/admin/orders'

// Mock server actions
jest.mock('@/app/actions/orders', () => ({
  advanceOrderStatusAction: jest.fn().mockResolvedValue({ success: true }),
  cancelOrderAction: jest.fn().mockResolvedValue({ success: true }),
}))

// OrderStatusSelect makes async Supabase calls — mock it
jest.mock('@/components/admin/OrderStatusSelect', () => ({
  OrderStatusSelect: ({ currentStatus }: { currentStatus: string }) => (
    <select defaultValue={currentStatus} aria-label="Status do orçamento">
      <option value={currentStatus}>{currentStatus}</option>
    </select>
  ),
}))

const orders: AdminOrderRow[] = [
  {
    id: 'c1',
    customer_name: 'Ana Silva',
    customer_phone: '(11) 91111-1111',
    status: 'pending',
    created_at: '2026-05-11T10:00:00Z',
    summary: 'Caixa com logotipo',
  },
  {
    id: 'c2',
    customer_name: 'Carlos Lima',
    customer_phone: '(11) 93333-3333',
    status: 'reviewing',
    created_at: '2026-05-10T10:00:00Z',
    summary: 'Fênix em blackwork no antebraço',
  },
  {
    id: 'c3',
    customer_name: 'Ana Silva',
    customer_phone: '(11) 91111-1111',
    status: 'accepted',
    created_at: '2026-05-12T10:00:00Z',
    summary: 'Lettering nas costelas',
  },
]

describe('OrdersPanel', () => {
  it('renders all orders by default', () => {
    render(<OrdersPanel orders={orders} />)
    expect(screen.getByText('Caixa com logotipo')).toBeInTheDocument()
    expect(screen.getByText('Fênix em blackwork no antebraço')).toBeInTheDocument()
    expect(screen.getByText('Lettering nas costelas')).toBeInTheDocument()
  })

  it('filters by customer name search', () => {
    render(<OrdersPanel orders={orders} />)
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'Carlos' } })
    expect(screen.getByText('Fênix em blackwork no antebraço')).toBeInTheDocument()
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
    expect(screen.getByText('Nenhum orçamento encontrado.')).toBeInTheDocument()
  })
})
