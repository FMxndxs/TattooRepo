/**
 * Testes unitários para a lógica do endpoint GET /api/reports.
 *
 * Testamos as funções exportadas de src/lib/reports/auth.ts —
 * módulo isolado de next/server, seguindo o padrão dos testes do projeto
 * (funções puras / lógica de negócio, não a rota em si).
 */

import { checkApiKey, REPORT_DATASETS } from '@/lib/reports/auth'

// ─── checkApiKey ──────────────────────────────────────────────────────────────

describe('checkApiKey', () => {
  const VALID = 'test-key-abcdef1234567890'

  it('retorna true quando candidate === envKey', () => {
    expect(checkApiKey(VALID, VALID)).toBe(true)
  })

  it('retorna false quando candidate está errado', () => {
    expect(checkApiKey('wrong-key-xxxxxxxxxxxx', VALID)).toBe(false)
  })

  it('retorna false quando candidate está vazio', () => {
    expect(checkApiKey('', VALID)).toBe(false)
  })

  it('retorna false quando envKey está vazio', () => {
    expect(checkApiKey(VALID, '')).toBe(false)
  })

  it('retorna false quando comprimentos diferem (timing-safe guard)', () => {
    expect(checkApiKey(VALID.slice(0, 10), VALID)).toBe(false)
  })

  it('retorna false quando ambos são vazios', () => {
    expect(checkApiKey('', '')).toBe(false)
  })

  it('é sensível a maiúsculas/minúsculas', () => {
    expect(checkApiKey(VALID.toUpperCase(), VALID)).toBe(false)
  })
})

// ─── REPORT_DATASETS ──────────────────────────────────────────────────────────

describe('REPORT_DATASETS', () => {
  it('contém os 4 datasets esperados', () => {
    expect(REPORT_DATASETS).toContain('revenue_daily')
    expect(REPORT_DATASETS).toContain('top_products')
    expect(REPORT_DATASETS).toContain('lead_times')
    expect(REPORT_DATASETS).toContain('peak_hours')
    expect(REPORT_DATASETS).toHaveLength(4)
  })
})
