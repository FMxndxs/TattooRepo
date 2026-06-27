-- Migration 035: Hardening idempotente das políticas RLS
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- Contexto: o schema.sql original (baseline) tinha políticas fracas que foram
-- corrigidas pelas migrations 020, 021 e 032. Esta migration garante o estado
-- final correto de forma idempotente — segura para rodar mesmo que alguma das
-- migrations anteriores não tenha sido aplicada ou tenha sido revertida.
--
-- Políticas antigas que esta migration elimina (se ainda existirem):
--   • "Public insert custom_orders"  → WITH CHECK(true) — qualquer anon inseria
--   • "Admin all *"                  → auth.role()='authenticated' — qualquer logado era admin
--   • "Admin read custom_orders"     → auth.role()='authenticated'
--   • "orders_update_authenticated"  → USING(true) — qualquer logado alterava pedidos
--   • "custom_orders_update_authenticated" → USING(true)
--   • "custom_orders_select_authenticated" → USING(true)
--
-- Políticas corretas que esta migration garante:
--   • admin_* → USING(public.is_admin()) — só contas com is_admin=true
--   • custom_orders_insert_own → WITH CHECK(auth.uid() = user_id) — auth obrigatória
--   • custom_orders_select_own → USING(auth.uid() = user_id) — cliente vê só os seus

-- ─── 1. Garante que public.is_admin() existe ─────────────────────────────────
-- (criada pela 020; recriada aqui para ser segura se 020 não rodou)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- ─── 2. Limpa políticas fracas legadas ───────────────────────────────────────

-- orders
DROP POLICY IF EXISTS "orders_update_authenticated"   ON public.orders;

-- custom_orders
DROP POLICY IF EXISTS "Public insert custom_orders"         ON public.custom_orders;
DROP POLICY IF EXISTS "Admin read custom_orders"            ON public.custom_orders;
DROP POLICY IF EXISTS "custom_orders_update_authenticated"  ON public.custom_orders;
DROP POLICY IF EXISTS "custom_orders_select_authenticated"  ON public.custom_orders;

-- catalog (schema baseline usava auth.role()='authenticated')
DROP POLICY IF EXISTS "Admin all categories"     ON public.categories;
DROP POLICY IF EXISTS "Admin all products"       ON public.products;
DROP POLICY IF EXISTS "Admin all product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin all colors"         ON public.colors;
DROP POLICY IF EXISTS "Admin all product_colors" ON public.product_colors;
DROP POLICY IF EXISTS "Admin all product_sizes"  ON public.product_sizes;

-- ─── 3. Garante políticas corretas (idempotentes via DROP IF EXISTS + CREATE) ─

-- orders — admin update
DROP POLICY IF EXISTS "admin_update_orders" ON public.orders;
CREATE POLICY "admin_update_orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- orders — admin select
DROP POLICY IF EXISTS "admin_select_orders" ON public.orders;
CREATE POLICY "admin_select_orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- orders — admin delete
DROP POLICY IF EXISTS "admin_delete_orders" ON public.orders;
CREATE POLICY "admin_delete_orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- custom_orders — RLS habilitada
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- custom_orders — insert só para usuário autenticado inserindo o próprio user_id
DROP POLICY IF EXISTS "custom_orders_insert_own" ON public.custom_orders;
CREATE POLICY "custom_orders_insert_own"
  ON public.custom_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- custom_orders — select do próprio cliente
DROP POLICY IF EXISTS "custom_orders_select_own" ON public.custom_orders;
CREATE POLICY "custom_orders_select_own"
  ON public.custom_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- custom_orders — admin select
DROP POLICY IF EXISTS "admin_select_custom_orders" ON public.custom_orders;
CREATE POLICY "admin_select_custom_orders"
  ON public.custom_orders FOR SELECT
  USING (public.is_admin());

-- custom_orders — admin update
DROP POLICY IF EXISTS "admin_update_custom_orders" ON public.custom_orders;
CREATE POLICY "admin_update_custom_orders"
  ON public.custom_orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- custom_orders — admin delete
DROP POLICY IF EXISTS "admin_delete_custom_orders" ON public.custom_orders;
CREATE POLICY "admin_delete_custom_orders"
  ON public.custom_orders FOR DELETE
  USING (public.is_admin());

-- catalog — admin via is_admin() (substitui as antigas "auth.role()='authenticated'")
DROP POLICY IF EXISTS "Admin all categories"     ON public.categories;
CREATE POLICY "Admin all categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all products"       ON public.products;
CREATE POLICY "Admin all products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all product_images" ON public.product_images;
CREATE POLICY "Admin all product_images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all colors"         ON public.colors;
CREATE POLICY "Admin all colors"
  ON public.colors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all product_colors" ON public.product_colors;
CREATE POLICY "Admin all product_colors"
  ON public.product_colors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all product_sizes"  ON public.product_sizes;
CREATE POLICY "Admin all product_sizes"
  ON public.product_sizes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── Notas ───────────────────────────────────────────────────────────────────
-- Políticas mantidas intactas (corretas, não alteradas aqui):
--   • "Public read *"          — catálogo público de leitura (orders/product/etc.)
--   • "orders_select_own"      — cliente vê seus próprios pedidos
--   • "orders_insert_own"      — cliente cria pedidos sob seu user_id
--   • admin_select/delete order_items — criadas pela 021
