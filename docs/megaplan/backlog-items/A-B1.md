<!-- megaplan v2.0.0 -->
# A-B1 — Migration `102_portfolio_placement.sql`: coluna `body_placement` + índice

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | 0-B5 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
`portfolio_items` passa a registrar o local do corpo, base para o filtro do portfólio.

## Scope
- [x] `docs/database/migrations/102_portfolio_placement.sql`: `body_placement text` + índices
      em `style` e `body_placement` + `UNIQUE(image_url)`
- [x] Aplicada contra o Supabase de produção (nefktxfcxcuglvgmrmfy)

## Non-goals
- UI de edição (fica em A-B5)

## Dependencies / blockers
- Cycle 0 fechado

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | migration aplica no Supabase |

## Acceptance criteria
- [x] Coluna e índice criados; status synced

## Traceability
- Glossary: [[Local do corpo]]

## Notes
Adicionado também `UNIQUE(image_url)` (não previsto no escopo original) para permitir
`ON CONFLICT (image_url) DO NOTHING` no seed A-B2 — `portfolio_items` não tinha nenhuma
coluna única antes, então um seed idempotente exigia essa constraint.
