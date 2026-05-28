import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CustomOrderForm } from '@/components/custom-order/CustomOrderForm'

jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'test@test.com' },
    profile: {
      id: 'u1',
      first_name: 'Felipe',
      last_name: 'Mendes',
      phone: '(11) 98952-5014',
    },
    loading: false,
    isAuthenticated: true,
  }),
}))

jest.mock('@/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploading: false,
    preview: null,
    uploadedUrl: null,
    error: null,
    handleFile: jest.fn(),
  }),
}))

describe('CustomOrderForm', () => {
  it('renderiza campos de descricao, cor e referencia', () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/descri/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/link de referência/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cor/i)).toBeInTheDocument()
  })

  it('nao renderiza campos de nome e telefone', () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    // Nome e telefone vêm do perfil, não há labels de input para eles
    expect(screen.queryByLabelText(/^nome$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^telefone$/i)).not.toBeInTheDocument()
  })

  it('exibe dados do perfil do usuario', () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    expect(screen.getByText('Felipe Mendes')).toBeInTheDocument()
  })

  it('exibe erro se enviar com campos vazios', async () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('exibe erro se descricao for muito curta', async () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/descri/i), { target: { value: 'curto' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByText(/20 caracteres/i)).toBeInTheDocument()
    })
  })

  it('exibe erro se URL de referencia for invalida', async () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/link de referência/i), { target: { value: 'nao-e-url' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByText(/url inválida/i)).toBeInTheDocument()
    })
  })

  it('chama onSubmit quando formulario valido', async () => {
    const onSubmit = jest.fn()
    render(<CustomOrderForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/descri/i), {
      target: { value: 'Quero imprimir um suporte de parede para meu roteador' },
    })
    fireEvent.change(screen.getByLabelText(/link de referência/i), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/cor/i), { target: { value: 'Preto' } })

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Quero imprimir um suporte de parede para meu roteador',
          color_name: 'Preto',
        }),
      )
    })
  })
})
