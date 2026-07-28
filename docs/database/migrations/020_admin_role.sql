-- Migration 020: Admin role — restrict /admin to designated accounts
-- Run this in the Supabase SQL Editor (project: oflozudwutxgvwyvygll)
--
-- After running, mark the owner account as admin:
--   UPDATE public.profiles SET is_admin = true
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'EMAIL_DO_DONO');

-- ──────────────────────────────────────────────────────────────────────
-- 1. Add is_admin column to profiles
-- ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- ──────────────────────────────────────────────────────────────────────
-- 2. Helper function — SECURITY DEFINER avoids RLS recursion on profiles
-- ──────────────────────────────────────────────────────────────────────
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

-- ──────────────────────────────────────────────────────────────────────
-- 3. Tighten admin policies — replace "any authenticated" with is_admin()
-- ──────────────────────────────────────────────────────────────────────

-- categories
DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
CREATE POLICY "Admin all categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- products
DROP POLICY IF EXISTS "Admin all products" ON public.products;
CREATE POLICY "Admin all products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_images
DROP POLICY IF EXISTS "Admin all product_images" ON public.product_images;
CREATE POLICY "Admin all product_images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- colors
DROP POLICY IF EXISTS "Admin all colors" ON public.colors;
CREATE POLICY "Admin all colors"
  ON public.colors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_colors
DROP POLICY IF EXISTS "Admin all product_colors" ON public.product_colors;
CREATE POLICY "Admin all product_colors"
  ON public.product_colors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_sizes
DROP POLICY IF EXISTS "Admin all product_sizes" ON public.product_sizes;
CREATE POLICY "Admin all product_sizes"
  ON public.product_sizes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- custom_orders read (migration 018 created "custom_orders_select_authenticated")
-- Note: custom_orders has no user_id column — it's anonymous (submitted via WhatsApp flow)
DROP POLICY IF EXISTS "custom_orders_select_authenticated" ON public.custom_orders;
DROP POLICY IF EXISTS "Admin read custom_orders" ON public.custom_orders;
CREATE POLICY "admin_select_custom_orders"
  ON public.custom_orders FOR SELECT
  USING (public.is_admin());

-- custom_orders update (migration 018 created "custom_orders_update_authenticated")
DROP POLICY IF EXISTS "custom_orders_update_authenticated" ON public.custom_orders;
CREATE POLICY "admin_update_custom_orders"
  ON public.custom_orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- orders update (migration 018 created "orders_update_authenticated")
DROP POLICY IF EXISTS "orders_update_authenticated" ON public.orders;
CREATE POLICY "admin_update_orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────
-- NOTE: Public read policies and "Public insert custom_orders" are kept
-- unchanged — customers still browse the catalogue and submit requests.
-- orders SELECT policy "orders_select_own" (auth.uid() = user_id) is
-- also kept — customers still see their own order history.
-- ──────────────────────────────────────────────────────────────────────
