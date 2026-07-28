import { render, screen } from '@testing-library/react'
import { HomeClient } from '@/app/HomeClient'

let _reducedMotion = false

jest.mock('motion/react', () => {
  const React = require('react')
  return {
    motion: {
      div: ({ children, animate, ...props }: React.HTMLAttributes<HTMLDivElement> & { animate?: unknown }) => (
        React.createElement('div', { ...props, 'data-animate': JSON.stringify(animate) }, children)
      ),
      h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
        React.createElement('h1', props, children),
      p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) =>
        React.createElement('p', props, children),
      create: (Component: React.ElementType) => {
        return (props: Record<string, unknown>) => {
          const { whileHover, whileTap, transition, ...rest } = props
          return React.createElement(Component, rest)
        }
      },
    },
    useReducedMotion: () => _reducedMotion,
    useInView: () => true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

describe('HomeClient', () => {
  beforeEach(() => {
    _reducedMotion = false
  })

  it('renderiza o titulo do estúdio Kadu Freitas Tattoo', () => {
    render(<HomeClient />)
    expect(screen.getByRole('heading', { level: 1, name: /kadu freitas tattoo/i })).toBeInTheDocument()
  })

  it('possui CTA para agendar e ver portfólio', () => {
    render(<HomeClient />)
    expect(screen.getByRole('link', { name: /agendar agora/i })).toHaveAttribute('href', '/agendar')
    expect(screen.getByRole('link', { name: /ver portfólio/i })).toHaveAttribute('href', '/portfolio')
  })

  it('possui CTA para ver flashes no portfólio', () => {
    render(<HomeClient />)
    expect(screen.getByRole('link', { name: /ver flashes/i })).toHaveAttribute('href', '/portfolio')
  })
})
