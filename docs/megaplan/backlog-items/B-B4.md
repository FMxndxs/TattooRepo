<!-- megaplan v2.0.0 -->
# B-B4 — `Footer.tsx` + `AuthModal.tsx` + comentário `Modal.tsx`

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | B-B3 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
Footer e modais refletem o estúdio (logo, textos, Instagram real) sem links de
carrinho/catálogo.

## Scope
- [x] `Footer.tsx`: logo `/logo-kadu.png`, textos, Instagram placeholder atualizado,
      links de navegação corrigidos (`/portfolio` em vez de `/catalog`, sem carrinho)
- [x] `AuthModal.tsx`: texto do rodapé "Imagination 3D" → "Kadu Freitas Tattoo"
- [x] `Modal.tsx`: comentário "3D print decoration" reescrito

## Non-goals
- Reescrever nossa-historia (B-B5)

## Dependencies / blockers
- B-B3

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | footer/modais sem "3D" |

## Acceptance criteria
- [x] Textos trocados; status synced

## Traceability
- Related: B-B5

## Notes
Instagram (`https://instagram.com/kadufreitastattoo`) é placeholder, mesmo aviso do A-B2/A-B4
— trocar pelo perfil real antes de divulgar.
