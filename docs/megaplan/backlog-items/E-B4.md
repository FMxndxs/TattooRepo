<!-- megaplan v2.0.0 -->
# E-B4 — Runbook D-B3 estendido + fechamento do Cycle D

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | — |
| Owner | — |
| Verification | manual |
| Depends on | E-B1, E-B2, E-B3 |
| Target | Cycle E |
| Last updated | 2026-07-29 |

## Outcome
`docs/megaplan/backlog-items/D-B3-runbook.md` escrito: estende o checklist de
`docs/setup-pagamento-calendario.md` §4 com os casos de borda encontrados na auditoria
(sinal zero, Google Calendar indisponível, pagamento atrasado) e a prova de RLS do
Cycle E via `curl` com JWT de conta comum.

## Scope
- [x] Runbook escrito com os 4 itens de escopo do D-B3 + 3 casos de borda + prova de RLS
- [x] `D-B3.md` atualizado: aponta pro runbook, status ajustado, nota sobre o bug do D-B2
- [x] Megaplan: seção Cycle E adicionada; errata atualizada

## Non-goals
- Executar o runbook (requer browser, sandbox do Mercado Pago e acesso à conta Google do
  estúdio — fora do alcance deste agente; ver nota em `D-B3.md`)

## Dependencies / blockers
- E-B1, E-B2, E-B3

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | `D-B3-runbook.md` | execução ponta a ponta pelo Kadu ou por quem tiver acesso |

## Acceptance criteria
- [x] Runbook e documentação prontos
- [ ] Runbook executado e resultados preenchidos (bloqueia o fechamento real do Cycle D)

## Traceability
- Glossary: —

## Notes
`D-B3` continua `pending` no megaplan até a execução manual acontecer — este item cobre
só a preparação da verificação, não a verificação em si.
