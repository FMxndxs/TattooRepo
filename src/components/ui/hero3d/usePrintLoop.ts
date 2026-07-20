'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PRINT_MODEL_IDS, type PrintModelId } from './models'

const BUILD_SECONDS = 9
const HOLD_SECONDS = 2.5
const RESET_SECONDS = 1
const CYCLE_SECONDS = BUILD_SECONDS + HOLD_SECONDS + RESET_SECONDS

// Overlap deliberado: o título do hero começa a revelar ANTES do build terminar
// de verdade (causa-e-consequência, não coincidência) — ver HomeClient.tsx.
const NEAR_COMPLETE_LEAD_SECONDS = 0.12

export type PrintPhase = 'build' | 'hold' | 'reset'

export interface PrintLoopState {
  /** 0→1 dentro da fase atual */
  phaseProgress: number
  /** 0→1 de altura já impressa do objeto (mantém-se em 1 durante hold, cai no reset) */
  buildProgress: number
  phase: PrintPhase
  shape: PrintModelId
}

/**
 * Curva de easing ease-in-out (cúbica) — lento no início, acelera no meio,
 * desacelera perto do fim. Usada tanto no build (a "linha de fusão" sobe com
 * essa cadência) quanto no reset em reverso (ela desce com a mesma qualidade
 * de movimento). Pura e sem dependências — fácil de testar isolada.
 */
export function easeInOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t))
  return clamped < 0.5 ? 4 * clamped * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 3) / 2
}

/**
 * Relógio do time-lapse: revela → segura a peça pronta → reseta → repete,
 * ciclando pelos modelos em `PRINT_MODEL_IDS` (vaso → escultura → geométrico).
 * Roda inteiramente num ref (sem re-render do React a cada frame) para não pesar
 * no loop de 60fps.
 *
 * Com `reduced=true`, congela num frame estático (objeto já pronto, sem loop).
 * `onFirstPrintComplete` dispara uma única vez, ao fim do primeiro ciclo de build.
 * `onBuildNearComplete` dispara uma vez POR CICLO, pouco antes do build fechar
 * (overlap deliberado) — é o gatilho para o título do hero começar a "subir"
 * enquanto a peça ainda está terminando (ver `HomeClient.tsx`).
 */
export function usePrintLoop(
  reduced: boolean,
  onFirstPrintComplete?: () => void,
  onBuildNearComplete?: () => void
) {
  const elapsedRef = useRef(0)
  const firstPrintFiredRef = useRef(false)
  const nearCompleteFiredRef = useRef(false)
  const stateRef = useRef<PrintLoopState>({
    phaseProgress: 1,
    buildProgress: 1,
    phase: 'hold',
    shape: PRINT_MODEL_IDS[0],
  })

  useFrame((_, delta) => {
    if (reduced) return // fica parado no frame estático inicial (objeto pronto)

    elapsedRef.current += delta
    const t = elapsedRef.current % CYCLE_SECONDS
    const cycleIndex = Math.floor(elapsedRef.current / CYCLE_SECONDS)
    const shape = PRINT_MODEL_IDS[cycleIndex % PRINT_MODEL_IDS.length]

    if (t < BUILD_SECONDS) {
      const phaseProgress = t / BUILD_SECONDS
      stateRef.current = {
        phase: 'build',
        phaseProgress,
        buildProgress: easeInOutCubic(phaseProgress),
        shape,
      }

      if (!nearCompleteFiredRef.current && t >= BUILD_SECONDS - NEAR_COMPLETE_LEAD_SECONDS) {
        nearCompleteFiredRef.current = true
        onBuildNearComplete?.()
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
        buildProgress: 1 - easeInOutCubic(resetT),
        shape,
      }
      nearCompleteFiredRef.current = false // rearma pro próximo ciclo de build
    }
  })

  return stateRef
}
