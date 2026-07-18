'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from 'motion/react'
import { PrinterScene } from './PrinterScene'
import { useGraphicsQuality } from './useGraphicsQuality'

interface Hero3DPrinterProps {
  /** Dispara uma única vez, ao fim da primeira peça impressa — usado pelo hero para revelar o texto foco. */
  onFirstPrintComplete?: () => void
}

/**
 * Fundo em tela cheia do hero: cena 3D (WebGL) de uma impressora construindo um
 * objeto em time-lapse, em loop. Client-only (carregado via `next/dynamic` com
 * `ssr:false` em `HomeClient.tsx`) — three.js não roda no servidor.
 *
 * Salvaguardas de performance/bateria:
 * - `frameloop` pausa quando o hero sai da viewport ou a aba fica oculta
 * - `dpr` e efeitos (bloom/chão reflexivo) ajustados por `useGraphicsQuality`
 * - com `prefers-reduced-motion`, renderiza só um frame estático (objeto pronto)
 */
export function Hero3DPrinter({ onFirstPrintComplete }: Hero3DPrinterProps) {
  const reducedMotion = useReducedMotion()
  const quality = useGraphicsQuality()
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)

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

  const active = inView && tabVisible

  return (
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
        <Suspense fallback={null}>
          <PrinterScene reducedMotion={!!reducedMotion} quality={quality} onFirstPrintComplete={onFirstPrintComplete} />
        </Suspense>
      </Canvas>
    </div>
  )
}
