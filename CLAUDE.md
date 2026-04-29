# Imagination 3D — Project Intelligence

## Visão Geral do Projeto
Plataforma de catálogo e vendas para startup de impressão 3D com Bambu Lab A1.
Integração com WhatsApp para finalização de pedidos.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · Zustand · React Hook Form · Zod · Jest + Testing Library

**WhatsApp de pedidos:** (11) 98952-5014  
**GitHub:** https://github.com/FMxndxs  
**Conta Git:** FMxndxs / felipemendescampos40@gmail.com

---

## Arquitetura de Pastas

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home / catálogo em destaque
│   ├── catalog/                # Listagem completa + filtros
│   ├── product/[slug]/         # Página de produto
│   ├── cart/                   # Carrinho + checkout WhatsApp
│   ├── custom-order/           # Formulário de pedido personalizado
│   └── admin/                  # Dashboard administrativo
│       ├── (auth)/login/       # Login Supabase Auth
│       └── (dashboard)/        # CRUD de produtos
├── components/
│   ├── ui/                     # Primitivos: Button, Input, Card, Badge
│   ├── catalog/                # ProductCard, CategoryFilter, ProductGrid
│   ├── cart/                   # CartItem, CartSummary, WhatsAppCheckout
│   ├── admin/                  # ProductForm, ProductTable, StockToggle
│   └── layout/                 # Header, Footer, AdminSidebar
├── lib/
│   ├── supabase/               # cliente browser + server (SSR)
│   ├── store/                  # Zustand: cartStore, adminStore
│   ├── utils/                  # formatters, whatsapp.ts
│   └── validations/            # Zod schemas
├── hooks/                      # useCart, useProducts, useAdmin
├── types/                      # Product, Order, Category, CartItem
└── __tests__/
    ├── unit/                   # funções puras, hooks
    ├── integration/            # componentes com mocks Supabase
    └── e2e/                    # fluxos completos (Playwright)
```

---

## Metodologia TDD — Red → Green → Blue

Cada fase segue obrigatoriamente 3 etapas:

| Etapa | Cor | Ação |
|-------|-----|------|
| **Red** | Vermelho | Escrever testes que falham (definir contrato) |
| **Green** | Verde | Implementar o mínimo para os testes passarem |
| **Blue** | Azul | Refatorar mantendo todos os testes verdes |

---

## Plano de Fases

### Fase 1 — Foundation & Setup *(atual)*
- Configuração Jest + Testing Library
- Schema do banco Supabase (SQL)
- Tipos TypeScript globais
- Cliente Supabase (browser + SSR)
- Layout base (Header, Footer)
- Variáveis de ambiente (.env.local)

### Fase 2 — Catálogo de Produtos
- Tabelas: `products`, `categories`, `product_images`, `colors`
- ProductCard, ProductGrid, CategoryFilter
- Página de produto com galeria e seleção de cor/tamanho
- Server Components com cache

### Fase 3 — Carrinho & WhatsApp
- Zustand store persistente (localStorage)
- CartItem, CartSummary
- Gerador de link `wa.me` com mensagem formatada
- Formulário de dados do cliente (Nome, Bairro)

### Fase 4 — Pedido Personalizado
- Formulário de projeto sob encomenda
- Upload de referência (Supabase Storage)
- Validação Zod + React Hook Form
- Notificação WhatsApp automática

### Fase 5 — Dashboard Administrativo
- Supabase Auth (login protegido)
- CRUD de produtos + imagens
- Toggle disponibilidade de cores
- Calculadora de preço (filamento g x tempo)

### Fase 6 — Polimento & Deploy
- SEO (metadata, sitemap, OG tags)
- Otimização de imagens (next/image)
- Testes E2E com Playwright
- Deploy Vercel + domínio

---

## Banco de Dados (Supabase)

### Variáveis de ambiente necessárias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=5511989525014
```

### Schema principal
Ver: `docs/database/schema.sql`

---

## Convenções de Código

- **Componentes:** PascalCase, um arquivo por componente
- **Funções/hooks:** camelCase
- **Testes:** `ComponentName.test.tsx` junto ao componente OU em `__tests__/`
- **Commits:** `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **Branches:** `phase/1-foundation`, `phase/2-catalog`, etc.

---

## Integração WhatsApp

Numero: `5511989525014` (formato internacional sem +)  
Gerador: `src/lib/utils/whatsapp.ts`

Formato da mensagem gerada:
```
Novo Pedido — Imagination 3D

Cliente: Joao Silva
Bairro: Vila Madalena / SP

Itens:
- Suporte de Fone (Preto, P) x 2 — R$ 30,00
- Porta-Treco Modular (Branco) x 1 — R$ 45,00

Total: R$ 75,00

Pedido gerado pelo site imagination3d.com.br
```

---

## Compartilhamento com Cursor

Este arquivo CLAUDE.md e lido automaticamente pelo Claude Code e pelo Cursor.
Regras adicionais para o Cursor em: `.cursorrules`
Documentacao detalhada em: `docs/`

---

## Status das Fases

| Fase | Status | Branch |
|------|--------|--------|
| 1 — Foundation | Em andamento | `phase/1-foundation` |
| 2 — Catalogo | Aguardando | `phase/2-catalog` |
| 3 — Carrinho & WhatsApp | Aguardando | `phase/3-cart` |
| 4 — Pedido Personalizado | Aguardando | `phase/4-custom-order` |
| 5 — Dashboard Admin | Aguardando | `phase/5-admin` |
| 6 — Deploy | Aguardando | `phase/6-deploy` |
