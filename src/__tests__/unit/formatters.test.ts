import { formatBRL, formatPhone, slugify } from '@/lib/utils/formatters'

describe('formatBRL', () => {
  it('formata valor em reais corretamente', () => {
    expect(formatBRL(49.9)).toBe('R$ 49,90')
  })

  it('formata zero', () => {
    expect(formatBRL(0)).toBe('R$ 0,00')
  })

  it('formata valores grandes', () => {
    expect(formatBRL(1000)).toBe('R$ 1.000,00')
  })
})

describe('formatPhone', () => {
  it('formata celular com 11 digitos', () => {
    expect(formatPhone('11989525014')).toBe('(11) 98952-5014')
  })

  it('formata telefone fixo com 10 digitos', () => {
    expect(formatPhone('1132341234')).toBe('(11) 3234-1234')
  })

  it('retorna original se nao reconhecer o formato', () => {
    expect(formatPhone('123')).toBe('123')
  })

  it('aceita numero ja formatado', () => {
    expect(formatPhone('(11) 98952-5014')).toBe('(11) 98952-5014')
  })
})

describe('slugify', () => {
  it('converte texto para slug', () => {
    expect(slugify('Suporte de Fone')).toBe('suporte-de-fone')
  })

  it('remove acentos', () => {
    expect(slugify('Decoração')).toBe('decoracao')
  })

  it('remove caracteres especiais', () => {
    expect(slugify('Porta-Treco & Utilidades!')).toBe('porta-treco-utilidades')
  })
})
