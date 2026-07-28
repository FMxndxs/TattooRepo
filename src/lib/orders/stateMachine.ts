/**
 * stateMachine.ts — Fonte única de verdade para o ciclo de vida de orçamentos
 * (custom_orders). Um estúdio de tatuagem não despacha produtos físicos: o
 * ciclo é só de cotação. Depois de aceito, o cliente agenda a sessão em
 * /agendar — isso é rastreado em `bookings`, não aqui.
 *
 *   pending → reviewing → quoted → accepted | rejected
 *   pending | reviewing | quoted → cancelled
 */

// ─── Status metadata ──────────────────────────────────────────────────────────

export interface StatusMeta {
  label: string
  /** Classes Tailwind para badge (text + bg) */
  color: string
}

export const STATUS_META: Record<string, StatusMeta> = {
  pending:   { label: 'Pendente',    color: 'text-yellow-400 bg-yellow-400/10' },
  reviewing: { label: 'Em análise',  color: 'text-blue-400 bg-blue-400/10' },
  quoted:    { label: 'Orçado',      color: 'text-purple-400 bg-purple-400/10' },
  accepted:  { label: 'Aceito',      color: 'text-teal-400 bg-teal-400/10' },
  rejected:  { label: 'Recusado',    color: 'text-red-400 bg-red-400/10' },
  cancelled: { label: 'Cancelado',   color: 'text-red-400 bg-red-400/10' },
}

// ─── Estados terminais ────────────────────────────────────────────────────────

const TERMINAL_STATUSES = new Set(['accepted', 'rejected', 'cancelled'])

export function isTerminal(status: string): boolean {
  return TERMINAL_STATUSES.has(status)
}

// ─── Grafo de transições ──────────────────────────────────────────────────────

const TRANSITIONS: Record<string, string[]> = {
  pending:   ['reviewing', 'cancelled'],
  reviewing: ['quoted', 'cancelled'],
  quoted:    ['accepted', 'rejected'],
  accepted:  [],
  rejected:  [],
  cancelled: [],
}

/** Retorna a lista de próximos estados válidos dado o status atual. */
export function nextStatuses(status: string): string[] {
  return TRANSITIONS[status] ?? []
}

/** Retorna true se a transição de `from` para `to` é permitida. */
export function canTransition(from: string, to: string): boolean {
  return nextStatuses(from).includes(to)
}

// ─── Opções para o select de admin ───────────────────────────────────────────

export const CUSTOM_ORDER_STATUS_OPTIONS = [
  'pending',
  'reviewing',
  'quoted',
  'accepted',
  'rejected',
  'cancelled',
] as const
