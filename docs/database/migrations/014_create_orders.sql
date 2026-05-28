-- Migration 014: Create orders and order_items tables
-- Run this in the Supabase SQL Editor

-- 1. Create order status enum
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       order_status NOT NULL DEFAULT 'pending',
  total        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  neighborhood TEXT NOT NULL DEFAULT '',
  city         TEXT NOT NULL DEFAULT '',
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id),
  color_id    UUID REFERENCES public.colors(id),
  size_id     UUID REFERENCES public.product_sizes(id),
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items(product_id);

-- 5. Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for orders
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_service_role_all"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role');

-- 7. RLS Policies for order_items
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_service_role_all"
  ON public.order_items FOR ALL
  USING (auth.role() = 'service_role');
