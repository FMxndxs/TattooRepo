<!-- megaplan v2.0.0 -->
# A-B5 — Campo `body_placement` em `PortfolioForm`/`PortfolioPanel` + action

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | A-B4 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O Kadu edita o local do corpo de cada trabalho pelo admin.

## Scope
- [x] Campo `body_placement` em `PortfolioForm` (input livre + validação zod)
- [x] Exibir/editar em `PortfolioPanel` (badge "estilo · local")
- [x] Persistir via `src/app/actions/portfolio.ts` (já era genérico — `Omit<PortfolioItem,...>` —
      não precisou de alteração, só o tipo `PortfolioItem` ganhou o campo)

## Non-goals
- Novos campos além de `body_placement`

## Dependencies / blockers
- A-B4

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | (cobertura indireta) | `portfolioSchema` valida `body_placement` nullable |

## Acceptance criteria
- [x] Campo persiste; `tsc`/testes verdes; status synced

## Traceability
- Glossary: [[Local do corpo]]

## Notes
Reusou `ImageUpload`/`uploadImage()` existentes, sem mudança — o upload de imagem não
tinha relação com este campo. Não há teste unitário dedicado a `PortfolioForm`/`PortfolioPanel`
(nunca tiveram testes próprios antes desta migração); a validação do schema é o teste que
existe e cobre o campo novo.
