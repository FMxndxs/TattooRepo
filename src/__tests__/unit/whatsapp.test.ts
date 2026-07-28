import { buildCustomOrderMessage, buildCustomOrderUrl } from '@/lib/utils/whatsapp'

const mockPayload = {
  name: 'Joao Silva',
  phone: '(11) 98765-4321',
  description: 'Uma fênix em blackwork no antebraço',
  color_name: 'Blackwork',
  reference_url: 'https://example.com/ref.png',
  image_url: null,
}

describe('buildCustomOrderMessage', () => {
  it('inclui o nome e telefone do cliente', () => {
    const msg = buildCustomOrderMessage(mockPayload)
    expect(msg).toContain('Joao Silva')
    expect(msg).toContain('(11) 98765-4321')
  })

  it('inclui a descrição e o estilo desejado', () => {
    const msg = buildCustomOrderMessage(mockPayload)
    expect(msg).toContain('Uma fênix em blackwork no antebraço')
    expect(msg).toContain('Blackwork')
  })

  it('inclui a referência quando presente', () => {
    const msg = buildCustomOrderMessage(mockPayload)
    expect(msg).toContain('https://example.com/ref.png')
  })

  it('omite a linha de imagem quando image_url é null', () => {
    const msg = buildCustomOrderMessage(mockPayload)
    expect(msg).not.toContain('Imagem:')
  })
})

describe('buildCustomOrderUrl', () => {
  it('gera URL com wa.me e o número da loja', () => {
    const url = buildCustomOrderUrl(mockPayload)
    expect(url).toContain('wa.me/5511989525014')
  })

  it('URL está encoded (sem espaços)', () => {
    const url = buildCustomOrderUrl(mockPayload)
    expect(url).toContain('?text=')
    expect(url).not.toContain(' ')
  })
})
