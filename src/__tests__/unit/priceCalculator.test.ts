import { calculatePrice, formatPrintTime } from '@/lib/utils/priceCalculator'

describe('calculatePrice', () => {
  it('calcula preco baseado em filamento e tempo', () => {
    // 50g × R$0.15/g + 2h × R$5/h = R$7.50 + R$10 = R$17.50
    expect(calculatePrice({ filamentGrams: 50, printTimeMinutes: 120 })).toBeCloseTo(17.5)
  })

  it('retorna 0 se nao houver dados', () => {
    expect(calculatePrice({ filamentGrams: 0, printTimeMinutes: 0 })).toBe(0)
  })

  it('aplica margem de lucro', () => {
    const cost = calculatePrice({ filamentGrams: 50, printTimeMinutes: 120 })
    const withMargin = calculatePrice({ filamentGrams: 50, printTimeMinutes: 120, marginPercent: 100 })
    expect(withMargin).toBeCloseTo(cost * 2)
  })

  it('calcula apenas filamento se tempo for 0', () => {
    expect(calculatePrice({ filamentGrams: 100, printTimeMinutes: 0 })).toBeCloseTo(15)
  })
})

describe('formatPrintTime', () => {
  it('formata minutos em horas e minutos', () => {
    expect(formatPrintTime(90)).toBe('1h 30min')
  })

  it('formata menos de 1 hora', () => {
    expect(formatPrintTime(45)).toBe('45min')
  })

  it('formata horas exatas', () => {
    expect(formatPrintTime(120)).toBe('2h')
  })
})
