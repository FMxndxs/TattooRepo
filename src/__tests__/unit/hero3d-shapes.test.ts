import { shapeRadiusAt, buildLatheProfile, PRINT_SHAPES, PRINT_OBJECT_HEIGHT } from '@/components/ui/hero3d/shapes'

describe('hero3d/shapes', () => {
  it('define 3 formas para ciclar no time-lapse', () => {
    expect(PRINT_SHAPES).toHaveLength(3)
  })

  it('shapeRadiusAt sempre retorna um valor finito e não-negativo dentro do range 0-1', () => {
    for (const shape of PRINT_SHAPES) {
      for (let t = 0; t <= 1; t += 0.1) {
        const radius = shapeRadiusAt(shape, t)
        expect(Number.isFinite(radius)).toBe(true)
      }
    }
  })

  it('faz clamp de valores de t fora do range 0-1', () => {
    for (const shape of PRINT_SHAPES) {
      expect(shapeRadiusAt(shape, -1)).toBe(shapeRadiusAt(shape, 0))
      expect(shapeRadiusAt(shape, 2)).toBe(shapeRadiusAt(shape, 1))
    }
  })

  it('buildLatheProfile gera pontos com altura crescente até PRINT_OBJECT_HEIGHT', () => {
    const profile = buildLatheProfile('vaso', 10)
    expect(profile).toHaveLength(11)
    expect(profile[0].y).toBe(0)
    expect(profile[profile.length - 1].y).toBeCloseTo(PRINT_OBJECT_HEIGHT)
    // raio nunca deve ser zero ou negativo (Lathe geometry exige > 0)
    profile.forEach((p) => expect(p.x).toBeGreaterThan(0))
  })
})
