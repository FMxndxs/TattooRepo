-- Migration 008 — Corrigir imagens usando picsum.photos (preview confiável)
-- Substitui as URLs com falha (placehold.co SVG + Unsplash 404)
-- picsum.photos: fotos reais, seed determinístico (mesmo seed = mesma foto), sem API key
-- Execute no SQL Editor do Supabase Dashboard

UPDATE product_images SET url = 'https://picsum.photos/seed/vaso-geometrico/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'vaso-geometrico-low-poly');

UPDATE product_images SET url = 'https://picsum.photos/seed/raposa-escultura/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'escultura-low-poly-raposa');

UPDATE product_images SET url = 'https://picsum.photos/seed/plantas-hexagonal/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-plantas-hexagonal');

UPDATE product_images SET url = 'https://picsum.photos/seed/celular-suporte/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-celular-ajustavel');

UPDATE product_images SET url = 'https://picsum.photos/seed/cabos-organizer/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-cabos-clip');

UPDATE product_images SET url = 'https://picsum.photos/seed/panela-cozinha/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'descanso-de-panela-modular');

UPDATE product_images SET url = 'https://picsum.photos/seed/mesa-escritorio/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-mesa-premium');

UPDATE product_images SET url = 'https://picsum.photos/seed/headset-gamer/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-fone-gamer');

UPDATE product_images SET url = 'https://picsum.photos/seed/cartoes-visita/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-cartoes-de-visita');

UPDATE product_images SET url = 'https://picsum.photos/seed/dice-tower-rpg/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dice-tower-dobravel');

UPDATE product_images SET url = 'https://picsum.photos/seed/game-controller/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-controle-universal');

UPDATE product_images SET url = 'https://picsum.photos/seed/miniatures-rpg/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'kit-miniaturas-tabletop');

UPDATE product_images SET url = 'https://picsum.photos/seed/axolotl-toy/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'axolotl-articulado');

UPDATE product_images SET url = 'https://picsum.photos/seed/dragon-figure/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dragao-flexivel-print-in-place');

UPDATE product_images SET url = 'https://picsum.photos/seed/action-figure/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'boneco-articulado-modular');

UPDATE product_images SET url = 'https://picsum.photos/seed/makeup-brushes/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-pinceis-de-maquiagem');

UPDATE product_images SET url = 'https://picsum.photos/seed/lipstick-holder/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-giratorio-de-batons');

UPDATE product_images SET url = 'https://picsum.photos/seed/mirror-decorative/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'espelho-de-mesa-com-aro-decorativo');

UPDATE product_images SET url = 'https://picsum.photos/seed/bookmark-book/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'marca-paginas-personalizado');

UPDATE product_images SET url = 'https://picsum.photos/seed/gear-box-secret/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'mini-cofre-engrenagem');

UPDATE product_images SET url = 'https://picsum.photos/seed/key-holder-wall/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-chaves-geometrico');

UPDATE product_images SET url = 'https://picsum.photos/seed/3d-printing-custom/600/600'
WHERE product_id = (SELECT id FROM products WHERE slug = 'projeto-personalizado');

-- Verificação: todas as URLs devem iniciar com picsum.photos
-- SELECT p.name, pi.url FROM products p JOIN product_images pi ON pi.product_id = p.id ORDER BY p.name;
