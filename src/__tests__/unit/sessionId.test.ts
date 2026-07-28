import { getOrCreateSessionId } from '@/lib/analytics/sessionId'

const SESSION_KEY = 'kadu_tattoo_session_id'

describe('getOrCreateSessionId', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('gera um UUID e persiste no localStorage na primeira chamada', () => {
    const id = getOrCreateSessionId()
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
    expect(localStorage.getItem(SESSION_KEY)).toBe(id)
  })

  it('retorna o mesmo ID em chamadas subsequentes', () => {
    const first = getOrCreateSessionId()
    const second = getOrCreateSessionId()
    expect(first).toBe(second)
  })

  it('reutiliza ID existente no localStorage', () => {
    localStorage.setItem(SESSION_KEY, 'meu-id-existente')
    expect(getOrCreateSessionId()).toBe('meu-id-existente')
  })
})
