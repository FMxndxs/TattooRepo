import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CheckoutForm } from '@/components/cart/CheckoutForm'

// Mock useAuth — return a logged-in user with profile
jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@test.com' },
    profile: {
      id: 'u1',
      first_name: 'Joao',
      last_name: 'Silva',
      phone: '(11) 98765-4321',
      neighborhood: '',
      city: '',
    },
    loading: false,
    isAuthenticated: true,
  }),
}))

describe('CheckoutForm', () => {
  it('renderiza campos de bairro e cidade', () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
  })

  it('exibe dados do perfil do usuario', () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    expect(screen.getByText('Joao Silva')).toBeInTheDocument()
  })

  it('exibe erro se enviar com campos vazios', async () => {
    render(<CheckoutForm onSubmit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('chama onSubmit com dados do perfil quando formulario valido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Vila Madalena' } })
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Sao Paulo' } })
    fireEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Joao Silva',
          phone: '(11) 98765-4321',
          email: 'test@test.com',
          neighborhood: 'Vila Madalena',
          city: 'Sao Paulo',
        }),
      )
    })
  })
})
