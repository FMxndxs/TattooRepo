import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthModal } from '@/components/auth/AuthModal'

// Mock auth context
jest.mock('@/lib/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: jest.fn(),
    signUp: jest.fn(),
    user: null,
    profile: null,
    loading: false,
    isAuthenticated: false,
  }),
}))

// Modal uses createPortal — stub to render inline
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom')
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  }
})

describe('AuthModal', () => {
  it('nao renderiza quando fechado', () => {
    render(<AuthModal isOpen={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza tabs quando aberto', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    // "Entrar" aparece na tab e no botão de submit — garantir que pelo menos um existe
    expect(screen.getAllByText('Entrar').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Criar conta').length).toBeGreaterThanOrEqual(1)
  })

  it('mostra formulario de login por padrao', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} defaultTab="login" />)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  })

  it('troca para aba de cadastro ao clicar', async () => {
    render(<AuthModal isOpen={true} onClose={() => {}} defaultTab="login" />)
    // Click on the "Criar conta" tab button (first occurrence in tabs)
    const tabs = screen.getAllByText('Criar conta')
    fireEvent.click(tabs[0])
    await waitFor(() => {
      expect(screen.getByLabelText(/sobrenome/i)).toBeInTheDocument()
    })
  })

  it('chama onClose ao clicar no botao fechar', () => {
    const onClose = jest.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('mostra formulario de cadastro por padrao quando defaultTab=signup', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} defaultTab="signup" />)
    // Signup form tem campos específicos
    expect(screen.getAllByLabelText(/nome/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText(/sobrenome/i)).toBeInTheDocument()
  })
})
