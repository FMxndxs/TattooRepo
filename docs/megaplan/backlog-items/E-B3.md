<!-- megaplan v2.0.0 -->
# E-B3 — Testes de regressão da blindagem (Red → Green)

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | E-B2 |
| Target | Cycle E |
| Last updated | 2026-07-29 |

## Outcome
Cobertura de teste para os 4 pontos corrigidos em `E-B2`, incluindo a primeira cobertura
da rota do webhook do Mercado Pago (não tinha nenhum teste antes desta auditoria).

## Scope
- [x] `getPolicy.test.ts`
- [x] `bookingReschedule.test.ts`
- [x] `bookingRateLimit.test.ts`
- [x] `mercadopagoWebhook.test.ts`
- [x] Ajuste em `appSettings.test.ts` (default alinhado)

## Non-goals
- Testes de componente para `/agendar` e `/agendamento/[token]` (fora do escopo; runbook
  manual cobre a UI)

## Dependencies / blockers
- E-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | (ver E-B2) | — |

## Acceptance criteria
- [x] `npm test` verde (27 suites / 207 testes)

## Traceability
- Glossary: —

## Notes
—
