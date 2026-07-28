<!-- megaplan v2.0.0 -->
# B-B7 — `next.config.ts`: remover host makerworld; renomear chave sessionId

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | B-B6 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
Config e analytics não referenciam mais domínio/chave de impressão 3D.

## Scope
- [x] Removido host `makerworld.bblmw.com` em `next.config.ts`
- [x] Chave `imagination3d_session_id` → `kadu_tattoo_session_id` em `sessionId.ts` + teste

## Non-goals
- Mudar provider de analytics

## Dependencies / blockers
- B-B6

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `sessionId.test.ts` | nova chave |

## Acceptance criteria
- [x] Testes verdes; status synced

## Traceability
- Related: fecha exit criteria do Cycle B

## Notes
Renomear a chave de sessão invalida sessões/analytics existentes — aceitável (ambiente
recém-migrado, sem tráfego real ainda).
