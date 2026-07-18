'use client'

import { forwardRef } from 'react'
import type { Mesh } from 'three'

const BRAND_FILAMENT = '#b683ff'

/**
 * Fio fino de filamento saindo do bico — posição/escala controladas de fora via
 * `ref` (dentro do `useFrame` de `Printer.tsx`, que já sabe onde está o toolhead).
 */
export const Filament = forwardRef<Mesh>(function Filament(_, ref) {
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
      <meshStandardMaterial color={BRAND_FILAMENT} emissive={BRAND_FILAMENT} emissiveIntensity={2.4} toneMapped={false} />
    </mesh>
  )
})
