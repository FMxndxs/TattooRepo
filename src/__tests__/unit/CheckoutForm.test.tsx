import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

describe('CheckoutForm', () => {
  it('renderiza os campos obrigatorios', () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
  })

  it('exibe erro se enviar com campos vazios', async () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('chama onSubmit com dados corretos quando formulario valido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Joao Silva' } })
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11987654321' } })
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Vila Madalena' } })
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Sao Paulo' } })

    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Joao Silva',
        phone: '11987654321',
        neighborhood: 'Vila Madalena',
        city: 'Sao Paulo',
      })
    })
  })
})
