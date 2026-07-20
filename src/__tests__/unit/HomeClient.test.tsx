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
    // O título do hero agora revela linha a linha via `motion.span` (clip-up) —
    // mesmo padrão de mock do `motion.div` acima, só que pra span.
    span: ({ children, animate, ...props }: React.HTMLAttributes<HTMLSpanElement> & { animate?: unknown }) => (
      <span data-animate={JSON.stringify(animate)} {...props}>
        {children}
      </span>
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

/** As 3 linhas do título ("clip-up") ficam dentro do <h1>; o AccentSweep também
 *  usa motion.span mas anima `x`, não `y` — filtramos só as linhas de verdade. */
function getHeadlineLineAnimates(heading: HTMLElement) {
  return Array.from(heading.querySelectorAll('[data-animate]'))
    .map((el) => JSON.parse(el.getAttribute('data-animate') || 'null'))
    .filter((value): value is { y: number | string } => !!value && typeof value === 'object' && 'y' in value)
}

describe('HomeClient — reveal do texto foco do hero', () => {
  beforeEach(() => {
    _reducedMotion = false
  })

  it('nasce com as linhas do título ocultas (fora da tela) enquanto não é revelado', () => {
    render(<HomeClient />)
    const heading = screen.getByRole('heading', { level: 1 })
    const lineAnimates = getHeadlineLineAnimates(heading)
    expect(lineAnimates.length).toBeGreaterThan(0)
    lineAnimates.forEach((value) => expect(value).toEqual({ y: '100%' }))
  })

  it('revela as linhas do título quando a 1ª impressão termina', () => {
    render(<HomeClient />)
    fireEvent.click(screen.getByTestId('mock-first-print-complete'))

    const heading = screen.getByRole('heading', { level: 1 })
    const lineAnimates = getHeadlineLineAnimates(heading)
    expect(lineAnimates.length).toBeGreaterThan(0)
    lineAnimates.forEach((value) => expect(value).toEqual({ y: 0 }))
  })

  it('com prefers-reduced-motion, as linhas do título já nascem visíveis', () => {
    _reducedMotion = true
    render(<HomeClient />)

    const heading = screen.getByRole('heading', { level: 1 })
    const lineAnimates = getHeadlineLineAnimates(heading)
    expect(lineAnimates.length).toBeGreaterThan(0)
    lineAnimates.forEach((value) => expect(value).toEqual({ y: 0 }))
  })

  it('mantém os 2 CTAs do hero (catálogo e projeto personalizado)', () => {
    render(<HomeClient />)
    expect(screen.getByRole('link', { name: /ver catálogo/i })).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('link', { name: /projeto personalizado/i })).toHaveAttribute('href', '/custom-order')
  })
})
