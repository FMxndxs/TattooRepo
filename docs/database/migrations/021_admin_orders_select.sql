-- Migration 021: Add admin SELECT + DELETE policies for orders and order_items
-- Run this in the Supabase SQL Editor (project: oflozudwutxgvwyvygll)
--
-- Context: migration 020 added admin UPDATE for orders but missed SELECT,
-- causing the admin panel to return empty results despite orders existing.
-- This migration also adds DELETE so admins can remove orders from the panel.

-- ──────────────────────────────────────────────────────────────────────
-- 1. Admin can SELECT all orders
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_select_orders" ON public.orders;
CREATE POLICY "admin_select_orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────
-- 2. Admin can DELETE orders (order_items cascade automatically)
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_delete_orders" ON public.orders;
CREATE POLICY "admin_delete_orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────
-- 3. Admin can SELECT all order_items
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_select_order_items" ON public.order_items;
CREATE POLICY "admin_select_order_items"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────
-- 4. Admin can DELETE order_items (needed if cascade policy not enough)
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_delete_order_items" ON public.order_items;
CREATE POLICY "admin_delete_order_items"
  ON public.order_items FOR DELETE
  USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────
-- 5. Admin can DELETE custom_orders
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_delete_custom_orders" ON public.custom_orders;
CREATE POLICY "admin_delete_custom_orders"
  ON public.custom_orders FOR DELETE
  USING (public.is_admin());
