import { productSchema } from '@/lib/validations/product'

describe('productSchema', () => {
  const valid = {
    name: 'Suporte de Fone',
    slug: 'suporte-de-fone',
    description: 'Um suporte elegante para fone de ouvido',
    price: 29.9,
    category_id: null,
    print_time_minutes: 120,
    filament_grams: 45,
    is_available: true,
    is_featured: false,
    allows_custom_color: true,
    allows_custom_size: false,
  }

  it('aceita produto valido', () => {
    expect(() => productSchema.parse(valid)).not.toThrow()
  })

  it('rejeita nome vazio', () => {
    expect(() => productSchema.parse({ ...valid, name: '' })).toThrow()
  })

  it('rejeita preco negativo', () => {
    expect(() => productSchema.parse({ ...valid, price: -1 })).toThrow()
  })

  it('rejeita preco zero', () => {
    expect(() => productSchema.parse({ ...valid, price: 0 })).toThrow()
  })

  it('rejeita slug com espacos', () => {
    expect(() => productSchema.parse({ ...valid, slug: 'slug com espaco' })).toThrow()
  })

  it('aceita slug com hifens', () => {
    expect(() => productSchema.parse({ ...valid, slug: 'slug-com-hifens' })).not.toThrow()
  })

  it('aceita filament_grams nulo', () => {
    expect(() => productSchema.parse({ ...valid, filament_grams: null })).not.toThrow()
  })

  // makerworld_url
  it('aceita produto sem makerworld_url', () => {
    expect(() => productSchema.parse(valid)).not.toThrow()
  })

  it('aceita makerworld_url como string vazia', () => {
    expect(() => productSchema.parse({ ...valid, makerworld_url: '' })).not.toThrow()
  })

  it('aceita makerworld_url como null', () => {
    expect(() => productSchema.parse({ ...valid, makerworld_url: null })).not.toThrow()
  })

  it('aceita makerworld_url com URL valida do MakerWorld', () => {
    expect(() =>
      productSchema.parse({
        ...valid,
        makerworld_url: 'https://makerworld.com/en/models/123456',
      })
    ).not.toThrow()
  })

  it('rejeita makerworld_url com texto que nao e URL', () => {
    expect(() =>
      productSchema.parse({ ...valid, makerworld_url: 'nao-e-uma-url' })
    ).toThrow()
  })
})
