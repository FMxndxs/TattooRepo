-- Seed 003 — Portfólio inicial (Kadu Freitas Tattoo)
-- 14 trabalhos placeholder com fotos de tatuagem reais e livres de direitos
-- (Unsplash License — uso comercial livre, sem atribuição obrigatória).
-- NÃO são trabalhos do Kadu: servem só para o site nascer com conteúdo visual
-- coerente. Substituir pelas fotos reais do estúdio pelo admin (/admin/portfolio)
-- antes de divulgar o site.
--
-- Execute APÓS a migration 102_portfolio_placement.sql (coluna body_placement).

INSERT INTO portfolio_items (title, image_url, style, body_placement, sort_order) VALUES
  ('Blackwork geométrico',        'https://images.unsplash.com/photo-RBsrv4yV5KY?w=800&q=80&fit=crop', 'Blackwork',      'braço',     10),
  ('Fineline floral',             'https://images.unsplash.com/photo-UVdrN_Wi4P0?w=800&q=80&fit=crop', 'Fineline',       'perna',     20),
  ('Cover-up old school',         'https://images.unsplash.com/photo-5t4qCgtaLGU?w=800&q=80&fit=crop', 'Old School',     'braço',     30),
  ('Neo-tradicional colorido',    'https://images.unsplash.com/photo-kZuIc5Jtmfc?w=800&q=80&fit=crop', 'Neo-tradicional','perna',     40),
  ('Realismo em processo',        'https://images.unsplash.com/photo-B_VLJouyKR4?w=800&q=80&fit=crop', 'Realismo',       'braço',     50),
  ('Pontilhismo no antebraço',    'https://images.unsplash.com/photo-vKIc4k6dm10?w=800&q=80&fit=crop', 'Pontilhismo',    'antebraço', 60),
  ('Blackwork nas costas',        'https://images.unsplash.com/photo--AR3ywxDCCs?w=800&q=80&fit=crop', 'Blackwork',      'costas',    70),
  ('Tribal na mão',               'https://images.unsplash.com/photo-SpzTGpBPDMw?w=800&q=80&fit=crop', 'Tribal',         'mão',       80),
  ('Minimalista — seta',          'https://images.unsplash.com/photo-bWoig_hZxIU?w=800&q=80&fit=crop', 'Minimalista',    'mão',       90),
  ('Fineline na mão',             'https://images.unsplash.com/photo-I16h9y_9yhw?w=800&q=80&fit=crop', 'Fineline',       'mão',      100),
  ('Lettering no antebraço',      'https://images.unsplash.com/photo-PWK6CeCJtJw?w=800&q=80&fit=crop', 'Lettering',      'antebraço',110),
  ('Old school no peito',         'https://images.unsplash.com/photo-vMcx9QvPZLc?w=800&q=80&fit=crop', 'Old School',     'peito',    120),
  ('Realismo no peito',           'https://images.unsplash.com/photo-HJImUtsCnck?w=800&q=80&fit=crop', 'Realismo',       'peito',    130),
  ('Blackwork no peito',          'https://images.unsplash.com/photo-uciI7h128_M?w=800&q=80&fit=crop', 'Blackwork',      'peito',    140)
ON CONFLICT (image_url) DO NOTHING;
