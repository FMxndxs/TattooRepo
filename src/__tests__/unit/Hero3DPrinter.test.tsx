import { render, screen } from '@testing-library/react'
import { Hero3DPrinter } from '@/components/ui/hero3d/Hero3DPrinter'

// jsdom não suporta WebGL — mockamos o Canvas do R3F para não tentar criar
// um contexto de renderização real. A cena interna (PrinterScene) não precisa
// rodar em teste unitário; validamos só a casca (poster, container, a11y).
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
}))

jest.mock('@/components/ui/hero3d/PrinterScene', () => ({
  PrinterScene: () => null,
}))

let _reducedMotion = false

jest.mock('motion/react', () => ({
  useReducedMotion: () => _reducedMotion,
}))

describe('Hero3DPrinter', () => {
  beforeEach(() => {
    _reducedMotion = false
  })

  it('renderiza o container decorativo (aria-hidden) com o poster de fundo', () => {
    render(<Hero3DPrinter />)
    const container = screen.getByTestId('hero3d-container')
    expect(container).toHaveAttribute('aria-hidden')
  })

  it('renderiza o Canvas do R3F', () => {
    render(<Hero3DPrinter />)
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })

  it('com prefers-reduced-motion, ainda renderiza (frame estático, sem loop)', () => {
    _reducedMotion = true
    render(<Hero3DPrinter />)
    expect(screen.getByTestId('hero3d-container')).toBeInTheDocument()
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })

  it('aceita onFirstPrintComplete sem quebrar a renderização', () => {
    const onFirstPrintComplete = jest.fn()
    render(<Hero3DPrinter onFirstPrintComplete={onFirstPrintComplete} />)
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
