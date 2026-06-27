# Imagination 3D — Project Intelligence

## Visão geral
Plataforma de catálogo e vendas para startup de impressão 3D com Bambu Lab. Finalização de pedidos via WhatsApp.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Zustand · React Hook Form · Zod · Jest + Testing Library · Motion (`motion/react`)

**WhatsApp:** (11) 98952-5014 → `5511989525014`  
**GitHub:** https://github.com/FMxndxs  
**Conta Git:** FMxndxs / felipemendescampos40@gmail.com  
**Supabase project:** oflozudwutxgvwyvygll  

**Memórias relacionadas:** `.cursorrules`, `AGENTS.md` (índice rápido para agentes)

---

## Status das fases

| Fase | Status | Branch | Notas |
|------|--------|--------|--------|
| 1–5 | Concluídas | `phase/*` | Foundation → Admin |
| **6.1 — Design & catálogo** | Avançada | `phase/6-design-refresh` | Tema 3D, filtros corretos, migrations 010, ~104 testes |
| 6.2 — Deploy & SEO | Próxima | `phase/6-deploy` | — |

---

## Sistema de design

### Paleta — brand `#431370`

| Token | Valor | Uso |
|-------|-------|-----|
| `brand-300` | `#b683ff` | Preços, destaques |
| `brand-500` | `#6a2ba8` | Hover de botões |
| `brand-700` | `#431370` | **Primária** |
| `brand-glow` | `rgba(67,19,112,0.45)` | Sombras CTA |

Definidos em `src/app/globals.css` via `@theme inline`. **Nunca usar `orange-*`.**

### Logo
`public/logo.png` · `<Image src="/logo.png" alt="Imagination 3D" width={36} height={36} />`

### Animações — tema “impressão 3D”
- **`src/components/ui/MotionPrimitives.tsx`**  
  - `LayerReveal`, `StaggerGroup` — respeitam **`useReducedMotion()`**  
  - `PrintLineHover` — hover com **duas linhas** estilo camada (CSS + `group/printlh`)
- **`src/components/ui/PrintCtaLink.tsx`** — CTAs com lift/tap (Motion) + sheen `print-cta-filament` no hover
- **`src/components/ui/PrintLayerSkeleton.tsx`** — skeleton de grid (camadas + “hotline”)
- **`src/components/ui/FilamentBackdrop.tsx`** — hero decorativo (grade + pulso de luz; reduzido sem loop)

**CSS em `globals.css`:** `filament-grid`, `filament-rise`, `extrusion-scan`, `print-buildplate-bg`, `print-cta-sheen`, `print-extrusion-shimmer`, `.print-header-glow`, etc. + `@media (prefers-reduced-motion: reduce)`.

**`next/image`:** com **`fill`**, sempre definir **`sizes`** (ProductCard, ProductDetail, CartItem, ImageUpload).

---

## Catálogo Supabase — comportamento correto

### Filtro por categoria
`.eq('category.slug', slug)` no cliente PostgREST **não filtra** a relação embutida da forma esperada; a listagem acaba trazendo todos os produtos.

**Padrão correto:** obter o `id` em `categories` pelo `slug` e filtrar **`products.category_id`**.  
Implementação: `src/app/catalog/page.tsx` e `getProducts()` em `src/lib/supabase/queries.ts`.

### Categorias (8)
decoração · utilitários · escritório · games · bonecos · maquiagem · brindes · personalizados (slugs ASCII em `categories.slug`).

---

## Banco de dados

**Schema:** `docs/database/schema.sql`  
**Seed produtos:** `docs/database/seed/001_products.sql` (22 produtos; slugs **curtos**, ex. `suporte-plantas-hexagonal`).

**Migrations em `docs/database/migrations/`**  
- **006** — categorias extras  
- **007–009** — URLs de imagens (atenção: slugs SQL às vezes divergiam do seed)  
- **010 — `010_fix_image_urls_seed_slugs.sql`** — alinha `UPDATE` aos slugs do seed + `INSERT` de `product_images` para produtos sem imagem  

Rodar **010** no SQL Editor do Supabase se ainda houver placeholders ou updates que não bateram linhas.

---

## O que já existe (não recriar)

### Tipos — `src/types/index.ts`
`Product`, `Category`, `Color`, `ProductSize`, `ProductImage`, `CartItem`, `CustomerInfo`, `CustomOrder`, etc.

### Utilitários — `src/lib/utils/`
`formatBRL`, `formatPhone`, `slugify` · `whatsapp.ts` (`buildWhatsAppUrl`, …)

### Supabase — `src/lib/supabase/`
- `browser.ts` / `server.ts` — `createClient()`  
- `queries.ts` — `getCategories`, `getProducts` (filtro por slug via `category_id`), `getFeaturedProducts`, `getProductBySlug`

### Componentes (resumo)
- **Layout:** `Header` (PrintCtaLink, micro-motion no logo), `Footer`, `CartIcon`, `AdminSidebar`  
- **Catálogo:** `ProductCard` (client, tilt + PrintLineHover), `ProductGrid`, `CategoryFilter` (motion pills), `AddToCartButton` (motion + sheen)  
- **Carrinho / custom-order / admin:** como antes  

### Páginas
- `app/page.tsx` — FilamentBackdrop, PrintCtaLink, NozzleWarmBadge  
- `app/catalog/page.tsx` — loading `PrintLayerSkeletonGrid`  
- `app/layout.tsx` — body com `print-buildplate-bg`  
- `app/product/[slug]/` — `ProductDetail` + PrintLineHover na foto  

---

## Arquitetura de pastas (resumida)

```
src/
├── app/                 # App Router, globals.css
├── components/
│   ├── ui/              # MotionPrimitives, PrintCtaLink, PrintLayerSkeleton, FilamentBackdrop
│   ├── catalog/, cart/, custom-order/, admin/, layout/
├── lib/supabase/, lib/store/, lib/utils/, lib/validations/
├── types/index.ts
└── __tests__/unit/
```

---

## TDD — Red → Green → Blue

Red: teste falha · Green: mínimo para passar · Blue: refatorar mantendo `npm test` e `npm run build` verdes.

---

## WhatsApp

`5511989525014` · `src/lib/utils/whatsapp.ts`

---

## Convenções

- `'use client'` só quando necessário  
- Sem `any`  
- Commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`  
- **brand-***, não orange-*

---

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://oflozudwutxgvwyvygll.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[.env.local]
SUPABASE_SERVICE_ROLE_KEY=[.env.local — só servidor]
NEXT_PUBLIC_WHATSAPP_NUMBER=5511989525014
NEXT_PUBLIC_SITE_URL=[produção]
REPORTS_API_KEY=[.env.local e Vercel — chave de 64 chars hex para GET /api/reports]
```
