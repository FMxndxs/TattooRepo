/**
 * stateMachine.ts — Fonte única de verdade para o ciclo de vida de pedidos.
 *
 * Máquina de estados adaptada para impressão 3D:
 *
 *   pending → confirmed → in_production → finishing → ready
 *                                                        │
 *                                           ┌────────────┼──────────────────┐
 *                                    delivery↓     shipping↓         pickup↓
 *                              out_for_delivery    shipped         delivered
 *                                        ↓             ↓
 *                                    delivered     delivered
 *
 *   cancelled ← de qualquer estado não-terminal
 *
 *   custom_orders: accepted → in_production (ponto de entrada na produção)
 */

import type { FulfillmentType, OrderStatus } from '@/types'

// ─── Status metadata ──────────────────────────────────────────────────────────

export interface StatusMeta {
  label: string
  /** Classes Tailwind para badge (text + bg) */
  color: string
}

/**
 * Metadados de exibição para todos os status possíveis em orders e custom_orders.
 * Substitui STATUS_DISPLAY e ADMIN_STATUS_OPTIONS ad-hoc anteriores.
 */
export const STATUS_META: Record<string, StatusMeta> = {
  // ── Ciclo de produção (orders + custom_orders) ────────────────────────────
  pending:          { label: 'Pendente',        color: 'text-yellow-400 bg-yellow-400/10' },
  confirmed:        { label: 'Confirmado',       color: 'text-blue-400 bg-blue-400/10' },
  in_production:    { label: 'Imprimindo',       color: 'text-indigo-400 bg-indigo-400/10' },
  finishing:        { label: 'Acabamento',       color: 'text-violet-400 bg-violet-400/10' },
  ready:            { label: 'Pronto',            color: 'text-brand-300 bg-brand-700/20' },
  out_for_delivery: { label: 'Saiu p/ entrega',  color: 'text-amber-400 bg-amber-400/10' },
  shipped:          { label: 'Enviado',           color: 'text-purple-400 bg-purple-400/10' },
  delivered:        { label: 'Entregue',          color: 'text-green-400 bg-green-400/10' },
  cancelled:        { label: 'Cancelado',         color: 'text-red-400 bg-red-400/10' },
  completed:        { label: 'Concluído',         color: 'text-green-400 bg-green-400/10' }, // legado
  // ── Ciclo de orçamento (exclusivo de custom_orders) ───────────────────────
  reviewing:        { label: 'Em análise',        color: 'text-blue-400 bg-blue-400/10' },
  quoted:           { label: 'Orçado',            color: 'text-purple-400 bg-purple-400/10' },
  accepted:         { label: 'Aceito',            color: 'text-teal-400 bg-teal-400/10' },
  rejected:         { label: 'Recusado',          color: 'text-red-400 bg-red-400/10' },
}

// ─── Estados terminais ────────────────────────────────────────────────────────

const TERMINAL_STATUSES = new Set(['delivered', 'cancelled', 'completed', 'rejected'])

export function isTerminal(status: string): boolean {
  return TERMINAL_STATUSES.has(status)
}

// ─── Grafo de transições ──────────────────────────────────────────────────────
//
// Transições independentes do fulfillment_type.
// No estado `ready`, o fulfillment determina o próximo estado de progressão
// (ver nextStatuses). O estado `cancelled` é acessível de qualquer não-terminal.
//
const BASE_TRANSITIONS: Record<string, string[]> = {
  // Normal order lifecycle
  pending:          ['confirmed', 'cancelled'],
  confirmed:        ['in_production', 'cancelled'],
  in_production:    ['finishing', 'cancelled'],
  finishing:        ['ready', 'cancelled'],
  // `ready`: progressão depende de fulfillment (adicionada em nextStatuses)
  ready:            ['cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  shipped:          ['delivered', 'cancelled'],
  // Terminais
  delivered:        [],
  cancelled:        [],
  completed:        [],  // legado; terminal
  // Ciclo de orçamento de custom_orders
  accepted:         ['in_production', 'cancelled'],  // entrada na produção
  reviewing:        ['quoted', 'cancelled'],
  quoted:           ['accepted', 'rejected'],
  rejected:         [],                              // terminal
}

/**
 * Retorna a lista de próximos estados válidos dado o status atual e
 * (opcionalmente) o fulfillment_type do pedido.
 *
 * O fulfillment_type só é relevante quando o status for `ready`:
 *  - delivery  → out_for_delivery
 *  - shipping  → shipped
 *  - pickup    → delivered (sem etapa intermediária)
 *  - null/undefined → todos os três (exibe todas as opções)
 */
export function nextStatuses(
  status: string,
  fulfillment?: FulfillmentType | null,
): string[] {
  const base = BASE_TRANSITIONS[status] ?? []

  if (status !== 'ready') return base

  // Em `ready`, determinar progressão por fulfillment
  const progressions: string[] =
    fulfillment === 'delivery'  ? ['out_for_delivery'] :
    fulfillment === 'shipping'  ? ['shipped']          :
    fulfillment === 'pickup'    ? ['delivered']        :
    ['out_for_delivery', 'shipped', 'delivered']       // fulfillment desconhecido

  // Progressões primeiro, depois `cancelled` (último)
  return [...progressions, ...base]
}

/**
 * Retorna true se a transição de `from` para `to` é permitida dado o
 * fulfillment_type.
 */
export function canTransition(
  from: string,
  to: string,
  fulfillment?: FulfillmentType | null,
): boolean {
  return nextStatuses(from, fulfillment).includes(to)
}

// ─── Opções para o select de admin ───────────────────────────────────────────

/**
 * Todos os status do ciclo de produção na ordem do fluxo.
 * Usados para popular dropdowns/selects no painel admin.
 */
export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'in_production',
  'finishing',
  'ready',
  'out_for_delivery',
  'shipped',
  'delivered',
  'cancelled',
]
