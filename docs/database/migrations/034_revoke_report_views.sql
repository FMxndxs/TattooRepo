-- Migration 034: Revogar acesso direto às views de relatório para anon/authenticated
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- Problema: as views v_revenue_daily, v_top_products, v_production_lead_times e
-- v_peak_hours são owned pelo role `postgres` (migration 031). Por padrão, o
-- Postgres herda GRANT das tabelas base para views com SECURITY INVOKER (padrão),
-- mas as roles anon/authenticated podem ter EXECUTE/SELECT herdado implicitamente
-- no schema public dependendo das configurações do Supabase.
--
-- Solução: revogar SELECT explicitamente de anon e authenticated nessas views.
-- O acesso legítimo (dashboard /admin/relatorios) usa o service_role key via
-- createAdminClient() — que contorna RLS e bypassa essas restrições.
--
-- Seguro para rodar múltiplas vezes (REVOKE em role que não tem acesso é no-op).

REVOKE SELECT ON public.v_revenue_daily          FROM anon, authenticated;
REVOKE SELECT ON public.v_top_products           FROM anon, authenticated;
REVOKE SELECT ON public.v_production_lead_times  FROM anon, authenticated;
REVOKE SELECT ON public.v_peak_hours             FROM anon, authenticated;

-- Confirma que postgres/service_role mantém acesso (garantia idempotente)
GRANT SELECT ON public.v_revenue_daily          TO postgres;
GRANT SELECT ON public.v_top_products           TO postgres;
GRANT SELECT ON public.v_production_lead_times  TO postgres;
GRANT SELECT ON public.v_peak_hours             TO postgres;
