<!-- megaplan v2.0.0 -->
# E-B2 — Correções de código: getPolicy, reschedule count, rate limit, manage_token

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | E-B1 (reschedules_used depende da migration 105) |
| Target | Cycle E |
| Last updated | 2026-07-29 |

## Outcome
Bugs de código encontrados junto da auditoria de RLS, todos bloqueantes para o D-B3 ou
para o modelo de segurança:

1. `getPolicy` lia `settings` (frete legado) em vez de `app_settings` — anulava o D-B2.
2. `reschedulesUsed` era enviado pelo cliente e hardcoded em `0` — `max_reschedules`
   inaplicável.
3. `createBookingAction`/`cancelBookingAction`/`rescheduleBookingAction` sem rate limit,
   permitindo cobranças Pix reais em loop.
4. A tela de sucesso de `/agendar` nunca exibia o `manage_token` — sem isso o cliente não
   tem como cancelar/remarcar, e o D-B3 não seria verificável ponta a ponta.

## Scope
- [x] `src/lib/booking/service.ts`: `getPolicy` → `app_settings`; fallback unificado em
      `DEFAULT_CANCELLATION_POLICY` (`stateMachine.ts`), reusado também por
      `src/app/actions/settings.ts` (antes tinha defaults divergentes: `{72,48,1}` vs
      `{24,12,3}`)
- [x] Migration `105_booking_reschedules.sql`: coluna `bookings.reschedules_used`
- [x] `rescheduleBookingByToken` lê/incrementa `reschedules_used` do banco; assinatura não
      aceita mais o parâmetro do cliente
- [x] `src/app/actions/bookings.ts`: rate limit via `checkRateLimit`/`extractIp`
      (`src/lib/security/rateLimit.ts`, já existia mas só era usado pelo próprio teste)
- [x] `/agendar`: tela de sucesso exibe o link `/agendamento/<manage_token>`
- [x] Storage: `uploadImage` grava sob prefixo `${auth.uid()}/...` (exigido pelas policies
      da E-B1)
- [x] Removido `trackProductClick`/`sessionId` (RPC órfã da fase e-commerce, dropada na
      E-B1, sem call sites)

## Non-goals
- Ordem de operações em `confirmBookingFromPayment` (GCal antes do UPDATE) — achado do
  runbook, não corrigido aqui
- Conciliação de pagamentos atrasados após hold expirado — achado do runbook, sem
  mitigação automática ainda

## Dependencies / blockers
- E-B1 (coluna `reschedules_used` vem da mesma migration 105 aplicada junto)

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `src/__tests__/unit/getPolicy.test.ts` | lê `app_settings`; fallback em erro/ausência |
| Unit | `src/__tests__/unit/bookingReschedule.test.ts` | contador vem do banco; bloqueia no limite; ignora valor do cliente |
| Unit | `src/__tests__/unit/bookingRateLimit.test.ts` | bloqueia a N+1ª tentativa; buckets independentes por ação/IP |
| Unit | `src/__tests__/unit/mercadopagoWebhook.test.ts` | rota sem teste antes; filtro de tópico, 401, não-aprovado, idempotência |
| Unit | `src/__tests__/unit/appSettings.test.ts` | default atualizado para `{72,48,1}` |

## Acceptance criteria
- [x] `npm test` (27 suites / 207 testes), `npx tsc --noEmit`, `npm run build` verdes

## Traceability
- Glossary: [[Sinal / Deposit]], [[Agendamento / Booking]], [[Política de cancelamento]]

## Notes
—
