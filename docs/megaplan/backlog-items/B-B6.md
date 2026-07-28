<!-- megaplan v2.0.0 -->
# B-B6 — Renomear componentes/classes tema 3D → tema tattoo

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | B-B5 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
Componentes e classes CSS não carregam mais o tema de impressão 3D.

## Scope
- [ ] `PrintCtaLink` → `CtaLink`
- [ ] Renomear `PrintLayerSkeleton`, `FilamentBackdrop`, `PrintLineHover` (+ `data-testid`)
- [ ] Classes `print-*`/`filament-*` em `globals.css` e consumidores
- [ ] Ajustar `MotionPrimitives.test`

## Non-goals
- Redesign visual profundo

## Dependencies / blockers
- B-B5

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `MotionPrimitives.test` | novos nomes/testids |

## Acceptance criteria
- [ ] Testes verdes; status synced

## Traceability
- Related: renomear tem efeito em cascata (Header, Modal, CTAs, skeletons) — grep dirigido

## Notes
Rodar testes a cada passo (testid `print-line`). `FilamentBackdrop` pode estar órfão
(sem consumidor em `src/`) — confirmar antes de decidir entre renomear ou remover.
