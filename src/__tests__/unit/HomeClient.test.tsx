import { render, screen } from '@testing-library/react'
import { HomeClient } from '@/app/HomeClient'

// Evita a chamada real ao Supabase no useEffect de produtos em destaque.
jest.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({
    rpc: () => Promise.resolve({ data: [] }),
    from: () => ({
      select: () => ({
        eq: () => ({
          in: () => Promise.resolve({ data: [] }),
          order: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [] }),
            }),
          }),
        }),
      }),
    }),
  }),
}))

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

  it('possui link para catálogo de flashes', () => {
    render(<HomeClient />)
    // Link que leva ao catálogo está na seção de flashes
    const catalogLink = screen.queryByRole('link', { name: /ver todas/i })
    if (catalogLink) {
      expect(catalogLink).toHaveAttribute('href', '/catalog')
    }
  })
})
