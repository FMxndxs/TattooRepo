-- Migration 007 — Atualizar imagens dos produtos para Unsplash (preview)
-- Substitui os placeholders placehold.co por fotos reais do Unsplash (licença gratuita)
-- Execute no SQL Editor do Supabase Dashboard

UPDATE product_images SET url = 'https://images.unsplash.com/photo-P2XLjOJkWgU?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'vaso-geometrico-low-poly');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-cON53r2yBsg?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'escultura-low-poly-raposa');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-avJHQHECeq8?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-plantas-hexagonal');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-NHtMs8Itsz4?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-celular-ajustavel');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-I_3D0pVrMhY?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-cabos-clip');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-WmyqQswv-F4?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'descanso-de-panela-modular');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-XzAcS0l576E?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-mesa-premium');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-Bd05yxTsQoY?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-fone-gamer');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-x94gvcJ7Ux0?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-cartoes-de-visita');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-YqFhPpGs3a0?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dice-tower-dobravel');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-OHD3IcfDyXY?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-de-controle-universal');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-X-A-LJVAhzk?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'kit-miniaturas-tabletop');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-f67pmGPAFAU?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'axolotl-articulado');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-raAbNMwmJ_Y?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'dragao-flexivel-print-in-place');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-HVZ8hnt-I4c?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'boneco-articulado-modular');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-pr5IdQZH8fo?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'organizador-de-pinceis-de-maquiagem');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-bjGYfHeGtg4?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'suporte-giratorio-de-batons');

UPDATE product_images SET url = 'https://images.unsplash.com/photo--lqVeD9ieGc?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'espelho-de-mesa-com-aro-decorativo');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-5obrIe6mUOQ?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'marca-paginas-personalizado');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-gaqIs7Y_2GA?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'mini-cofre-engrenagem');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-2a84S6mKHO0?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'porta-chaves-geometrico');

UPDATE product_images SET url = 'https://images.unsplash.com/photo-J07GiRaABpk?w=600&h=600&fit=crop&crop=center'
WHERE product_id = (SELECT id FROM products WHERE slug = 'projeto-personalizado');

-- Verificação
-- SELECT p.name, pi.url FROM products p JOIN product_images pi ON pi.product_id = p.id ORDER BY p.name;
