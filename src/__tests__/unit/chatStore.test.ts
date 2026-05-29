import { act, renderHook } from '@testing-library/react'
import { useChatStore } from '@/lib/store/chatStore'

beforeEach(() => {
  act(() => useChatStore.getState().reset())
})

describe('chatStore — mensagens', () => {
  it('começa com messages vazio e isTyping false', () => {
    const { result } = renderHook(() => useChatStore())
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.isTyping).toBe(false)
  })

  it('addUserMessage adiciona mensagem do user', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.addUserMessage('Oi'))
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].from).toBe('user')
    expect(result.current.messages[0].text).toBe('Oi')
  })

  it('addNozzleMessage adiciona mensagem do nozzle', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.addNozzleMessage('Olá!', 'root', []))
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].from).toBe('nozzle')
    expect(result.current.messages[0].text).toBe('Olá!')
  })

  it('addNozzleMessage persiste categorySlug, showProducts e subFilter', () => {
    const { result } = renderHook(() => useChatStore())
    act(() =>
      result.current.addNozzleMessage(
        'Produtos:',
        'catalog-cat-games',
        [],
        'games',
        true,
        'featured',
      )
    )
    const msg = result.current.messages[0]
    expect(msg.categorySlug).toBe('games')
    expect(msg.showProducts).toBe(true)
    expect(msg.subFilter).toBe('featured')
  })

  it('addNozzleMessage atualiza currentNodeId', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.addNozzleMessage('Msg', 'faq-menu', []))
    expect(result.current.currentNodeId).toBe('faq-menu')
  })

  it('mensagens tem timestamp e id únicos', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => {
      result.current.addUserMessage('A')
      result.current.addUserMessage('B')
    })
    const ids = result.current.messages.map((m) => m.id)
    expect(new Set(ids).size).toBe(2)
    result.current.messages.forEach((m) => expect(m.timestamp).toBeGreaterThan(0))
  })
})

describe('chatStore — typing', () => {
  it('setTyping(true) define isTyping como true', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.setTyping(true))
    expect(result.current.isTyping).toBe(true)
  })

  it('setTyping(false) define isTyping como false', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => {
      result.current.setTyping(true)
      result.current.setTyping(false)
    })
    expect(result.current.isTyping).toBe(false)
  })
})

describe('chatStore — drawer', () => {
  it('openChat abre o drawer', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.openChat())
    expect(result.current.isDrawerOpen).toBe(true)
  })

  it('closeChat fecha o drawer', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => {
      result.current.openChat()
      result.current.closeChat()
    })
    expect(result.current.isDrawerOpen).toBe(false)
  })

  it('toggleChat alterna o estado do drawer', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.toggleChat())
    expect(result.current.isDrawerOpen).toBe(true)
    act(() => result.current.toggleChat())
    expect(result.current.isDrawerOpen).toBe(false)
  })
})

describe('chatStore — reset', () => {
  it('reset limpa messages, currentNodeId e isTyping', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => {
      result.current.addUserMessage('teste')
      result.current.setTyping(true)
      result.current.reset()
    })
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.currentNodeId).toBe('root')
    expect(result.current.isTyping).toBe(false)
  })
})
