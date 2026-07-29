import { organizationSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo/schema'

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
    expect(schema.name).toBe('Kadu Freitas Tattoo')
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

describe('breadcrumbSchema', () => {
  const items = [
    { name: 'Início', url: 'http://localhost:3000' },
    { name: 'Portfólio', url: 'http://localhost:3000/portfolio' },
    { name: 'Blackwork', url: 'http://localhost:3000/portfolio?estilo=blackwork' },
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
    expect(schema.itemListElement[2].name).toBe('Blackwork')
  })
})

describe('faqPageSchema', () => {
  interface FAQItem {
    question: string
    answer: string
  }

  const mockFAQItems: FAQItem[] = [
    {
      question: 'Quanto tempo leva para uma tatuagem cicatrizar?',
      answer: 'A cicatrização varia de 2 a 4 semanas, dependendo do tamanho e complexidade. Siga os cuidados pós-tatuagem durante todo este período.',
    },
    {
      question: 'Posso tomar banho após fazer uma tatuagem?',
      answer: 'Sim, mas com cuidado. Evite água muito quente nos primeiros 2-3 dias e não deixe a tatuagem submersa em piscinas ou mar.',
    },
  ]

  it('tem @context e @type corretos', () => {
    const { faqPageSchema } = require('@/lib/seo/schema')
    const schema = faqPageSchema(mockFAQItems)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('FAQPage')
  })

  it('tem mainEntity como array com as perguntas', () => {
    const { faqPageSchema } = require('@/lib/seo/schema')
    const schema = faqPageSchema(mockFAQItems)
    expect(Array.isArray(schema.mainEntity)).toBe(true)
    expect(schema.mainEntity).toHaveLength(2)
  })

  it('cada mainEntity é uma Question com acceptedAnswer corretos', () => {
    const { faqPageSchema } = require('@/lib/seo/schema')
    const schema = faqPageSchema(mockFAQItems)

    const firstQuestion = schema.mainEntity[0]
    expect(firstQuestion['@type']).toBe('Question')
    expect(firstQuestion.name).toBe('Quanto tempo leva para uma tatuagem cicatrizar?')
    expect(firstQuestion.acceptedAnswer['@type']).toBe('Answer')
    expect(firstQuestion.acceptedAnswer.text).toBe(
      'A cicatrização varia de 2 a 4 semanas, dependendo do tamanho e complexidade. Siga os cuidados pós-tatuagem durante todo este período.'
    )
  })

  it('preserva a ordem das perguntas', () => {
    const { faqPageSchema } = require('@/lib/seo/schema')
    const schema = faqPageSchema(mockFAQItems)
    expect(schema.mainEntity[0].name).toBe('Quanto tempo leva para uma tatuagem cicatrizar?')
    expect(schema.mainEntity[1].name).toBe('Posso tomar banho após fazer uma tatuagem?')
  })
})
