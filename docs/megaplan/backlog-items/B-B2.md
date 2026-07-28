<!-- megaplan v2.0.0 -->
# B-B2 — `lib/seo/schema.ts` para estúdio + ajustar `seo-schema.test.ts`

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | B-B1 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
O JSON-LD descreve o estúdio de tatuagem (organization/localBusiness) em vez de
e-commerce 3D.

## Scope
- [x] `organizationSchema`/`localBusinessSchema`: `name` → "Kadu Freitas Tattoo",
      `description` reescrita para o estúdio
- [x] `seo-schema.test.ts`: asserção de `name` atualizada

## Non-goals
- FAQPage (fica em C-B1)
- `productSchema` (já removida em 0-B4 — dead code do domínio de produto)

## Dependencies / blockers
- B-B1

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `seo-schema.test.ts` | schema do estúdio |

## Acceptance criteria
- [x] Teste verde; status synced

## Traceability
- Glossary: [[Serviço]]

## Notes
`priceRange`, `telephone`, `address`, `geo`, `sameAs`, `contactPoint` preservados
(já genéricos/corretos para o estúdio).
