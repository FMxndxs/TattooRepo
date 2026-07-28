-- Migration 102: local do corpo no portfólio (Cycle A — filtros)
-- Base para filtrar /portfolio por estilo + local do corpo, junto com a
-- coluna `style` já existente (100_tattoo_domain.sql).

ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS body_placement text;

-- Evita duplicar a mesma foto e permite seed idempotente via ON CONFLICT (image_url).
ALTER TABLE public.portfolio_items
  ADD CONSTRAINT portfolio_items_image_url_key UNIQUE (image_url);

CREATE INDEX IF NOT EXISTS portfolio_items_style_idx
  ON public.portfolio_items (style);

CREATE INDEX IF NOT EXISTS portfolio_items_body_placement_idx
  ON public.portfolio_items (body_placement);
