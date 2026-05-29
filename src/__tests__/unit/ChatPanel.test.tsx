import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { ChatPanel } from '@/components/chatbot/ChatPanel'
import { useChatStore } from '@/lib/store/chatStore'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, onClick, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className}>{children}</button>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => true,
}))

jest.mock('@/components/ui/FilamentBackdrop', () => ({
  FilamentBackdrop: () => <div data-testid="filament-backdrop" />,
}))

jest.mock('@/components/chatbot/ProductPreviewList', () => ({
  ProductPreviewList: ({ categorySlug }: { categorySlug: string }) => (
    <div data-testid={`product-list-${categorySlug}`} />
  ),
}))

beforeEach(() => {
  act(() => useChatStore.getState().reset())
})

describe('ChatPanel — boot', () => {
  it('exibe a mensagem inicial do Nozzle ao montar', () => {
    render(<ChatPanel />)
    // Nozzle aparece tanto no header quanto na mensagem de saudação
    expect(screen.getAllByText(/Nozzle/).length).toBeGreaterThanOrEqual(1)
  })

  it('exibe o nome "Nozzle" no header', () => {
    render(<ChatPanel />)
    const headers = screen.getAllByText('Nozzle')
    expect(headers.length).toBeGreaterThan(0)
  })

  it('exibe o FilamentBackdrop no header', () => {
    render(<ChatPanel />)
    expect(screen.getByTestId('filament-backdrop')).toBeInTheDocument()
  })
})

describe('ChatPanel — interacao com opcoes', () => {
  it('clicar em uma opcao adiciona mensagem do usuario', async () => {
    render(<ChatPanel />)
    const btn = await screen.findByText(/Explorar catálogo/i)
    fireEvent.click(btn)
    await waitFor(() => {
      const userMsg = screen.getByText(/Explorar catálogo/i)
      expect(userMsg).toBeInTheDocument()
    })
  })

  it('apos clicar opcao, isTyping fica true e depois false', async () => {
    render(<ChatPanel />)
    const btn = await screen.findByText(/Explorar catálogo/i)
    fireEvent.click(btn)
    // isTyping=true imediatamente
    expect(useChatStore.getState().isTyping).toBe(true)
    // after 350ms typing resolves
    await waitFor(() => {
      expect(useChatStore.getState().isTyping).toBe(false)
    }, { timeout: 1000 })
  })
})

describe('ChatPanel — reset', () => {
  it('botao de reiniciar limpa mensagens e reinicia conversa', async () => {
    render(<ChatPanel />)
    const resetBtn = screen.getByLabelText('Reiniciar conversa')
    act(() => fireEvent.click(resetBtn))
    await waitFor(() => {
      // After reset, only the root greeting should be in messages
      expect(useChatStore.getState().messages).toHaveLength(1)
      expect(useChatStore.getState().messages[0].from).toBe('nozzle')
    })
  })
})

describe('ChatPanel — product-list rendering', () => {
  it('renderiza ProductPreviewList quando mensagem tem showProducts=true', async () => {
    act(() => {
      useChatStore.getState().addNozzleMessage(
        'Produtos de decoração:',
        'catalog-cat-decoracao',
        [],
        'decoracao',
        true,
        undefined,
      )
    })
    render(<ChatPanel />)
    await waitFor(() => {
      expect(screen.getByTestId('product-list-decoracao')).toBeInTheDocument()
    })
  })

  it('nao renderiza ProductPreviewList quando showProducts e false', () => {
    act(() => {
      useChatStore.getState().addNozzleMessage('Olá!', 'root', [])
    })
    render(<ChatPanel />)
    expect(screen.queryByTestId(/product-list/)).not.toBeInTheDocument()
  })
})
