# Imagination 3D — Project Intelligence

## Visão Geral do Projeto
Plataforma de catálogo e vendas para startup de impressão 3D com Bambu Lab A1.
Integração com WhatsApp para finalização de pedidos.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Zustand · React Hook Form · Zod · Jest + Testing Library

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
| 6 — Deploy | **Próxima** | `phase/6-deploy` | — |

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
- `src/components/layout/Header.tsx` — logo, nav, link carrinho
- `src/components/layout/Footer.tsx` — links, WhatsApp, Instagram
- `src/components/catalog/ProductCard.tsx` — card com imagem, preço, badge, cores
- `src/components/catalog/ProductGrid.tsx` — grid 2-4 colunas, empty state
- `src/components/catalog/CategoryFilter.tsx` — filtro por categoria (Client Component)

### Páginas criadas
- `src/app/page.tsx` — Home: hero, features, produtos em destaque
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
│   ├── page.tsx                    # Home (Server Component)
│   ├── catalog/page.tsx            # Catálogo (Client Component)
│   ├── product/[slug]/page.tsx     # Produto (Server Component)
│   ├── cart/                       # FASE 3 — a criar
│   ├── custom-order/               # FASE 4 — a criar
│   └── admin/                      # FASE 5 — a criar
├── components/
│   ├── ui/                         # Primitivos (a criar conforme necessário)
│   ├── catalog/                    # ProductCard, ProductGrid, CategoryFilter
│   ├── cart/                       # FASE 3 — CartItem, CartSummary, CheckoutForm
│   ├── admin/                      # FASE 5 — a criar
│   └── layout/                     # Header, Footer
├── lib/
│   ├── supabase/                   # browser.ts, server.ts, queries.ts
│   ├── store/                      # FASE 3 — cartStore.ts (Zustand)
│   ├── utils/                      # formatters.ts, whatsapp.ts
│   └── validations/                # FASE 3/4 — Zod schemas
├── hooks/                          # useCart (FASE 3), useProducts, useAdmin
├── types/index.ts                  # Todos os tipos globais
└── __tests__/
    ├── unit/                       # formatters, whatsapp, ProductCard, CategoryFilter, Header
    ├── integration/                # a criar
    └── e2e/                        # FASE 6 — Playwright
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

## Fase 3 — Carrinho & WhatsApp (próxima)

### O que construir
- `src/lib/store/cartStore.ts` — Zustand com persistência localStorage
- `src/components/cart/CartItem.tsx` — item do carrinho (produto, cor, qtd, preço)
- `src/components/cart/CartSummary.tsx` — resumo com total
- `src/components/cart/CheckoutForm.tsx` — form: Nome, Telefone, Bairro, Cidade
- `src/app/cart/page.tsx` — página do carrinho
- Botão "Adicionar ao carrinho" na página de produto
- Contador de itens no Header

### Contrato do cartStore
```ts
interface CartStore {
  items: CartItem[]
  addItem(product, color, size, quantity): void
  removeItem(productId): void
  updateQuantity(productId, quantity): void
  clearCart(): void
  total: number
  itemCount: number
}
```

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
- Server Components por padrão; `'use client'` apenas quando necessário (interatividade, hooks)
- Nunca usar `any` no TypeScript
- Commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`

---

## Banco de Dados — Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://oflozudwutxgvwyvygll.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[em .env.local]
SUPABASE_SERVICE_ROLE_KEY=[em .env.local — nunca expor no cliente]
NEXT_PUBLIC_WHATSAPP_NUMBER=5511989525014
```
