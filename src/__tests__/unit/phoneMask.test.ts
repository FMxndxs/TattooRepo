import { formatPhoneBR } from '@/lib/utils/phoneMask'

describe('formatPhoneBR', () => {
  it('retorna string vazia para entrada vazia', () => {
    expect(formatPhoneBR('')).toBe('')
  })

  it('formata parcialmente durante digitacao', () => {
    expect(formatPhoneBR('1')).toBe('(1')
    expect(formatPhoneBR('11')).toBe('(11')
    expect(formatPhoneBR('119')).toBe('(11) 9')
    expect(formatPhoneBR('11987')).toBe('(11) 987')
    expect(formatPhoneBR('119876')).toBe('(11) 9876')
    expect(formatPhoneBR('1198765')).toBe('(11) 9876-5')
  })

  it('formata numero completo de celular (11 digitos)', () => {
    expect(formatPhoneBR('11987654321')).toBe('(11) 98765-4321')
  })

  it('formata numero fixo (10 digitos)', () => {
    expect(formatPhoneBR('1132125678')).toBe('(11) 3212-5678')
  })

  it('ignora caracteres nao numericos', () => {
    expect(formatPhoneBR('(11) 98765-4321')).toBe('(11) 98765-4321')
    expect(formatPhoneBR('11.987.654321')).toBe('(11) 98765-4321')
  })

  it('ignora digitos alem de 11', () => {
    expect(formatPhoneBR('119876543211234')).toBe('(11) 98765-4321')
  })
})
