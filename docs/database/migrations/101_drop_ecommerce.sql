-- ============================================================
-- Migration 101: DROP da camada de e-commerce (pivô → tatuagem)
-- ============================================================
-- Data: 2026-07-28
--
-- O projeto está pivotando de e-commerce de impressão 3D para
-- site de estúdio de tatuagem. Esta migration REMOVE toda a
-- camada de catálogo/vendas 3D e PRESERVA o domínio de tatuagem
-- e o fluxo de orçamento (custom_orders).
--
-- ⚠️  IRREVERSÍVEL — rode só após confirmar o pivô. ⚠️
--     Os dados de produtos/pedidos serão perdidos permanentemente.
--
-- Verificação de FKs de custom_orders (PRESERVADA):
--   * NENHUMA FK aponta para tabelas dropadas aqui.
--   * user_id (032) -> auth.users  (preservada)
--   * color_name (036) é TEXT, não é FK para colors.
--   * status (029) é apenas CHECK.
--   Logo, nenhum ALTER ... DROP CONSTRAINT/COLUMN é necessário.
--
-- Dependências de RUNTIME que quebrariam custom_orders (tratadas abaixo):
--   1. gen_order_code() (033) consulta public.orders -> redefinida.
--   2. trigger trg_custom_orders_status_history (027) grava em
--      order_status_history -> removido junto da função órfã.
--
-- PRESERVADAS (NÃO dropar): custom_orders, profiles, settings,
--   app_settings, services, availability_rules, time_off,
--   bookings, promotions, portfolio_items.
-- ============================================================

BEGIN;

-- 1. Views de relatório (031) — dependem de orders/order_items/order_status_history
DROP VIEW IF EXISTS public.v_revenue_daily         CASCADE;
DROP VIEW IF EXISTS public.v_top_products          CASCADE;
DROP VIEW IF EXISTS public.v_production_lead_times CASCADE;
DROP VIEW IF EXISTS public.v_peak_hours            CASCADE;

-- 2. Proteger custom_orders: remover trigger de histórico e função órfã (027)
DROP TRIGGER  IF EXISTS trg_custom_orders_status_history ON public.custom_orders;
DROP FUNCTION IF EXISTS public.record_order_status_change() CASCADE;

-- 3. Proteger custom_orders: gen_order_code() não pode mais consultar orders (033)
CREATE OR REPLACE FUNCTION gen_order_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet  TEXT    := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';  -- base32 Crockford (sem I L O U)
  candidate TEXT;
  i         INTEGER;
  attempts  INTEGER := 0;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..5 LOOP
      candidate := candidate || substr(alphabet, floor(random() * 32)::int + 1, 1);
    END LOOP;

    -- Unicidade agora só contra custom_orders (orders foi removida)
    IF NOT EXISTS (SELECT 1 FROM public.custom_orders WHERE order_code = candidate) THEN
      RETURN candidate;
    END IF;

    attempts := attempts + 1;
    IF attempts >= 50 THEN
      RETURN candidate || substr(alphabet, floor(random() * 32)::int + 1, 1);
    END IF;
  END LOOP;
END;
$$;

-- 4. Drop das tabelas de e-commerce (filhas antes das mães; CASCADE por segurança)
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.order_items          CASCADE;
DROP TABLE IF EXISTS public.orders               CASCADE;
DROP TABLE IF EXISTS public.product_views        CASCADE;
DROP TABLE IF EXISTS public.product_images       CASCADE;
DROP TABLE IF EXISTS public.product_colors       CASCADE;
DROP TABLE IF EXISTS public.product_sizes        CASCADE;
DROP TABLE IF EXISTS public.products             CASCADE;
DROP TABLE IF EXISTS public.colors               CASCADE;
DROP TABLE IF EXISTS public.categories           CASCADE;

-- 5. Enum de status de orders (014) fica órfão após o drop
DROP TYPE IF EXISTS order_status CASCADE;

-- 6. custom_orders: aperta o CHECK de status ao ciclo de orçamento puro.
--    Um estúdio de tatuagem não tem etapa de produção/despacho — depois de
--    "accepted" o cliente agenda a sessão em /agendar (rastreado em bookings).
--    Qualquer linha com status de produção legado é migrada para 'accepted'
--    (a etapa de cotação já estava concluída nesses casos).
UPDATE public.custom_orders
   SET status = 'accepted'
 WHERE status IN ('in_production', 'finishing', 'ready', 'out_for_delivery', 'shipped', 'delivered', 'completed', 'confirmed');

ALTER TABLE public.custom_orders
  DROP CONSTRAINT IF EXISTS custom_orders_status_check;

ALTER TABLE public.custom_orders
  ADD CONSTRAINT custom_orders_status_check
  CHECK (status IN ('pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'cancelled'));

COMMIT;
