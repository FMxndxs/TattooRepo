import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

// Mock Supabase browser client
const mockUpdate = jest.fn()
const mockEq = jest.fn()
const mockFrom = jest.fn()

jest.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({
    from: (table: string) => {
      mockFrom(table)
      return {
        update: (data: unknown) => {
          mockUpdate(data)
          return { eq: mockEq }
        },
      }
    },
  }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('OrderStatusSelect', () => {
  it('renders all 4 admin status options', () => {
    mockEq.mockResolvedValue({ error: null })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pendente' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Em produção' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Concluído' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cancelado' })).toBeInTheDocument()
  })

  it('calls orders table update on change', async () => {
    mockEq.mockResolvedValue({ error: null })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } })
    await waitFor(() => expect(mockFrom).toHaveBeenCalledWith('orders'))
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'completed' })
    expect(mockEq).toHaveBeenCalledWith('id', 'o1')
  })

  it('calls custom_orders table update for custom order type', async () => {
    mockEq.mockResolvedValue({ error: null })
    render(<OrderStatusSelect orderId="c1" orderType="custom" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'in_production' } })
    await waitFor(() => expect(mockFrom).toHaveBeenCalledWith('custom_orders'))
  })

  it('shows error and reverts status on update failure', async () => {
    mockEq.mockResolvedValue({ error: new Error('RLS denied') })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } })
    await waitFor(() => expect(screen.getByText('Erro ao salvar')).toBeInTheDocument())
    // Status reverted to original
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('pending')
  })
})
