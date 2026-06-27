/**
 * Lógica de autenticação por API key para o endpoint /api/reports.
 * Módulo isolado de next/server para permitir testes unitários simples.
 */
import { timingSafeEqual } from 'crypto'

export const REPORT_DATASETS = [
  'revenue_daily',
  'top_products',
  'lead_times',
  'peak_hours',
] as const

export type ReportDataset = (typeof REPORT_DATASETS)[number]

/**
 * Compara candidate com envKey usando comparação constant-time.
 * Retorna false se qualquer dos dois estiver vazio.
 */
export function checkApiKey(candidate: string, envKey: string): boolean {
  if (!candidate || !envKey) return false
  try {
    const a = Buffer.from(candidate)
    const b = Buffer.from(envKey)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
