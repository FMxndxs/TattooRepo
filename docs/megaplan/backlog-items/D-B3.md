<!-- megaplan v2.0.0 -->
# D-B3 — Verificação end-to-end: Pix sandbox → webhook → confirmed + evento GCal

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | manual |
| Depends on | D-B2 |
| Target | Cycle D |
| Last updated | 2026-07-28 |

## Outcome
O fluxo de agendamento com sinal funciona ponta a ponta em sandbox, com espelho no Google
Calendar.

## Scope
- [ ] Criar serviço com sinal
- [ ] Agendar
- [ ] Pagar Pix sandbox
- [ ] Confirmar webhook → `confirmed` + evento no GCal

## Non-goals
- Produção real (sandbox apenas)

## Dependencies / blockers
- D-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| E2E manual | — | Pix → webhook → confirmed → GCal |

## Acceptance criteria
- [ ] Fluxo validado em sandbox; status synced

## Traceability
- Glossary: [[Sinal / Deposit]], [[Agendamento / Booking]], [[Serviço]]

## Notes
Fonte da verdade é o banco; GCal é espelho.
