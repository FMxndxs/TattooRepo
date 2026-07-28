<!-- megaplan v2.0.0 -->
# A-B4 — Layout galeria estilo Instagram + link pro Instagram do estúdio

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | manual |
| Depends on | A-B3 |
| Target | Cycle A |
| Last updated | 2026-07-28 |

## Outcome
O portfólio ganha apelo visual (grid denso com hover mostrando título+estilo+local) e um
caminho para o Instagram do estúdio.

## Scope
- [x] Layout grid denso (2/3/4 colunas, aspect-square, gap mínimo — estética de feed)
- [x] Hover com título + estilo + local do corpo
- [x] Link pro Instagram do estúdio

## Non-goals
- Nova lógica de filtro (A-B3)

## Dependencies / blockers
- A-B3

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual | — | navegar `/portfolio`, ver hover e link |

## Acceptance criteria
- [x] Layout e link no ar; status synced

## Traceability
- Glossary: [[Trabalho / Portfolio item]], [[Estilo]]

## Notes
`sizes` adicionado em todo `next/image` com `fill` tocado (página pública + admin),
conforme convenção do CLAUDE.md. **O link do Instagram
(`https://instagram.com/kadufreitastattoo`) é placeholder** — marcado com comentário
`ponytail:` no código — precisa ser trocado pelo perfil real do estúdio antes de
divulgar o site (mesmo aviso do A-B2 para as fotos). Ícone usado é `Camera` (lucide-react
v1 removeu ícones de marca como `Instagram`).
