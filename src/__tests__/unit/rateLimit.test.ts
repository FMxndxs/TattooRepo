import { checkRateLimit, extractIp } from '@/lib/security/rateLimit'
import type { RateLimitEntry } from '@/lib/security/rateLimit'

// ─── checkRateLimit ───────────────────────────────────────────────────────────

describe('checkRateLimit', () => {
  function newStore() {
    return new Map<string, RateLimitEntry>()
  }

  it('permite a primeira requisição', () => {
    const result = checkRateLimit('ip:1.2.3.4', 5, 60_000, newStore(), 1000)
    expect(result.limited).toBe(false)
  })

  it('permite requisições até o limite (inclusive)', () => {
    const store = newStore()
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('ip:x', 5, 60_000, store, 1000).limited).toBe(false)
    }
  })

  it('bloqueia a (N+1)ª requisição', () => {
    const store = newStore()
    for (let i = 0; i < 5; i++) checkRateLimit('ip:x', 5, 60_000, store, 1000)
    const result = checkRateLimit('ip:x', 5, 60_000, store, 1000)
    expect(result.limited).toBe(true)
  })

  it('retryAfter é positivo quando bloqueado', () => {
    const store = newStore()
    for (let i = 0; i < 3; i++) checkRateLimit('ip:x', 3, 60_000, store, 1000)
    const result = checkRateLimit('ip:x', 3, 60_000, store, 1000)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('reseta após a janela expirar', () => {
    const store = newStore()
    const windowMs = 60_000
    const t0 = 1000
    // Esgota o limite
    for (let i = 0; i < 3; i++) checkRateLimit('ip:x', 3, windowMs, store, t0)
    expect(checkRateLimit('ip:x', 3, windowMs, store, t0).limited).toBe(true)

    // Avança o tempo além da janela
    const tAfter = t0 + windowMs + 1
    const result = checkRateLimit('ip:x', 3, windowMs, store, tAfter)
    expect(result.limited).toBe(false)
  })

  it('rastreia chaves diferentes de forma independente', () => {
    const store = newStore()
    const now = 1000
    for (let i = 0; i < 3; i++) checkRateLimit('ip:a', 3, 60_000, store, now)
    expect(checkRateLimit('ip:a', 3, 60_000, store, now).limited).toBe(true)
    expect(checkRateLimit('ip:b', 3, 60_000, store, now).limited).toBe(false)
  })

  it('janela com windowMs=0 expira imediatamente', () => {
    const store = newStore()
    checkRateLimit('ip:x', 1, 0, store, 1000)
    // Na próxima chamada (mesmo timestamp) o reset é t0+0 = t0, então now >= resetAt
    const result = checkRateLimit('ip:x', 1, 0, store, 1000)
    expect(result.limited).toBe(false)
  })
})

// ─── extractIp ───────────────────────────────────────────────────────────────

describe('extractIp', () => {
  function makeHeaders(entries: Record<string, string>): Pick<Headers, 'get'> {
    return { get: (key: string) => entries[key.toLowerCase()] ?? null }
  }

  it('extrai o primeiro IP do X-Forwarded-For', () => {
    const headers = makeHeaders({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(extractIp(headers)).toBe('1.2.3.4')
  })

  it('faz trim em espaços do X-Forwarded-For', () => {
    const headers = makeHeaders({ 'x-forwarded-for': '  9.0.0.1  , 10.0.0.1' })
    expect(extractIp(headers)).toBe('9.0.0.1')
  })

  it('cai para x-real-ip quando X-Forwarded-For está ausente', () => {
    const headers = makeHeaders({ 'x-real-ip': '203.0.113.5' })
    expect(extractIp(headers)).toBe('203.0.113.5')
  })

  it('retorna "unknown" quando nenhum header de IP existe', () => {
    const headers = makeHeaders({})
    expect(extractIp(headers)).toBe('unknown')
  })

  it('prefere X-Forwarded-For sobre x-real-ip', () => {
    const headers = makeHeaders({
      'x-forwarded-for': '1.1.1.1',
      'x-real-ip': '2.2.2.2',
    })
    expect(extractIp(headers)).toBe('1.1.1.1')
  })
})
