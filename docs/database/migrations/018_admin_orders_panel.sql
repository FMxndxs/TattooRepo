-- Migration 018: Admin orders panel
-- Adds customer info to orders, unified status values, and UPDATE RLS policies
-- Run this in the Supabase SQL Editor (project: oflozudwutxgvwyvygll)

-- 1. Add customer info columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '';

-- 2. Add new status values to order_status enum (aditivo, mantém dados existentes)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'in_production';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'completed';

-- 3. Extend custom_orders status CHECK constraint to include new unified statuses
ALTER TABLE public.custom_orders
  DROP CONSTRAINT IF EXISTS custom_orders_status_check;

ALTER TABLE public.custom_orders
  ADD CONSTRAINT custom_orders_status_check
  CHECK (status IN (
    'pending', 'reviewing', 'quoted', 'accepted', 'rejected',
    'in_production', 'completed', 'cancelled'
  ));

-- 4. UPDATE RLS policy for orders (admin can update any order status)
CREATE POLICY "orders_update_authenticated"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. UPDATE RLS policy for custom_orders (admin can update any custom order status)
-- First enable RLS if not already (schema.sql may or may not have it)
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_orders_update_authenticated"
  ON public.custom_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Ensure custom_orders SELECT is accessible to authenticated users (admin reads)
DO $$ BEGIN
  CREATE POLICY "custom_orders_select_authenticated"
    ON public.custom_orders FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
