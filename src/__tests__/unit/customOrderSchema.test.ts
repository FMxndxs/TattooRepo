import { customOrderSchema } from '@/lib/validations/customOrder'

describe('customOrderSchema', () => {
  const valid = {
    description: 'Quero imprimir um suporte de parede para roteador',
    reference_url: null,
    color_name: 'Preto',
  }

  it('aceita dados validos', () => {
    expect(() => customOrderSchema.parse(valid)).not.toThrow()
  })

  it('rejeita descricao com menos de 20 caracteres', () => {
    expect(() => customOrderSchema.parse({ ...valid, description: 'curto demais' })).toThrow()
  })

  it('aceita reference_url nulo', () => {
    expect(() => customOrderSchema.parse({ ...valid, reference_url: null })).not.toThrow()
  })

  it('aceita reference_url vazia (string vazia tratada como null)', () => {
    expect(() => customOrderSchema.parse({ ...valid, reference_url: '' })).not.toThrow()
  })

  it('rejeita reference_url invalida quando preenchida', () => {
    expect(() => customOrderSchema.parse({ ...valid, reference_url: 'nao-e-url' })).toThrow()
  })

  it('aceita reference_url valida', () => {
    expect(() => customOrderSchema.parse({ ...valid, reference_url: 'https://makerworld.com/model/123' })).not.toThrow()
  })

  it('rejeita color_name vazio', () => {
    expect(() => customOrderSchema.parse({ ...valid, color_name: '' })).toThrow()
  })
})
