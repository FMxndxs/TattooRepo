<!-- megaplan v2.0.0 -->
# A-B5 — Campo `body_placement` em `PortfolioForm`/`PortfolioPanel` + action

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | A-B4 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O Kadu edita o local do corpo de cada trabalho pelo admin.

## Scope
- [ ] Campo `body_placement` em `PortfolioForm`
- [ ] Exibir/editar em `PortfolioPanel`
- [ ] Persistir via `src/app/actions/portfolio.ts`

## Non-goals
- Novos campos além de `body_placement`

## Dependencies / blockers
- A-B4

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | — | action salva `body_placement` |

## Acceptance criteria
- [ ] Campo persiste; `tsc`/testes verdes; status synced

## Traceability
- Glossary: [[Local do corpo]]

## Notes
Reusar `ImageUpload`/`uploadImage()` existentes.
