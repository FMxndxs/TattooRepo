/**
 * Perfis de silhueta (raio em função da altura normalizada 0→1) usados para gerar
 * os objetos "impressos" via THREE.LatheGeometry. Puro/sem dependência do three.js
 * ou do R3F — fácil de testar isoladamente.
 */

export const PRINT_SHAPES = ['vaso', 'ampulheta', 'taca'] as const
export type PrintShapeName = (typeof PRINT_SHAPES)[number]

/** Raio (0–1, relativo) no ponto `t` (0 = base, 1 = topo) do objeto. */
export function shapeRadiusAt(shape: PrintShapeName, t: number): number {
  const clamped = Math.min(1, Math.max(0, t))

  switch (shape) {
    case 'vaso':
      // Base larga, "barriga" no meio, gargalo estreito no topo
      return 0.55 + 0.4 * Math.sin(clamped * Math.PI) - 0.15 * clamped
    case 'ampulheta':
      // Estreita no meio, larga nas pontas
      return 0.65 - 0.42 * Math.sin(clamped * Math.PI)
    case 'taca':
      // Pé fino, taça larga no topo
      return clamped < 0.35
        ? 0.14 + clamped * 0.25
        : 0.22 + (clamped - 0.35) * 0.9
    default:
      return 0.5
  }
}

/** Altura total (unidades da cena) de qualquer objeto impresso. */
export const PRINT_OBJECT_HEIGHT = 2.2

/** Segmentos radiais do Lathe — baixo o bastante para custar pouco em mobile. */
export const PRINT_RADIAL_SEGMENTS = 32

/** Pontos de perfil (raio, altura) prontos para `THREE.LatheGeometry`. */
export function buildLatheProfile(shape: PrintShapeName, steps = 24): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const radius = Math.max(0.02, shapeRadiusAt(shape, t)) * 0.85
    points.push({ x: radius, y: t * PRINT_OBJECT_HEIGHT })
  }
  return points
}
