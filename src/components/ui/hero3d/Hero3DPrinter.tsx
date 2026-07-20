'use client'

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { PrinterScene } from './PrinterScene'
import { useGraphicsQuality } from './useGraphicsQuality'

interface Hero3DPrinterProps {
  /** Dispara uma única vez, ao fim da primeira peça impressa — usado pelo hero para revelar o texto foco. */
  onFirstPrintComplete?: () => void
  /** Dispara uma vez por ciclo, pouco ANTES do build terminar — overlap deliberado com a revelação do texto. */
  onBuildNearComplete?: () => void
}

/**
 * Contém falhas ao carregar/decodificar os modelos GLB (arquivo ausente,
 * corrompido, etc.) para que a cena 3D nunca derrube a página — na pior das
 * hipóteses, o poster CSS por trás do canvas (`.print-buildplate-bg`) continua
 * visível sozinho, sem o time-lapse.
 */
class Hero3DErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Hero3DPrinter] falha ao renderizar a cena 3D:', error)
    }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

/**
 * Fundo em tela cheia do hero: cena 3D (WebGL) de uma peça se revelando em
 * time-lapse, em loop. Client-only (carregado via `next/dynamic` com
 * `ssr:false` em `HomeClient.tsx`) — three.js não roda no servidor.
 *
 * Salvaguardas de performance/bateria/acessibilidade:
 * - `frameloop` pausa quando o hero sai da viewport, a aba fica oculta OU o
 *   visitante pausa manualmente (botão de pausa — WCAG 2.2.2, conteúdo em
 *   auto-loop >5s precisa de um jeito de pausar/parar)
 * - `dpr` e efeitos ajustados por `useGraphicsQuality` + `PerformanceMonitor`
 * - com `prefers-reduced-motion`, renderiza só um frame estático (objeto pronto)
 */
export function Hero3DPrinter({ onFirstPrintComplete, onBuildNearComplete }: Hero3DPrinterProps) {
  const reducedMotion = useReducedMotion()
  const quality = useGraphicsQuality()
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onVisibilityChange = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  const active = inView && tabVisible && !paused

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" aria-hidden data-testid="hero3d-container">
        {/* Poster estático — visível durante o carregamento do chunk/cena, evita flash preto */}
        <div className="absolute inset-0 print-buildplate-bg" />

        <Canvas
          dpr={quality.highGraphics ? [1, 1.5] : [1, 1.25]}
          gl={{ antialias: true, localClippingEnabled: true, powerPreference: 'high-performance' }}
          camera={{ fov: 38, near: 0.1, far: 30 }}
          frameloop={reducedMotion ? 'demand' : active ? 'always' : 'never'}
          className="!absolute !inset-0"
        >
          <Hero3DErrorBoundary>
            <Suspense fallback={null}>
              <PrinterScene
                reducedMotion={!!reducedMotion}
                quality={quality}
                onFirstPrintComplete={onFirstPrintComplete}
                onBuildNearComplete={onBuildNearComplete}
              />
            </Suspense>
          </Hero3DErrorBoundary>
        </Canvas>
      </div>

      {/* Botão de pausa — fora do container aria-hidden (precisa ser alcançável/anunciável) */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Retomar animação' : 'Pausar animação'}
        aria-pressed={paused}
        className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/60 text-brand-300/90 ring-1 ring-brand-500/30 backdrop-blur transition hover:bg-zinc-950/80 hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
      >
        {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  )
}
