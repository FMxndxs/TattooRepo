<!-- megaplan v2.0.0 -->
# D-B1 — `docs/setup-pagamento-calendario.md`: guia Mercado Pago + Google Calendar

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | manual |
| Depends on | Cycle C |
| Target | Cycle D |
| Last updated | 2026-07-28 |

## Outcome
O Kadu tem um passo-a-passo para ativar Pix (Mercado Pago) e o espelho no Google Calendar.

## Scope
- [ ] Mercado Pago: sandbox, token, webhook via túnel
- [ ] Google Calendar: Service Account, compartilhar agenda

## Non-goals
- Código de integração (já existe; só documentar ativação)

## Dependencies / blockers
- Cycle C fechado

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | seguir o guia ativa o fluxo |

## Acceptance criteria
- [ ] Guia escrito e validado; status synced

## Traceability
- Glossary: [[Sinal / Deposit]], [[Agendamento / Booking]]

## Notes
`.env.local` já tem os placeholders vazios (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`,
`GOOGLE_SA_EMAIL`, `GOOGLE_SA_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`) — só falta o guia.
