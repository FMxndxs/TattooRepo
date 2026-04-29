import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('exibe o nome da marca', () => {
    render(<Header />)
    expect(screen.getByText(/imagination/i)).toBeInTheDocument()
    expect(screen.getByText('3D')).toBeInTheDocument()
  })

  it('exibe link para o catalogo', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /catálogo/i })).toBeInTheDocument()
  })

  it('exibe icone do carrinho', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /carrinho/i })).toBeInTheDocument()
  })

  it('exibe link para pedido personalizado', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /personalizado/i })).toBeInTheDocument()
  })
})
