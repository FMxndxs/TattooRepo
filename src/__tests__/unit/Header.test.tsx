import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

// Mock dynamic client-side components
jest.mock('@/components/layout/CartIcon', () => ({
  CartIcon: () => <a href="/cart" aria-label="carrinho">Cart</a>,
}))
jest.mock('@/components/layout/UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}))

describe('Header', () => {
  it('exibe o nome da marca', () => {
    render(<Header />)
    expect(screen.getByText(/imagination/i)).toBeInTheDocument()
    expect(screen.getByText('3D')).toBeInTheDocument()
  })

  it('exibe o logo com alt correto', () => {
    render(<Header />)
    expect(screen.getByAltText('Imagination 3D')).toBeInTheDocument()
  })

  it('nao usa placeholder laranja', () => {
    const { container } = render(<Header />)
    expect(container.innerHTML).not.toMatch(/bg-orange/)
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

  it('nao exibe icone de chat no header (chat agora e FAB global)', () => {
    render(<Header />)
    expect(screen.queryByRole('button', { name: /chat/i })).not.toBeInTheDocument()
  })
})
