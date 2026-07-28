<!-- megaplan v2.0.0 -->
# A-B2 — Seed `003_portfolio.sql`: 12–16 trabalhos com imagens Unsplash

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | manual |
| Depends on | A-B1 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O portfólio nasce populado com 14 trabalhos placeholder (imagens Unsplash),
estilos e locais variados, prontos para o Kadu trocar pelas fotos reais.

## Scope
- [x] `docs/database/seed/003_portfolio.sql` com 14 linhas
- [x] `image_url` no formato `images.unsplash.com/photo-<id>?w=800&q=80&fit=crop`
- [x] Estilos (9: Blackwork, Fineline, Old School, Neo-tradicional, Realismo,
      Pontilhismo, Tribal, Minimalista, Lettering) e locais (6: braço, antebraço,
      perna, costas, mão, peito) variados
- [x] Aplicado contra o Supabase de produção — 14 linhas confirmadas

## Non-goals
- Filtros/layout (A-B3/A-B4)

## Dependencies / blockers
- A-B1

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | imagens Unsplash carregam |

## Acceptance criteria
- [x] Seed insere 14 trabalhos; status synced

## Traceability
- Glossary: [[Trabalho / Portfolio item]], [[Estilo]], [[Local do corpo]]

## Notes
Cada uma das 14 fotos foi verificada individualmente via WebFetch antes de entrar no
seed: confirmado "Free to use under the Unsplash License" (não Unsplash+/premium) e que
o conteúdo é de fato uma tatuagem. Candidatos descartados: fotos marcadas premium, uma de
henna/mehndi (não é tatuagem permanente) e uma com imagética de arma de fogo (risco de
marca para um estúdio). Títulos são descritivos genéricos ("Blackwork geométrico" etc.),
não nomes de clientes reais — são placeholder, não trabalhos do Kadu.
