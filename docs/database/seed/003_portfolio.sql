-- Seed 003 — Portfólio inicial (Kadu Freitas Tattoo)
-- 14 trabalhos placeholder com fotos de tatuagem reais e livres de direitos
-- (Unsplash License — uso comercial livre, sem atribuição obrigatória).
-- NÃO são trabalhos do Kadu: servem só para o site nascer com conteúdo visual
-- coerente. Substituir pelas fotos reais do estúdio pelo admin (/admin/portfolio)
-- antes de divulgar o site.
--
-- Execute APÓS a migration 102_portfolio_placement.sql (coluna body_placement).

INSERT INTO portfolio_items (title, image_url, style, body_placement, sort_order) VALUES
  ('Blackwork geométrico',        'https://images.unsplash.com/photo-1479767574301-a01c78234a0c?w=800&q=80&fit=crop', 'Blackwork',      'braço',     10),
  ('Fineline floral',             'https://images.unsplash.com/photo-1567071208639-716c1009517d?w=800&q=80&fit=crop', 'Fineline',       'perna',     20),
  ('Cover-up old school',         'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=800&q=80&fit=crop', 'Old School',     'braço',     30),
  ('Neo-tradicional colorido',    'https://images.unsplash.com/photo-1601848714157-d845bb5c11ff?w=800&q=80&fit=crop', 'Neo-tradicional','perna',     40),
  ('Realismo em processo',        'https://images.unsplash.com/photo-1513078094721-e7b6e0394a6a?w=800&q=80&fit=crop', 'Realismo',       'braço',     50),
  ('Pontilhismo no antebraço',    'https://images.unsplash.com/photo-1482329033286-79a3d24413b4?w=800&q=80&fit=crop', 'Pontilhismo',    'antebraço', 60),
  ('Blackwork nas costas',        'https://images.unsplash.com/photo-1561904361-d2033e1f0915?w=800&q=80&fit=crop', 'Blackwork',      'costas',    70),
  ('Tribal na mão',               'https://images.unsplash.com/photo-1502224059837-040b7522ac54?w=800&q=80&fit=crop', 'Tribal',         'mão',       80),
  ('Minimalista — seta',          'https://images.unsplash.com/photo-1588417490413-57973b627712?w=800&q=80&fit=crop', 'Minimalista',    'mão',       90),
  ('Fineline na mão',             'https://images.unsplash.com/photo-1600716741845-3291dc455e67?w=800&q=80&fit=crop', 'Fineline',       'mão',      100),
  ('Lettering no antebraço',      'https://images.unsplash.com/photo-1564426622559-5af68da63b96?w=800&q=80&fit=crop', 'Lettering',      'antebraço',110),
  ('Old school no peito',         'https://images.unsplash.com/photo-1676178353565-50f4809e6c43?w=800&q=80&fit=crop', 'Old School',     'peito',    120),
  ('Realismo no peito',           'https://images.unsplash.com/photo-1761276297612-f1a149dbdc1e?w=800&q=80&fit=crop', 'Realismo',       'peito',    130),
  ('Blackwork no peito',          'https://images.unsplash.com/photo-1686577677352-c9249ed5972a?w=800&q=80&fit=crop', 'Blackwork',      'peito',    140)
ON CONFLICT (image_url) DO NOTHING;
