/**
 * Rate limiting leve em memória por chave (ex.: IP).
 *
 * Estratégia: janela fixa (fixed window) — simples, eficiente, adequada
 * para um app de pequeno porte. Não é perfeito contra rajadas na virada da
 * janela, mas é muito melhor que nenhum controle.
 *
 * ATENÇÃO: a store reside na memória do processo. Em deploy com múltiplos
 * workers (ex.: Vercel Edge com várias instâncias) cada worker tem sua
 * própria contagem. Para um app de baixo tráfego isso é suficiente.
 */

export interface RateLimitEntry {
  count: number
  resetAt: number // timestamp ms
}

export interface RateLimitResult {
  limited: boolean
  retryAfter?: number // segundos restantes até reset
}

// Store padrão do módulo (singleton por processo)
const _defaultStore = new Map<string, RateLimitEntry>()

/**
 * Verifica (e incrementa) o contador de uma chave na janela atual.
 *
 * @param key      Identificador único (ex.: `'ip:1.2.3.4'`)
 * @param limit    Máximo de requisições permitidas na janela
 * @param windowMs Duração da janela em milissegundos
 * @param store    Store injetável para testes (padrão: store global do módulo)
 * @param now      Timestamp atual em ms (padrão: Date.now())
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  store: Map<string, RateLimitEntry> = _defaultStore,
  now: number = Date.now(),
): RateLimitResult {
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    // Primeira requisição ou janela expirada — abre uma nova janela
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false }
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { limited: true, retryAfter }
  }

  entry.count++
  return { limited: false }
}

/**
 * Extrai o IP do cliente a partir dos headers HTTP.
 * Compatível com Vercel (X-Forwarded-For) e proxies reversos genéricos.
 *
 * Aceita qualquer objeto com método .get() (Headers, NextHeaders, mock em testes).
 */
export function extractIp(headers: Pick<Headers, 'get'>): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}
