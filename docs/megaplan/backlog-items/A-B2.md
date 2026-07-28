<!-- megaplan v2.0.0 -->
# A-B2 — Seed `003_portfolio.sql`: 12–16 trabalhos com imagens Unsplash

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | manual |
| Depends on | A-B1 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O portfólio nasce populado com 12–16 trabalhos placeholder (imagens Unsplash),
estilos e locais variados, prontos para o Kadu trocar pelas fotos reais.

## Scope
- [ ] `docs/database/seed/003_portfolio.sql` com 12–16 linhas
- [ ] `image_url` no formato `images.unsplash.com/photo-<id>?w=800&q=80`
- [ ] Estilos e `body_placement` variados

## Non-goals
- Filtros/layout (A-B3/A-B4)

## Dependencies / blockers
- A-B1

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | imagens Unsplash carregam |

## Acceptance criteria
- [ ] Seed insere 12–16 trabalhos; status synced

## Traceability
- Glossary: [[Trabalho / Portfolio item]], [[Estilo]], [[Local do corpo]]

## Notes
Imagens são placeholder temático de uso comercial livre (confirmado: 100+ fotos de tatuagem
no Unsplash, uso comercial livre, sem atribuição); Kadu sobe as reais pelo admin antes de
divulgar o site.
