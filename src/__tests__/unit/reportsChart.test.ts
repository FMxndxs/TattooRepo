import { niceMax, scaleY, scaleX, buildLinePath, buildAreaPath } from '@/lib/reports/chart'

describe('niceMax', () => {
  it('retorna 100 para lista vazia', () => {
    expect(niceMax([])).toBe(100)
  })

  it('retorna 100 quando max é 0 ou negativo', () => {
    expect(niceMax([0])).toBe(100)
    expect(niceMax([-5, -2])).toBe(100)
  })

  it('arredonda para cima: 1180 → 1200', () => {
    expect(niceMax([1180])).toBeGreaterThanOrEqual(1180)
    expect(niceMax([1180]) % 100).toBe(0)
  })

  it('arredonda para cima: 95 → 100', () => {
    expect(niceMax([95])).toBe(100)
  })

  it('valor exato já redondo permanece', () => {
    expect(niceMax([500])).toBe(500)
  })

  it('usa o maior valor do array', () => {
    expect(niceMax([10, 300, 50])).toBeGreaterThanOrEqual(300)
  })
})

describe('scaleY', () => {
  it('valor máximo mapeia para padTop', () => {
    expect(scaleY(100, 100, 200, 10, 10)).toBeCloseTo(10)
  })

  it('valor zero mapeia para height - padBottom', () => {
    expect(scaleY(0, 100, 200, 10, 10)).toBeCloseTo(190)
  })

  it('valor 50% mapeia para o meio do drawH', () => {
    expect(scaleY(50, 100, 200, 10, 10)).toBeCloseTo(100)
  })
})

describe('scaleX', () => {
  it('índice 0 mapeia para padLeft', () => {
    expect(scaleX(0, 5, 400, 20, 20)).toBeCloseTo(20)
  })

  it('último índice mapeia para width - padRight', () => {
    expect(scaleX(4, 5, 400, 20, 20)).toBeCloseTo(380)
  })

  it('total = 1 retorna padLeft', () => {
    expect(scaleX(0, 1, 400, 20, 20)).toBe(20)
  })
})

describe('buildLinePath', () => {
  it('retorna string vazia para 0 pontos', () => {
    expect(buildLinePath([], 400, 200)).toBe('')
  })

  it('retorna string vazia para 1 ponto', () => {
    expect(buildLinePath([100], 400, 200)).toBe('')
  })

  it('começa com M para 2+ pontos', () => {
    const path = buildLinePath([100, 200], 400, 200)
    expect(path).toMatch(/^M/)
  })

  it('contém L para pontos intermediários', () => {
    const path = buildLinePath([100, 150, 200], 400, 200)
    expect(path).toContain('L')
  })

  it('gera N-1 segmentos L para N pontos', () => {
    const values = [10, 20, 30, 40, 50]
    const path = buildLinePath(values, 400, 200)
    const lCount = (path.match(/L/g) ?? []).length
    expect(lCount).toBe(values.length - 1)
  })
})

describe('buildAreaPath', () => {
  it('retorna string vazia para 0 ou 1 pontos', () => {
    expect(buildAreaPath([], 400, 200)).toBe('')
    expect(buildAreaPath([100], 400, 200)).toBe('')
  })

  it('termina com Z (path fechado)', () => {
    const path = buildAreaPath([100, 200], 400, 200)
    expect(path.trim().endsWith('Z')).toBe(true)
  })

  it('contém a linha base (2 pontos extras L antes do Z)', () => {
    const path = buildAreaPath([100, 200], 400, 200)
    const lCount = (path.match(/L/g) ?? []).length
    // 1 segmento de linha + 2 para fechar a área
    expect(lCount).toBeGreaterThanOrEqual(3)
  })
})
