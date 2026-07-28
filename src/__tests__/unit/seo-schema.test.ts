import { organizationSchema, productSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo/schema'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: '1',
  category_id: null,
  name: 'Suporte de Mesa',
  slug: 'suporte-de-mesa',
  description: 'Descrição do produto',
  price: 49.9,
  is_available: true,
  is_featured: false,
  allows_custom_size: false,
  allows_custom_color: false,
  print_time_minutes: null,
  filament_grams: null,
  makerworld_url: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  images: [
    { id: '1', url: 'https://example.com/img.png', alt: null, is_primary: true, sort_order: 0 },
  ],
}

describe('getSiteUrl', () => {
  it('retorna localhost como fallback quando NEXT_PUBLIC_SITE_URL não está definida', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })

  it('retorna a URL da env quando definida', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://imagination3-d.vercel.app'
    expect(getSiteUrl()).toBe('https://imagination3-d.vercel.app')
    delete process.env.NEXT_PUBLIC_SITE_URL
  })
})

describe('organizationSchema', () => {
  it('tem @context e @type corretos', () => {
    const schema = organizationSchema()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Organization')
  })

  it('tem nome e url corretos', () => {
    const schema = organizationSchema()
    expect(schema.name).toBe('Imagination 3D')
    expect(schema.url).toBe(getSiteUrl())
  })

  it('tem logo apontando para /logo.png no site base', () => {
    const schema = organizationSchema()
    expect(schema.logo).toBe(`${getSiteUrl()}/logo.png`)
  })

  it('tem contactPoint com telefone', () => {
    const schema = organizationSchema()
    expect(schema.contactPoint['@type']).toBe('ContactPoint')
    expect(schema.contactPoint.telephone).toBe('+55-11-98952-5014')
  })
})

describe('productSchema', () => {
  it('tem @type Product', () => {
    const schema = productSchema(mockProduct)
    expect(schema['@type']).toBe('Product')
  })

  it('tem nome e url do produto', () => {
    const schema = productSchema(mockProduct)
    expect(schema.name).toBe('Suporte de Mesa')
    expect(schema.url).toContain('/product/suporte-de-mesa')
  })

  it('inclui Offer com preço, moeda e url', () => {
    const schema = productSchema(mockProduct)
    expect(schema.offers['@type']).toBe('Offer')
    expect(schema.offers.price).toBe(49.9)
    expect(schema.offers.priceCurrency).toBe('BRL')
    expect(schema.offers.url).toContain('/product/suporte-de-mesa')
  })

  it('availability InStock quando is_available = true', () => {
    const schema = productSchema(mockProduct)
    expect(schema.offers.availability).toBe('https://schema.org/InStock')
  })

  it('availability OutOfStock quando is_available = false', () => {
    const schema = productSchema({ ...mockProduct, is_available: false })
    expect(schema.offers.availability).toBe('https://schema.org/OutOfStock')
  })

  it('usa imagem primária', () => {
    const schema = productSchema(mockProduct)
    expect(schema.image).toBe('https://example.com/img.png')
  })

  it('retorna image undefined quando produto não tem imagens', () => {
    const schema = productSchema({ ...mockProduct, images: [] })
    expect(schema.image).toBeUndefined()
  })

  it('fallback para primeira imagem por sort_order quando nenhuma é primary', () => {
    const schema = productSchema({
      ...mockProduct,
      images: [
        { id: '2', url: 'https://example.com/b.png', alt: null, is_primary: false, sort_order: 2 },
        { id: '1', url: 'https://example.com/a.png', alt: null, is_primary: false, sort_order: 1 },
      ],
    })
    expect(schema.image).toBe('https://example.com/a.png')
  })
})

describe('breadcrumbSchema', () => {
  const items = [
    { name: 'Início', url: 'http://localhost:3000' },
    { name: 'Catálogo', url: 'http://localhost:3000/catalog' },
    { name: 'Suporte de Mesa', url: 'http://localhost:3000/product/suporte-de-mesa' },
  ]

  it('tem @type BreadcrumbList', () => {
    const schema = breadcrumbSchema(items)
    expect(schema['@type']).toBe('BreadcrumbList')
  })

  it('tem o número correto de itens', () => {
    const schema = breadcrumbSchema(items)
    expect(schema.itemListElement).toHaveLength(3)
  })

  it('position começa em 1 e incrementa', () => {
    const schema = breadcrumbSchema(items)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[1].position).toBe(2)
    expect(schema.itemListElement[2].position).toBe(3)
  })

  it('nome e url de cada item estão corretos', () => {
    const schema = breadcrumbSchema(items)
    expect(schema.itemListElement[0].name).toBe('Início')
    expect(schema.itemListElement[0].item).toBe('http://localhost:3000')
    expect(schema.itemListElement[2].name).toBe('Suporte de Mesa')
  })
})
