import { customOrderSchema } from '@/lib/validations/customOrder'

describe('customOrderSchema', () => {
  const valid = {
    name: 'Felipe Mendes',
    phone: '11989525014',
    description: 'Quero imprimir um suporte de parede para roteador',
    reference_url: null,
    color_name: 'Preto',
  }

  it('aceita dados validos', () => {
    expect(() => customOrderSchema.parse(valid)).not.toThrow()
  })

  it('rejeita nome vazio', () => {
    expect(() => customOrderSchema.parse({ ...valid, name: '' })).toThrow()
  })

  it('rejeita descricao com menos de 20 caracteres', () => {
    expect(() => customOrderSchema.parse({ ...valid, description: 'curto demais' })).toThrow()
  })

  it('rejeita telefone com menos de 10 digitos', () => {
    expect(() => customOrderSchema.parse({ ...valid, phone: '123' })).toThrow()
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
})
