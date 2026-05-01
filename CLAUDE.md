# Imagination 3D — Project Intelligence

## Visão Geral do Projeto
Plataforma de catálogo e vendas para startup de impressão 3D com Bambu Lab A1.
Integração com WhatsApp para finalização de pedidos.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Zustand · React Hook Form · Zod · Jest + Testing Library · Motion 12 (animações)

**WhatsApp de pedidos:** (11) 98952-5014 → `5511989525014`
**GitHub:** https://github.com/FMxndxs
**Conta Git:** FMxndxs / felipemendescampos40@gmail.com
**Supabase project:** oflozudwutxgvwyvygll

---

## Status das Fases

| Fase | Status | Branch | Testes |
|------|--------|--------|--------|
| 1 — Foundation | Concluída | `phase/1-foundation` | 19 verdes |
| 2 — Catálogo | Concluída | `phase/2-catalog` | 34 verdes |
| 3 — Carrinho & WhatsApp | Concluída | `phase/3-cart` | 51 verdes |
| 4 — Pedido Personalizado | Concluída | `phase/4-custom-order` | 64 verdes |
| 5 — Dashboard Admin | Concluída | `phase/5-admin` | 83 verdes |
| **6.1 — Design Refresh & Catálogo** | **Em andamento** | `phase/6-design-refresh` | — |
| 6.2 — Deploy final & SEO | Próxima | `phase/6-deploy` | — |

---

## Sistema de Design

### Paleta de Cores — Brand `#431370`

| Token | Valor | Uso |
|-------|-------|-----|
| `brand-50` | `#f6f0ff` | Fundos muito claros |
| `brand-300` | `#b683ff` | Textos de acento, preços, badges |
| `brand-400` | `#8b4fd4` | Ícones, links hover |
| `brand-500` | `#6a2ba8` | Hover de botões |
| `brand-700` | `#431370` | **COR PRIMÁRIA** — botões, badges destaque |
| `brand-900` | `#1f0735` | Gradientes de fundo |
| `brand-glow` | `rgba(67,19,112,0.45)` | Sombra de botões CTA |

Definidos em `src/app/globals.css` via `@theme inline` (Tailwind v4).
**Nunca usar `orange-*` — paleta migrada completamente para `brand-*`.**

### Logo
Arquivo: `public/logo.png` (copiado de `src/assets/imagination-logo.PNG`)
Uso: `<Image src="/logo.png" alt="Imagination 3D" width={36} height={36} />`

### Animações (Motion 12)
Primitivos em `src/components/ui/MotionPrimitives.tsx`:
- `LayerReveal` — entrada de cima pra baixo com stagger (hero, seções)
- `StaggerGroup` — anima filhos em sequência ao entrar na viewport
- `PrintLineHover` — linha de varredura horizontal no hover de imagens

Keyframes CSS em `src/app/globals.css`: `layer-build`, `nozzle-pulse`, `print-sweep`, `filament-drip`

---

## Catálogo — Estado atual

**Categorias (8):**
1. Decoração (`decoracao`)
2. Utilitários (`utilitarios`)
3. Escritório (`escritorio`)
4. Games (`games`)
5. Bonecos & Colecionáveis (`bonecos`) — nova
6. Maquiagem & Beleza (`maquiagem`) — nova
7. Brindes & Presentes (`brindes`) — nova
8. Personalizados (`personalizados`)

**Migrações pendentes de executar no Supabase:**
- `docs/database/migrations/006_add_categories.sql` — adiciona categorias 5-7
- `docs/database/seed/001_products.sql` — insere 22 produtos com imagens placeholder

---

## O que já existe (não recriar)

### Tipos — `src/types/index.ts`
`Product`, `Category`, `Color`, `ProductSize`, `ProductImage`, `CartItem`, `CustomerInfo`, `CustomOrder`, `WhatsAppOrderPayload`

### Utilitários — `src/lib/utils/`
- `formatters.ts` → `formatBRL(value)`, `formatPhone(phone)`, `slugify(text)`
- `whatsapp.ts` → `buildWhatsAppMessage(payload)`, `buildWhatsAppUrl(payload)`

### Supabase — `src/lib/supabase/`
- `browser.ts` → `createClient()` para Client Components
- `server.ts` → `createClient()` para Server Components / Route Handlers
- `queries.ts` → `getCategories()`, `getProducts(slug?)`, `getFeaturedProducts()`, `getProductBySlug(slug)`

### Componentes criados
- `src/components/layout/Header.tsx` — logo PNG, nav com underline animado, carrinho
- `src/components/layout/Footer.tsx` — logo PNG, links, WhatsApp, Instagram
- `src/components/catalog/ProductCard.tsx` — card com imagem, preço brand-300, badge brand-700, cores
- `src/components/catalog/ProductGrid.tsx` — grid 2-4 colunas, empty state
- `src/components/catalog/CategoryFilter.tsx` — filtro por categoria (Client Component)
- `src/components/ui/MotionPrimitives.tsx` — LayerReveal, StaggerGroup, PrintLineHover

### Páginas criadas
- `src/app/page.tsx` — Home: hero animado (LayerReveal), features (StaggerGroup), produtos em destaque
- `src/app/catalog/page.tsx` — Listagem com filtro client-side
- `src/app/product/[slug]/page.tsx` — Detalhe: imagem, specs, cores, CTA WhatsApp

### Banco de Dados (Supabase — já executado)
Tabelas: `categories`, `products`, `product_images`, `colors`, `product_colors`, `product_sizes`, `custom_orders`
Schema completo: `docs/database/schema.sql`

---

## Arquitetura de Pastas

```
src/
├── app/
│   ├── page.tsx                    # Home (Client Component — usa motion)
│   ├── catalog/page.tsx            # Catálogo (Client Component)
│   ├── product/[slug]/page.tsx     # Produto (Server Component)
│   ├── cart/page.tsx               # Carrinho (Fase 3 — concluída)
│   ├── custom-order/page.tsx       # Pedido Personalizado (Fase 4 — concluída)
│   └── admin/                      # Dashboard Admin (Fase 5 — concluída)
├── components/
│   ├── ui/                         # MotionPrimitives.tsx
│   ├── catalog/                    # ProductCard, ProductGrid, CategoryFilter, AddToCartButton
│   ├── cart/                       # CartItem, CartSummary, CheckoutForm
│   ├── custom-order/               # CustomOrderForm, ImageUpload
│   ├── admin/                      # ProductForm, ProductTable, StockToggle
│   └── layout/                     # Header, Footer, CartIcon, AdminSidebar
├── lib/
│   ├── supabase/                   # browser.ts, server.ts, queries.ts
│   ├── store/                      # cartStore.ts (Zustand)
│   ├── utils/                      # formatters.ts, whatsapp.ts
│   └── validations/                # Zod schemas (checkoutSchema, customOrderSchema, productFormSchema)
├── hooks/
├── types/index.ts                  # Todos os tipos globais
└── __tests__/
    ├── unit/                       # 83+ testes
    └── e2e/                        # FASE 6.2 — Playwright
```

---

## Metodologia TDD — Red → Green → Blue

Obrigatório em cada fase:

| Etapa | Ação |
|-------|------|
| **Red** | Escrever testes que falham (definir contrato da feature) |
| **Green** | Implementar o mínimo para os testes passarem |
| **Blue** | Refatorar mantendo todos os testes verdes + `npm run build` sem erros |

---

## Integração WhatsApp

Número: `5511989525014`
Gerador pronto: `src/lib/utils/whatsapp.ts` → `buildWhatsAppUrl(payload)`

Formato da mensagem:
```
Novo Pedido — Imagination 3D

Cliente: Joao Silva
Telefone: (11) 98765-4321
Bairro: Vila Madalena / SP

Itens:
- Suporte de Fone (Preto) x2 — R$ 59,80

Total: R$ 59,80

Pedido gerado pelo site Imagination 3D
```

---

## Convenções de Código

- Componentes: PascalCase, um arquivo por componente
- Hooks: prefixo `use`
- `'use client'` quando necessário (interatividade, hooks, motion)
- Nunca usar `any` no TypeScript
- Commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **Paleta:** sempre `brand-*` — nunca `orange-*`

---

## Banco de Dados — Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://oflozudwutxgvwyvygll.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[em .env.local]
SUPABASE_SERVICE_ROLE_KEY=[em .env.local — nunca expor no cliente]
NEXT_PUBLIC_WHATSAPP_NUMBER=5511989525014
```
