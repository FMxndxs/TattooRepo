'use client'

import { useState } from 'react'

export interface GraphicsQuality {
  /** Se falso, usa dpr menor no canvas — mantém a mesma coreografia. */
  highGraphics: boolean
}

/**
 * Heurística local de "tier" gráfico. Evita depender de um benchmark de GPU via rede
 * (abordagem do `useDetectGPU` do drei, que busca dados de um CDN externo) só para
 * decorar a home — mais robusto offline e sem custo de rede extra por visita.
 * Combina núcleos de CPU, memória do dispositivo (quando exposta) e ponteiro "grosso"
 * (touch) como sinal de hardware mais modesto.
 */
function detectHighGraphics(): boolean {
  if (typeof navigator === 'undefined') return true

  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const coarsePointer = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches

  if (cores <= 4 || memory <= 4) return false
  if (coarsePointer && cores <= 6) return false
  return true
}

export function useGraphicsQuality(): GraphicsQuality {
  // Inicializador preguiçoso — roda no render, sem precisar de efeito. Seguro porque
  // este componente só é montado no cliente (dynamic import com ssr:false no hero).
  const [highGraphics] = useState(detectHighGraphics)

  return { highGraphics }
}
