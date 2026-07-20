import { easeInOutCubic } from '@/components/ui/hero3d/usePrintLoop'

describe('hero3d/usePrintLoop — easeInOutCubic', () => {
  it('retorna 0 em t=0 e 1 em t=1', () => {
    expect(easeInOutCubic(0)).toBeCloseTo(0)
    expect(easeInOutCubic(1)).toBeCloseTo(1)
  })

  it('é monotonicamente crescente entre 0 e 1', () => {
    let prev = -Infinity
    for (let t = 0; t <= 1; t += 0.05) {
      const value = easeInOutCubic(t)
      expect(value).toBeGreaterThanOrEqual(prev)
      prev = value
    }
  })

  it('faz clamp de valores fora do range 0-1', () => {
    expect(easeInOutCubic(-1)).toBe(easeInOutCubic(0))
    expect(easeInOutCubic(2)).toBe(easeInOutCubic(1))
  })

  it('acelera perto do meio (ease-in-out) — mais rápido no meio do que nas pontas', () => {
    const early = easeInOutCubic(0.1) - easeInOutCubic(0)
    const middle = easeInOutCubic(0.55) - easeInOutCubic(0.45)
    expect(middle).toBeGreaterThan(early)
  })
})
