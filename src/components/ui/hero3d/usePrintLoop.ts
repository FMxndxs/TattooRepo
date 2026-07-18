'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PRINT_SHAPES, type PrintShapeName } from './shapes'

const BUILD_SECONDS = 9
const HOLD_SECONDS = 2.5
const RESET_SECONDS = 1
const CYCLE_SECONDS = BUILD_SECONDS + HOLD_SECONDS + RESET_SECONDS

export type PrintPhase = 'build' | 'hold' | 'reset'

export interface PrintLoopState {
  /** 0→1 dentro da fase atual */
  phaseProgress: number
  /** 0→1 de altura já impressa do objeto (mantém-se em 1 durante hold, cai no reset) */
  buildProgress: number
  phase: PrintPhase
  shape: PrintShapeName
}

/**
 * Relógio do time-lapse: constrói → segura o objeto pronto → reseta → repete,
 * ciclando pelas formas em `PRINT_SHAPES`. Roda inteiramente num ref (sem re-render
 * do React a cada frame) para não pesar no loop de 60fps.
 *
 * Com `reduced=true`, congela num frame estático (objeto já pronto, sem loop).
 * `onFirstPrintComplete` dispara uma única vez, ao fim do primeiro ciclo de build —
 * é o gatilho para o texto foco do hero "subir" na tela (ver `HomeClient.tsx`).
 */
export function usePrintLoop(reduced: boolean, onFirstPrintComplete?: () => void) {
  const elapsedRef = useRef(0)
  const firstPrintFiredRef = useRef(false)
  const stateRef = useRef<PrintLoopState>({
    phaseProgress: 1,
    buildProgress: 1,
    phase: 'hold',
    shape: PRINT_SHAPES[0],
  })

  useFrame((_, delta) => {
    if (reduced) return // fica parado no frame estático inicial (objeto pronto)

    elapsedRef.current += delta
    const t = elapsedRef.current % CYCLE_SECONDS
    const cycleIndex = Math.floor(elapsedRef.current / CYCLE_SECONDS)
    const shape = PRINT_SHAPES[cycleIndex % PRINT_SHAPES.length]

    if (t < BUILD_SECONDS) {
      stateRef.current = {
        phase: 'build',
        phaseProgress: t / BUILD_SECONDS,
        buildProgress: t / BUILD_SECONDS,
        shape,
      }
    } else if (t < BUILD_SECONDS + HOLD_SECONDS) {
      stateRef.current = {
        phase: 'hold',
        phaseProgress: (t - BUILD_SECONDS) / HOLD_SECONDS,
        buildProgress: 1,
        shape,
      }
      if (!firstPrintFiredRef.current) {
        firstPrintFiredRef.current = true
        onFirstPrintComplete?.()
      }
    } else {
      const resetT = (t - BUILD_SECONDS - HOLD_SECONDS) / RESET_SECONDS
      stateRef.current = {
        phase: 'reset',
        phaseProgress: resetT,
        buildProgress: 1 - resetT,
        shape,
      }
    }
  })

  return stateRef
}
