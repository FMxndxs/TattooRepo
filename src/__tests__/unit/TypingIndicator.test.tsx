import { render, screen } from '@testing-library/react'
import { TypingIndicator } from '@/components/chatbot/TypingIndicator'

// Variável de fechamento controlada por cada teste
let _reducedMotion = false

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  // Lê a variável no momento da chamada, não na criação do mock
  useReducedMotion: () => _reducedMotion,
}))

describe('TypingIndicator', () => {
  beforeEach(() => {
    _reducedMotion = false
  })

  it('renderiza o aria-label de acessibilidade', () => {
    render(<TypingIndicator />)
    expect(screen.getByLabelText('Nozzle está digitando')).toBeInTheDocument()
  })

  it('renderiza 3 pontinhos animados (motion.span)', () => {
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('span.rounded-full')
    expect(dots).toHaveLength(3)
  })

  it('com reduced motion, exibe texto alternativo', () => {
    _reducedMotion = true
    render(<TypingIndicator />)
    expect(screen.getByText(/Nozzle está digitando/i)).toBeInTheDocument()
  })
})
