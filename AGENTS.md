# Imagination 3D — Orientação para agentes (Cursor / Claude)

## Fonte de verdade

Detalhes completos do projeto estão em **`CLAUDE.md`** (arquitetura, pastas, WhatsApp, DB, convenções). Use este arquivo como índice rápido; não duplique páginas inteiras do `CLAUDE.md` sem necessidade.

## Stack (resumo)

- Next.js 16 (App Router), TypeScript, Tailwind v4 (`@theme inline` em `src/app/globals.css`)
- Supabase (projeto `oflozudwutxgvwyvygll`) — `createClient()` de `@/lib/supabase/browser` (client) ou `server` (RSC)
- Zustand (`cartStore`), RHF + Zod, Jest + Testing Library, **Motion** (`import from 'motion/react'`)
- WhatsApp pedidos: **5511989525014**

## Regras que evitam regressão

1. **Paleta:** usar **`brand-*`**; nunca **`orange-*`**.
2. **`next/image` com `fill`:** sempre informar **`sizes`** (performance).
3. **Filtro de categoria no Supabase:** **não** usar `.eq('category.slug', …)` no `from('products')` — o PostgREST não filtra assim. Resolver `categories.slug` → `id` e usar **`.eq('category_id', id)`** (vide `src/app/catalog/page.tsx` e `src/lib/supabase/queries.ts`).
4. **Migrations vs seed:** o seed `docs/database/seed/001_products.sql` usa **slugs curtos** (ex. `suporte-plantas-hexagonal`); scripts 007–009 usavam slugs com `de/` diferentes e podiam **não atualizar URLs**. Correção consolidada: **`docs/database/migrations/010_fix_image_urls_seed_slugs.sql`**.
5. **`prefers-reduced-motion`:** animações devem degradar (vide `useReducedMotion()` em Motion e regras em `globals.css`).

## UI — tema “impressão 3D”

- **MotionPrimitives:** `LayerReveal`, `StaggerGroup`, `PrintLineHover` (`src/components/ui/MotionPrimitives.tsx`)
- **Extras:** `PrintCtaLink`, `PrintLayerSkeleton` / `PrintLayerSkeletonGrid`, `FilamentBackdrop` (`src/components/ui/`)
- **Body:** classe `print-buildplate-bg` no layout; CTAs e header usam `PrintCtaLink` onde aplicável
- **ProductCard:** client component — tilt suave + `PrintLineHover` na imagem

## Next.js 16

Há aviso no topo histórico sobre diferenças de API; em dúvida, conferir docs do pacote ou `next.config`.

## TDD

Preferir Red → Green → Blue; manter `npm test` e `npm run build` verdes antes de entregar.
