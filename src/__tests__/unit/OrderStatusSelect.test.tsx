import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

// Mock Server Action
const mockAdvanceOrderStatusAction = jest.fn()
jest.mock('@/app/actions/orders', () => ({
  advanceOrderStatusAction: (...args: unknown[]) => mockAdvanceOrderStatusAction(...args),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('OrderStatusSelect', () => {
  it('renders the current status as disabled option', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" currentStatus="pending" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    // Option atual existe como disabled
    const currentOpt = screen.getByRole('option', { name: 'Pendente' })
    expect(currentOpt).toBeDisabled()
  })

  it('shows only valid next statuses from state machine for pending', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" currentStatus="pending" />)
    // pending → reviewing | cancelled
    expect(screen.getByRole('option', { name: 'Em análise' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cancelado' })).toBeInTheDocument()
    // Não deve mostrar estados inválidos
    expect(screen.queryByRole('option', { name: 'Orçado' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Aceito' })).not.toBeInTheDocument()
  })

  it('shows quoted next statuses (accepted | rejected)', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" currentStatus="quoted" />)
    expect(screen.getByRole('option', { name: 'Aceito' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Recusado' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Cancelado' })).not.toBeInTheDocument()
  })

  it('calls advanceOrderStatusAction with correct args on change', async () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reviewing' } })
    await waitFor(() =>
      expect(mockAdvanceOrderStatusAction).toHaveBeenCalledWith('o1', 'reviewing'),
    )
  })

  it('shows error and reverts status on action failure', async () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: false, error: 'Transição inválida' })
    render(<OrderStatusSelect orderId="o1" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reviewing' } })
    await waitFor(() => expect(screen.getByText('Transição inválida')).toBeInTheDocument())
    // Status revertido para o original
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('pending')
  })

  it('is disabled (no options) for terminal statuses', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" currentStatus="accepted" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })
})
