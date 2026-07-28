import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

// Mock dynamic client-side components
jest.mock('@/components/layout/UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}))
jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, isAdmin: false, profile: null, signOut: jest.fn(), loading: false }),
}))
jest.mock('@/lib/store/authModalStore', () => ({
  useAuthModalStore: () => jest.fn(),
}))

describe('Header', () => {
  it('exibe o nome do estúdio Kadu Tattoo', () => {
    render(<Header />)
    expect(screen.getByText(/kadu/i)).toBeInTheDocument()
    expect(screen.getByText('Tattoo')).toBeInTheDocument()
  })

  it('exibe o logo com alt correto', () => {
    render(<Header />)
    expect(screen.getByAltText('Kadu Freitas Tattoo')).toBeInTheDocument()
  })

  it('exibe link para flashes', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /flashes/i })).toBeInTheDocument()
  })

  it('exibe link para portfólio', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /portfólio/i })).toBeInTheDocument()
  })

  it('exibe link para promoções', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /promoções/i })).toBeInTheDocument()
  })

  it('exibe link para agendar', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /agendar/i })).toBeInTheDocument()
  })

  it('nao exibe carrinho (excluido para tatuagem)', () => {
    render(<Header />)
    expect(screen.queryByRole('link', { name: /carrinho/i })).not.toBeInTheDocument()
  })
})
