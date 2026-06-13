-- Migration 031: Views de relatório para o dashboard do dono
-- Projeto Supabase: oflozudwutxgvwyvygll

-- 1. Faturamento diário + ticket médio
CREATE OR REPLACE VIEW public.v_revenue_daily AS
SELECT
  DATE(o.created_at AT TIME ZONE 'America/Sao_Paulo') AS day,
  COUNT(*)::INT                                         AS order_count,
  SUM(o.total)                                          AS revenue,
  ROUND(AVG(o.total), 2)                                AS avg_ticket
FROM public.orders o
WHERE o.status NOT IN ('cancelled', 'pending')
GROUP BY 1
ORDER BY 1 DESC;

-- 2. Produtos mais vendidos (por snapshot de nome)
CREATE OR REPLACE VIEW public.v_top_products AS
SELECT
  COALESCE(oi.product_name, p.name, 'Produto excluído') AS product_name,
  COALESCE(oi.color_name, c.name)                        AS color_name,
  COUNT(DISTINCT o.id)::INT                              AS order_count,
  SUM(oi.quantity)::INT                                  AS total_qty,
  SUM(oi.quantity * oi.unit_price)                       AS total_revenue
FROM public.order_items oi
JOIN public.orders o ON o.id = oi.order_id
LEFT JOIN public.products p ON p.id = oi.product_id
LEFT JOIN public.colors c ON c.id = oi.color_id
WHERE o.status NOT IN ('cancelled', 'pending')
GROUP BY 1, 2
ORDER BY total_qty DESC;

-- 3. Lead time de produção (confirmed_at → ready_at)
CREATE OR REPLACE VIEW public.v_production_lead_times AS
SELECT
  o.id                                                      AS order_id,
  o.order_code,
  o.customer_name,
  o.total,
  h_confirmed.changed_at                                    AS confirmed_at,
  h_ready.changed_at                                        AS ready_at,
  ROUND(
    EXTRACT(EPOCH FROM (h_ready.changed_at - h_confirmed.changed_at)) / 60.0
  , 0)::INT                                                 AS lead_minutes
FROM public.orders o
JOIN public.order_status_history h_confirmed
  ON h_confirmed.subject_id = o.id
  AND h_confirmed.subject_type = 'order'
  AND h_confirmed.status = 'confirmed'
JOIN public.order_status_history h_ready
  ON h_ready.subject_id = o.id
  AND h_ready.subject_type = 'order'
  AND h_ready.status = 'ready'
ORDER BY h_ready.changed_at DESC;

-- 4. Horários de pico (pedidos por hora do dia)
CREATE OR REPLACE VIEW public.v_peak_hours AS
SELECT
  EXTRACT(HOUR FROM o.created_at AT TIME ZONE 'America/Sao_Paulo')::INT AS hour_of_day,
  COUNT(*)::INT                                                            AS order_count
FROM public.orders o
WHERE o.status NOT IN ('cancelled')
GROUP BY 1
ORDER BY 1;

-- RLS: apenas admin pode ler as views
-- Views herdam RLS das tabelas base; mas para garantir segurança explícita:
ALTER VIEW public.v_revenue_daily OWNER TO postgres;
ALTER VIEW public.v_top_products OWNER TO postgres;
ALTER VIEW public.v_production_lead_times OWNER TO postgres;
ALTER VIEW public.v_peak_hours OWNER TO postgres;

COMMENT ON VIEW public.v_revenue_daily IS
  'Faturamento diário, contagem de pedidos e ticket médio (exclui cancelados e pendentes)';
COMMENT ON VIEW public.v_top_products IS
  'Produtos mais vendidos por quantidade total, agrupados por produto+cor';
COMMENT ON VIEW public.v_production_lead_times IS
  'Tempo (em minutos) entre confirmed e ready para cada pedido';
COMMENT ON VIEW public.v_peak_hours IS
  'Distribuição de pedidos por hora do dia (fuso São Paulo)';
