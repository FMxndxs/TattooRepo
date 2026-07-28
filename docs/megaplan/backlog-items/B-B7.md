<!-- megaplan v2.0.0 -->
# B-B7 — `next.config.ts`: remover host makerworld; renomear chave sessionId

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | B-B6 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
Config e analytics não referenciam mais domínio/chave de impressão 3D.

## Scope
- [ ] Remover host `makerworld.bblmw.com` em `next.config.ts`
- [ ] Renomear chave `imagination3d_session_id` em `sessionId.ts` + teste

## Non-goals
- Mudar provider de analytics

## Dependencies / blockers
- B-B6

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `sessionId.test.ts` | nova chave |

## Acceptance criteria
- [ ] Testes verdes; status synced

## Traceability
- Related: fecha exit criteria do Cycle B

## Notes
Renomear a chave de sessão invalida sessões/analytics existentes — aceitável (ambiente
recém-migrado).
