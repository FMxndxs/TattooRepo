import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

// Silencia chamadas reais ao /api/freight — form testa só validação e submit
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false } as Response)
})
afterEach(() => {
  jest.clearAllTimers()
  jest.restoreAllMocks()
})

describe('CheckoutForm', () => {
  it('renderiza todos os campos de endereço', () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/cep/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Número')).toBeInTheDocument()
    expect(screen.getByLabelText(/rua/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
  })

  it('exibe botão de finalizar pedido', () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /finalizar/i })).toBeInTheDocument()
  })

  it('exibe erro se enviar com campos vazios', async () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('chama onSubmit com dados corretos quando formulário válido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Joao Silva' } })
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11987654321' } })
    // CEP field usa useController (controlled) — onChange propaga os dígitos
    fireEvent.change(screen.getByLabelText(/cep/i), { target: { value: '06502000' } })
    fireEvent.change(screen.getByLabelText('Número'), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua das Flores' } })
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Vila Madalena' } })
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Sao Paulo' } })

    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Joao Silva',
          phone: '11987654321',
          cep: '06502000',
          number: '100',
          street: 'Rua das Flores',
          neighborhood: 'Vila Madalena',
          city: 'Sao Paulo',
        }),
      )
    })
  })

  it('exibe painel "Fora da área" quando a API retorna pickup_or_courier', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        distanceKm: 15,
        withinRadius: false,
        freight: null,
        mode: 'pickup_or_courier',
      }),
    } as Response)

    render(<CheckoutForm onSubmit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/cep/i), { target: { value: '01310100' } })

    await waitFor(() => {
      expect(screen.getByText(/fora da área de entrega/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
