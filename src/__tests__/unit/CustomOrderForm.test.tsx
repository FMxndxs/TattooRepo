import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CustomOrderForm } from '@/components/custom-order/CustomOrderForm'

describe('CustomOrderForm', () => {
  it('renderiza todos os campos', () => {
    render(<CustomOrderForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descri/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/link de referência/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cor/i)).toBeInTheDocument()
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

  it('chama onSubmit com dados corretos quando formulario valido', async () => {
    const onSubmit = jest.fn()
    render(<CustomOrderForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Felipe Mendes' } })
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11989525014' } })
    fireEvent.change(screen.getByLabelText(/descri/i), {
      target: { value: 'Quero imprimir um suporte de parede para meu roteador' },
    })
    fireEvent.change(screen.getByLabelText(/link de referência/i), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/cor/i), { target: { value: 'Preto' } })

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Felipe Mendes',
          phone: '11989525014',
          description: 'Quero imprimir um suporte de parede para meu roteador',
          color_name: 'Preto',
        }),
      )
    })
  })
})
