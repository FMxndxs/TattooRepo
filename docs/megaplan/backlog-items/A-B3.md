<!-- megaplan v2.0.0 -->
# A-B3 — Filtros por estilo + local do corpo em `/portfolio`

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | A-B2 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O visitante filtra o portfólio por estilo e local do corpo, encontrando trabalhos
relevantes rapidamente.

## Scope
- [ ] Derivar opções de filtro dos dados
- [ ] Server component + query param (padrão do catálogo antigo)
- [ ] Filtrar por estilo e `body_placement`

## Non-goals
- Layout visual (A-B4)

## Dependencies / blockers
- A-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | — | query filtra por estilo e local |

## Acceptance criteria
- [ ] Filtros funcionam; `tsc`/testes verdes; status synced

## Traceability
- Glossary: [[Estilo]], [[Local do corpo]]

## Notes
Reusar padrão de query param do antigo `getProducts(slug)` (já removido, mas o padrão de
resolver filtro via searchParams no server component segue válido).
