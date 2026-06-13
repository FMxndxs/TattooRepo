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
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    // Option atual existe como disabled
    const currentOpt = screen.getByRole('option', { name: 'Pendente' })
    expect(currentOpt).toBeDisabled()
  })

  it('shows only valid next statuses from state machine for pending', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    // pending → confirmed | cancelled
    expect(screen.getByRole('option', { name: 'Confirmado' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cancelado' })).toBeInTheDocument()
    // Não deve mostrar estados inválidos
    expect(screen.queryByRole('option', { name: 'Imprimindo' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Pronto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Entregue' })).not.toBeInTheDocument()
  })

  it('shows delivery-specific next statuses at ready with fulfillment=delivery', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(
      <OrderStatusSelect
        orderId="o1"
        orderType="normal"
        currentStatus="ready"
        fulfillmentType="delivery"
      />,
    )
    expect(screen.getByRole('option', { name: 'Saiu p/ entrega' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cancelado' })).toBeInTheDocument()
    // Não deve mostrar shipping nem pickup direto
    expect(screen.queryByRole('option', { name: 'Enviado' })).not.toBeInTheDocument()
  })

  it('shows shipping-specific next statuses at ready with fulfillment=shipping', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(
      <OrderStatusSelect
        orderId="o1"
        orderType="normal"
        currentStatus="ready"
        fulfillmentType="shipping"
      />,
    )
    expect(screen.getByRole('option', { name: 'Enviado' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Saiu p/ entrega' })).not.toBeInTheDocument()
  })

  it('shows pickup delivered at ready with fulfillment=pickup', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(
      <OrderStatusSelect
        orderId="o1"
        orderType="normal"
        currentStatus="ready"
        fulfillmentType="pickup"
      />,
    )
    expect(screen.getByRole('option', { name: 'Entregue' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Saiu p/ entrega' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Enviado' })).not.toBeInTheDocument()
  })

  it('calls advanceOrderStatusAction with correct args on change', async () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'confirmed' } })
    await waitFor(() =>
      expect(mockAdvanceOrderStatusAction).toHaveBeenCalledWith('o1', 'confirmed', 'normal'),
    )
  })

  it('calls advanceOrderStatusAction for custom order type', async () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="c1" orderType="custom" currentStatus="accepted" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'in_production' } })
    await waitFor(() =>
      expect(mockAdvanceOrderStatusAction).toHaveBeenCalledWith('c1', 'in_production', 'custom'),
    )
  })

  it('shows error and reverts status on action failure', async () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: false, error: 'Transição inválida' })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="pending" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'confirmed' } })
    await waitFor(() => expect(screen.getByText('Transição inválida')).toBeInTheDocument())
    // Status revertido para o original
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('pending')
  })

  it('is disabled (no options) for terminal statuses', () => {
    mockAdvanceOrderStatusAction.mockResolvedValue({ success: true })
    render(<OrderStatusSelect orderId="o1" orderType="normal" currentStatus="delivered" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })
})
