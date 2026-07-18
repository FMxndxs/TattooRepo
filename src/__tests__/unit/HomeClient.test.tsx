import { render, screen, fireEvent } from '@testing-library/react'
import { HomeClient } from '@/app/HomeClient'

// next/dynamic normalmente carrega o chunk assincronamente; no teste substituímos
// por um stub síncrono que expõe um botão para simular `onFirstPrintComplete`
// (o gatilho real vem de dentro da cena 3D, que não roda em jsdom).
jest.mock('next/dynamic', () => () => {
  function MockHero3DPrinter({ onFirstPrintComplete }: { onFirstPrintComplete?: () => void }) {
    return (
      <button type="button" data-testid="mock-first-print-complete" onClick={() => onFirstPrintComplete?.()}>
        simular fim da 1ª impressão
      </button>
    )
  }
  return MockHero3DPrinter
})

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

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, animate, ...props }: React.HTMLAttributes<HTMLDivElement> & { animate?: unknown }) => (
      <div data-animate={JSON.stringify(animate)} {...props}>
        {children}
      </div>
    ),
    // PrintCtaLink faz `motion.create(Link)` — repassa só as props "normais",
    // descartando as motion-only (whileHover/whileTap/transition) que o <a> não entende.
    create: (Component: React.ElementType) => (props: Record<string, unknown>) => {
      const rest = { ...props }
      delete rest.whileHover
      delete rest.whileTap
      delete rest.transition
      const AnyComponent = Component as React.ComponentType<Record<string, unknown>>
      return <AnyComponent {...rest} />
    },
  },
  useReducedMotion: () => _reducedMotion,
  useInView: () => true,
}))

describe('HomeClient — reveal do texto foco do hero', () => {
  beforeEach(() => {
    _reducedMotion = false
  })

  it('nasce com o texto foco oculto (opacity 0) enquanto não é revelado', () => {
    render(<HomeClient />)
    const heading = screen.getByRole('heading', { level: 1 })
    const animatedWrapper = heading.parentElement
    expect(animatedWrapper).toHaveAttribute('data-animate', JSON.stringify({ opacity: 0, y: 40 }))
  })

  it('revela o texto foco quando a 1ª impressão termina', () => {
    render(<HomeClient />)
    fireEvent.click(screen.getByTestId('mock-first-print-complete'))

    const heading = screen.getByRole('heading', { level: 1 })
    const animatedWrapper = heading.parentElement
    expect(animatedWrapper).toHaveAttribute('data-animate', JSON.stringify({ opacity: 1, y: 0 }))
  })

  it('com prefers-reduced-motion, o texto foco já nasce visível', () => {
    _reducedMotion = true
    render(<HomeClient />)

    const heading = screen.getByRole('heading', { level: 1 })
    const animatedWrapper = heading.parentElement
    expect(animatedWrapper).toHaveAttribute('data-animate', JSON.stringify({ opacity: 1, y: 0 }))
  })

  it('mantém os 2 CTAs do hero (catálogo e projeto personalizado)', () => {
    render(<HomeClient />)
    expect(screen.getByRole('link', { name: /ver catálogo/i })).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('link', { name: /projeto personalizado/i })).toHaveAttribute('href', '/custom-order')
  })
})
