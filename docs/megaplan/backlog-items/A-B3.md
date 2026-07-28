<!-- megaplan v2.0.0 -->
# A-B3 — Filtros por estilo + local do corpo em `/portfolio`

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | A-B2 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O visitante filtra o portfólio por estilo e local do corpo, encontrando trabalhos
relevantes rapidamente.

## Scope
- [x] Derivar opções de filtro dos dados (`portfolioFilterOptions`)
- [x] Server component + query param (`?estilo=&local=`)
- [x] Filtrar por estilo e `body_placement` (`filterPortfolioItems`)

## Non-goals
- Layout visual (A-B4)

## Dependencies / blockers
- A-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `portfolioFilter.test.ts` | opções derivadas + filtro por estilo/local/combinado |

## Acceptance criteria
- [x] Filtros funcionam; `tsc`/testes verdes; status synced

## Traceability
- Glossary: [[Estilo]], [[Local do corpo]]

## Notes
Em vez de refazer a query no banco por combinação de filtro (padrão do antigo
`getProducts(slug)`), optei por buscar todos os itens uma vez e filtrar em memória —
dataset de um único estúdio (dezenas de itens, não milhares), então filtro client-side
no server component é mais simples e correto (YAGNI em otimização de query prematura).
Lógica extraída para `src/lib/portfolio/filter.ts` (função pura) para ser testável sem
mockar Supabase/Next.
