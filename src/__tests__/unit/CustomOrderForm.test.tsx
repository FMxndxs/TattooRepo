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
  it('renderiza campos de descricao, estilo e referencia', () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/descreva sua ideia/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/link com referências/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estilo preferido/i)).toBeInTheDocument()
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
    fireEvent.change(screen.getByLabelText(/descreva sua ideia/i), { target: { value: 'curto' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByText(/20 caracteres/i)).toBeInTheDocument()
    })
  })

  it('exibe erro se URL de referencia for invalida', async () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/link com referências/i), { target: { value: 'nao-e-url' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => {
      expect(screen.getByText(/url inválida/i)).toBeInTheDocument()
    })
  })

  it('chama onSubmit quando formulario valido', async () => {
    const onSubmit = jest.fn()
    render(<CustomOrderForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/descreva sua ideia/i), {
      target: { value: 'Quero uma tatuagem de um dragão realista no ombro' },
    })
    fireEvent.change(screen.getByLabelText(/link com referências/i), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/estilo preferido/i), { target: { value: 'Realismo' } })

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Quero uma tatuagem de um dragão realista no ombro',
          color_name: 'Realismo',
        }),
      )
    })
  })
})
