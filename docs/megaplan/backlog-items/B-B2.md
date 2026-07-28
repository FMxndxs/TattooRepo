<!-- megaplan v2.0.0 -->
# B-B2 — `lib/seo/schema.ts` para estúdio + ajustar `seo-schema.test.ts`

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | B-B1 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
O JSON-LD descreve o estúdio de tatuagem (organization/localBusiness) em vez de
e-commerce 3D.

## Scope
- [ ] Atualizar `organizationSchema`/`localBusinessSchema` em `lib/seo/schema.ts`
      (nome, description, sem `hasOfferCatalog` — já removido em 0-B4 por apontar
      pra `/catalog` morto)
- [ ] Ajustar `seo-schema.test.ts` (linhas com "Imagination 3D")

## Non-goals
- FAQPage (fica em C-B1)
- `productSchema` (já removido em 0-B4 — dead code do domínio de produto)

## Dependencies / blockers
- B-B1

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `seo-schema.test.ts` | schema do estúdio |

## Acceptance criteria
- [ ] Teste verde; status synced

## Traceability
- Glossary: [[Serviço]]

## Notes
`productSchema` e o campo `hasOfferCatalog` de `localBusinessSchema` já saíram no 0-B4
(estavam mortos/apontando pra rota removida `/catalog`) — este item foca só no texto
"Imagination 3D"/Bambu Lab restante em `organizationSchema`/`localBusinessSchema`.
