-- Migration 103: corrige image_url do seed 003_portfolio.sql
-- Bug: o seed original usava o slug curto da URL de compartilhamento do Unsplash
-- (ex: photo-RBsrv4yV5KY) em vez do id real do asset (ex: photo-1479767574301-a01c78234a0c).
-- images.unsplash.com só serve pelo id real; todas as 14 fotos retornavam 404.
-- Ids reais confirmados via unsplash.com/napi/photos/<slug> e validados com HEAD (200).

UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1479767574301-a01c78234a0c?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-RBsrv4yV5KY?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1567071208639-716c1009517d?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-UVdrN_Wi4P0?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1597852075234-fd721ac361d3?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-5t4qCgtaLGU?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1601848714157-d845bb5c11ff?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-kZuIc5Jtmfc?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1513078094721-e7b6e0394a6a?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-B_VLJouyKR4?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1482329033286-79a3d24413b4?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-vKIc4k6dm10?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1561904361-d2033e1f0915?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo--AR3ywxDCCs?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1502224059837-040b7522ac54?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-SpzTGpBPDMw?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1588417490413-57973b627712?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-bWoig_hZxIU?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1600716741845-3291dc455e67?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-I16h9y_9yhw?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1564426622559-5af68da63b96?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-PWK6CeCJtJw?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1676178353565-50f4809e6c43?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-vMcx9QvPZLc?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1761276297612-f1a149dbdc1e?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-HJImUtsCnck?w=800&q=80&fit=crop';
UPDATE public.portfolio_items SET image_url = 'https://images.unsplash.com/photo-1686577677352-c9249ed5972a?w=800&q=80&fit=crop' WHERE image_url = 'https://images.unsplash.com/photo-uciI7h128_M?w=800&q=80&fit=crop';
