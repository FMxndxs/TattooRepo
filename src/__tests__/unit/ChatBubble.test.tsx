import { render, screen } from '@testing-library/react'
import { ChatBubble } from '@/components/chatbot/ChatBubble'
import type { ChatMessage } from '@/lib/chatbot/types'

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => true,
}))

const nozzleMsg: ChatMessage = {
  id: 'n1',
  from: 'nozzle',
  text: 'Olá! Eu sou o Nozzle.',
  timestamp: new Date('2025-01-01T14:32:00').getTime(),
  nodeId: 'root',
}

const userMsg: ChatMessage = {
  id: 'u1',
  from: 'user',
  text: 'Quero ver o catálogo',
  timestamp: new Date('2025-01-01T14:33:00').getTime(),
}

describe('ChatBubble', () => {
  it('renderiza o texto da mensagem do nozzle', () => {
    render(<ChatBubble message={nozzleMsg} />)
    expect(screen.getByText('Olá! Eu sou o Nozzle.')).toBeInTheDocument()
  })

  it('renderiza o texto da mensagem do user', () => {
    render(<ChatBubble message={userMsg} />)
    expect(screen.getByText('Quero ver o catálogo')).toBeInTheDocument()
  })

  it('mensagem do nozzle exibe o NozzleAvatar (img)', () => {
    const { container } = render(<ChatBubble message={nozzleMsg} />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
  })

  it('mensagem do user nao exibe avatar', () => {
    const { container } = render(<ChatBubble message={userMsg} />)
    const img = container.querySelector('img')
    expect(img).not.toBeInTheDocument()
  })

  it('renderiza children (ex: ProductPreviewList) dentro da bubble do nozzle', () => {
    render(
      <ChatBubble message={nozzleMsg}>
        <div data-testid="preview-list">produtos aqui</div>
      </ChatBubble>
    )
    expect(screen.getByTestId('preview-list')).toBeInTheDocument()
  })

  it('exibe o timestamp formatado', () => {
    render(<ChatBubble message={nozzleMsg} />)
    // pt-BR HH:MM — "14:32"
    expect(screen.getByText(/14:32/)).toBeInTheDocument()
  })
})
