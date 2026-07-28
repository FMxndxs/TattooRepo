<!-- megaplan v2.0.0 -->
# B-B6 — Renomear componentes/classes tema 3D → tema tattoo

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | B-B5 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
Componentes e classes CSS não carregam mais o tema de impressão 3D.

## Scope
- [x] `PrintCtaLink` → `CtaLink` (único componente do tema com consumidor real:
      HomeClient, nossa-historia, UserMenu)
- [x] `PrintLayerSkeleton`, `FilamentBackdrop`, `PrintLineHover` — **deletados** em vez de
      renomeados (zero consumidores reais desde que catalog/product/meus-pedidos saíram
      no Cycle 0; renomear dead code não fazia sentido — deletion over addition)
- [x] Classes `print-*`/`filament-*` em `globals.css`: renomeadas as vivas
      (`print-cta-sheen`→`cta-sheen`, `print-cta-filament`→`cta-sheen-fill`,
      `print-header-glow`→`header-glow`); removidas as mortas (`filament-grid`,
      `filament-sweep-gradient`, `@keyframes extrusion-scan`/`nozzle-glow-scan`,
      `print-skel-*`, `print-extrusion-shimmer`, `print-buildplate-bg`, `print-line-muted-motion`)
- [x] `MotionPrimitives.test.tsx` ajustado (removido describe de `PrintLineHover`)

## Non-goals
- Redesign visual profundo

## Dependencies / blockers
- B-B5

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `MotionPrimitives.test.tsx` | sem referência a `PrintLineHover`/testid `print-line` |

## Acceptance criteria
- [x] Testes verdes; status synced

## Traceability
- Related: renomear teve efeito em cascata — grep dirigido, tsc/test/build a cada passo

## Notes
Bug encontrado e corrigido no processo (fora do escopo original, mas descoberto pelo grep
dirigido): `UserMenu.tsx` (dropdown desktop, componente separado do menu mobile do
`Header.tsx`) ainda linkava `/meus-pedidos`, rota removida no Cycle 0 (0-B2) — só o link
do menu mobile tinha sido corrigido antes. Corrigido aqui.
`print-buildplate-bg` nunca chegou a ser aplicado em `layout.tsx` (contrário ao que o
CLAUDE.md antigo dizia) — confirmado morto e removido sem substituto.
