import { render, screen } from '@testing-library/react'
import { TypingIndicator } from '@/components/chatbot/TypingIndicator'

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => false,
}))

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

describe('TypingIndicator', () => {
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
    jest.resetModules()
    jest.doMock('motion/react', () => ({
      motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
      },
      AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      useReducedMotion: () => true,
    }))
    const { TypingIndicator: TI } = require('@/components/chatbot/TypingIndicator')
    render(<TI />)
    expect(screen.getByText(/Nozzle está digitando/i)).toBeInTheDocument()
  })
})
