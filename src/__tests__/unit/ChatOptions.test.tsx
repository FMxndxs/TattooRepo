import { render, screen, fireEvent } from '@testing-library/react'
import { ChatOptions } from '@/components/chatbot/ChatOptions'
import type { ChatOption } from '@/lib/chatbot/types'

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => true,
}))

const options: ChatOption[] = [
  { label: '🛍️ Explorar catálogo', nextNodeId: 'catalog-menu' },
  { label: '❓ Tirar dúvidas', nextNodeId: 'faq-menu' },
  { label: '💬 WhatsApp', nextNodeId: 'whatsapp-contact' },
]

describe('ChatOptions', () => {
  it('renderiza todos os botoes de opcao', () => {
    render(<ChatOptions options={options} onSelect={jest.fn()} />)
    expect(screen.getByText('🛍️ Explorar catálogo')).toBeInTheDocument()
    expect(screen.getByText('❓ Tirar dúvidas')).toBeInTheDocument()
    expect(screen.getByText('💬 WhatsApp')).toBeInTheDocument()
  })

  it('chama onSelect com a opcao correta ao clicar', () => {
    const onSelect = jest.fn()
    render(<ChatOptions options={options} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('🛍️ Explorar catálogo'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(options[0])
  })

  it('renderiza botoes com rounded-full (pill style)', () => {
    const { container } = render(<ChatOptions options={options} onSelect={jest.fn()} />)
    const buttons = container.querySelectorAll('button')
    buttons.forEach((btn) => {
      expect(btn.className).toMatch(/rounded-full/)
    })
  })

  it('nao renderiza nada quando options esta vazio', () => {
    const { container } = render(<ChatOptions options={[]} onSelect={jest.fn()} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(0)
  })
})
