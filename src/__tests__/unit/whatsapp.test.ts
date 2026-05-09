import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import type { WhatsAppOrderPayload, Product, Color } from '@/types'

const mockProduct: Product = {
  id: '1',
  category_id: null,
  name: 'Suporte de Fone',
  slug: 'suporte-de-fone',
  description: null,
  print_time_minutes: 120,
  filament_grams: 45,
  price: 29.9,
  is_available: true,
  is_featured: false,
  allows_custom_size: false,
  allows_custom_color: true,
  makerworld_url: null,
  created_at: '',
  updated_at: '',
}

const mockColor: Color = {
  id: 'c1',
  name: 'Preto',
  hex_code: '#1a1a1a',
  is_available: true,
}

const mockPayload: WhatsAppOrderPayload = {
  customer: {
    name: 'Joao Silva',
    phone: '(11) 98765-4321',
    neighborhood: 'Vila Madalena',
    city: 'SP',
  },
  items: [
    {
      product: mockProduct,
      quantity: 2,
      selected_color: mockColor,
      selected_size: null,
      unit_price: 29.9,
    },
  ],
  total: 59.8,
}

describe('buildWhatsAppMessage', () => {
  it('inclui o nome do cliente', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('Joao Silva')
  })

  it('inclui o bairro', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('Vila Madalena')
  })

  it('inclui o nome do produto', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('Suporte de Fone')
  })

  it('inclui a cor selecionada', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('Preto')
  })

  it('inclui o total formatado', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('R$ 59,80')
  })

  it('inclui a quantidade', () => {
    const msg = buildWhatsAppMessage(mockPayload)
    expect(msg).toContain('x2')
  })
})

describe('buildWhatsAppUrl', () => {
  it('gera URL com wa.me', () => {
    const url = buildWhatsAppUrl(mockPayload)
    expect(url).toContain('wa.me/')
  })

  it('inclui o numero do WhatsApp', () => {
    const url = buildWhatsAppUrl(mockPayload)
    expect(url).toContain('5511989525014')
  })

  it('URL esta encoded corretamente', () => {
    const url = buildWhatsAppUrl(mockPayload)
    expect(url).toContain('?text=')
    expect(url).not.toContain(' ')
  })
})
