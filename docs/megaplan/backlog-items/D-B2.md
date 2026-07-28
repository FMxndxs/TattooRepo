<!-- megaplan v2.0.0 -->
# D-B2 — Ligar `StudioSettingsForm` ao `app_settings` via action

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | D-B1 |
| Target | Cycle D |
| Last updated | 2026-07-28 |

## Outcome
A política de cancelamento e outros ajustes vêm de `app_settings` editável, não
hardcoded.

## Scope
- [ ] Ligar `StudioSettingsForm` ao `app_settings` via action
- [ ] Remover valores hardcoded (ver `ponytail:` na L4 do form)

## Non-goals
- Nova UI além do form existente

## Dependencies / blockers
- D-B1

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | — | action lê/grava `app_settings` |

## Acceptance criteria
- [ ] Settings persistem; testes verdes; status synced

## Traceability
- Glossary: [[Sinal / Deposit]]

## Notes
—
