<!-- megaplan v2.0.0 -->
# E-B1 — Migration `104_harden_rls.sql`: blindagem de policies

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | — |
| Owner | — |
| Verification | manual (SQL Editor) + `verify_rls.sql` |
| Depends on | — |
| Target | Cycle E |
| Last updated | 2026-07-29 |

## Outcome
Duas falhas P0 de auditoria corrigidas: escalada de privilégio via `profiles.is_admin`, e
as 7 policies `admin all *` do domínio de tatuagem que usavam `auth.role() = 'authenticated'`
(qualquer logado era admin no banco). Mais os achados P1/P2/P3 relacionados.

## Scope
- [x] Trigger + GRANT de coluna impedindo `authenticated` de alterar `profiles.is_admin`
- [x] `services/availability_rules/time_off/bookings/promotions/portfolio_items/app_settings`:
      `admin all *` → `is_admin()`
- [x] `bookings` fechada (zero policy para anon/authenticated comum — decisão do usuário,
      sem adicionar `user_id`)
- [x] `time_off` e `settings` (config de frete legada) sem leitura pública
- [x] `app_settings` legível só nas chaves `cancellation_policy`/`whatsapp_number`
- [x] `profiles`: policy de INSERT (faltava — quebrava o upsert de `/perfil`)
- [x] `custom_orders`: UPDATE/DELETE do próprio dono
- [x] Storage: bucket `products` sem DELETE para qualquer autenticado; bucket
      `custom-orders` criado com escrita/apagar escopados por `auth.uid()/...`
- [x] Limpeza de funções/publicações órfãs da fase e-commerce
- [x] `docs/database/verify_rls.sql` — script de regressão

## Non-goals
- Adicionar `user_id` a `bookings` (decisão: fechar a tabela em vez disso)
- Migrar `custom-orders` para bucket privado + signed URL (mantido público, só
  escopado por dono — refactor maior, fora do escopo desta blindagem)

## Dependencies / blockers
—

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Manual (SQL Editor) | `docs/database/verify_rls.sql` | nenhuma policy com `true`/`auth.role()='authenticated'`; bookings fechada; is_admin protegido |
| E2E manual | `D-B3-runbook.md` §6 | prova via curl com JWT de conta comum |

## Acceptance criteria
- [x] Migration escrita, idempotente (`DROP POLICY IF EXISTS` antes de cada `CREATE`)
- [x] Rodada no Supabase do projeto e `verify_rls.sql` executado sem exceção — confirmado
      pelo usuário em 2026-07-29

## Traceability
- Glossary: [[Admin role]], [[RLS]]

## Notes
Auditoria completa (tabelas com RLS desativado / policies permissivas / risco de
vazamento de service_role_key) documentada na conversa que originou este ciclo. Achado
mais grave: `100_tattoo_domain.sql` reintroduziu verbatim o anti-pattern que
`035_harden_baseline_policies.sql` foi escrita para eliminar.
