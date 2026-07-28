<!-- megaplan v2.0.0 -->
# A-B1 — Migration `102_portfolio_placement.sql`: coluna `body_placement` + índice

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | 0-B5 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
`portfolio_items` passa a registrar o local do corpo, base para o filtro do portfólio.

## Scope
- [ ] `docs/database/migrations/102_portfolio_placement.sql`: `body_placement text` + índice

## Non-goals
- UI de edição (fica em A-B5)

## Dependencies / blockers
- Cycle 0 fechado

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | migration aplica no Supabase |

## Acceptance criteria
- [ ] Coluna e índice criados; status synced

## Traceability
- Glossary: [[Local do corpo]]

## Notes
—
