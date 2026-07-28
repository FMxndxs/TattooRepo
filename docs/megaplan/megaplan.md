<!-- megaplan v2.0.0 -->
# Kadu Freitas Tattoo — Portfólio + Agendamento

## Vision
Site de portfólio e agendamento para o estúdio de tatuagem Kadu Freitas: galeria de
trabalhos filtrável (estilo + local do corpo), agendamento de sessões com sinal via Pix,
orçamento personalizado por WhatsApp, promoções e conteúdo de valor (cuidados pós-tattoo).
Sem e-commerce — nada é vendido no site; o objetivo é mostrar o trabalho e converter em
agendamento/contato.

## Delivery model
Cycles gate each other. Cycle B nunca começa até os exit criteria do Cycle A serem
atingidos. Workflow por B-item:
`document (pre) → red → green → blue → document (post) → COMPLETE`.
Manter `npm test`, `npx tsc --noEmit` e `npm run build` verdes ao fechar cada item.

## Cycles

### Cycle 0 — Bootstrap megaplan + remover camada e-commerce 3D
**Objetivo:** eliminar toda a superfície de e-commerce; deixar o app só com o domínio de
tatuagem, compilando e com testes verdes.
**Exit criteria:**
- [x] `docs/megaplan/` criado e populado
- [x] Nenhuma rota/página/tabela/componente de e-commerce resta
- [x] Admin "Pedidos" reduzido a "Orçamentos" (`custom_orders`)
- [x] `tsc`, testes e build verdes (testes de produto/pricing removidos junto)

| ID | Título | Status |
|----|--------|--------|
| 0-B1 | Criar estrutura `docs/megaplan/` a partir deste plano | done |
| 0-B2 | Remover rotas/páginas e-commerce (`/catalog`, `/product/[slug]`, `/meus-pedidos`) + repontar/remover links no Header/Footer | done |
| 0-B3 | Remover admin de produtos + `components/catalog/*` + `admin/Product*`/`ColorManager`/`StockToggle` + testes correlatos | done |
| 0-B4 | Migration `101_drop_ecommerce.sql` (drop tabelas e-commerce) + remover `priceCalculator`, queries de produto/frete e tipos 3D | done |
| 0-B5 | Reduzir admin "Pedidos" → "Orçamentos": simplificar `normalizeOrders`/`AdminOrderRow`/`OrdersPanel` e state machine para o ciclo pending→reviewing→quoted→accepted/rejected | done |

### Cycle A — Portfólio como núcleo (filtros + Instagram + imagens)
**Objetivo:** portfólio filtrável e visualmente forte, populado com imagens Unsplash.
**Exit criteria:**
- [x] `portfolio_items` tem `body_placement`; admin edita o campo
- [x] `/portfolio` filtra por estilo e local do corpo, layout tipo Instagram
- [x] Seed com 14 trabalhos (imagens Unsplash verificadas — free license, não-premium)

| ID | Título | Status |
|----|--------|--------|
| A-B1 | Migration `102_portfolio_placement.sql`: coluna `body_placement text` em `portfolio_items` + índice | done |
| A-B2 | Seed `seed/003_portfolio.sql`: 12–16 trabalhos com `image_url` Unsplash (`images.unsplash.com/photo-<id>?w=800&q=80`), estilos e locais variados | done |
| A-B3 | Filtros por estilo + local do corpo em `/portfolio` (derivar opções dos dados; server component + query param, padrão do catálogo antigo) | done |
| A-B4 | Layout galeria estilo Instagram (masonry/grid, hover com título+estilo) + link pro Instagram real do estúdio | done |
| A-B5 | Campo `body_placement` em `PortfolioForm`/`PortfolioPanel` + action `portfolio.ts` | done |

### Cycle B — Rebrand completo (zerar resíduos 3D)
**Objetivo:** nenhum texto, classe, componente ou host remete a impressão 3D.
**Exit criteria:**
- [ ] Grep por `Imagination|Bambu|MakerWorld|filament|impress|print-|3D` em `src/` só
      retorna ocorrências intencionais (ou zero)
- [ ] `seo-schema.test` e `MotionPrimitives.test` atualizados e verdes

| ID | Título | Status |
|----|--------|--------|
| B-B1 | Branding textual → Kadu Freitas Tattoo: `app/page.tsx` metadata, `manifest.ts`, `apple-icon.tsx`, `opengraph-image.tsx`, `admin/(dashboard)/page.tsx` | pending |
| B-B2 | `lib/seo/schema.ts` (organization/localBusiness) para estúdio + ajustar `seo-schema.test.ts` L47 | pending |
| B-B3 | `lib/utils/whatsapp.ts`: mensagens sem "Imagination 3D"/frete/CEP; adequar ao contexto de orçamento/agendamento | pending |
| B-B4 | `Footer.tsx` (logo, textos, Instagram real, remover links de carrinho/catálogo) + `AuthModal.tsx` + comentário em `Modal.tsx` | pending |
| B-B5 | Reescrever `app/nossa-historia/page.tsx` para a história do estúdio | pending |
| B-B6 | Renomear componentes/classes de tema 3D → tema tattoo: `PrintCtaLink`→`CtaLink`, `PrintLayerSkeleton`, `FilamentBackdrop`, `PrintLineHover` (+ `data-testid`), classes `print-*`/`filament-*` em `globals.css` e consumidores; ajustar `MotionPrimitives.test` | pending |
| B-B7 | `next.config.ts`: remover host `makerworld.bblmw.com`; renomear chave `imagination3d_session_id` em `sessionId.ts`+teste | pending |

### Cycle C — Conteúdo & SEO (cuidados pós-tattoo)
**Objetivo:** página de valor que também rende SEO orgânico.
**Exit criteria:**
- [ ] `/cuidados` no ar, no nav e no `sitemap.ts`, com FAQ JSON-LD

| ID | Título | Status |
|----|--------|--------|
| C-B1 | Página estática `app/cuidados/page.tsx` (guia de aftercare) + link no Header/Footer + `sitemap.ts` + `FAQPage` JSON-LD em `lib/seo/schema.ts` | pending |

### Cycle D — Ativar pagamento (Pix) e calendário
**Objetivo:** deixar o fluxo de sinal e o espelho no Google Calendar operáveis + guia.
**Exit criteria:**
- [ ] Guia de setup escrito e validado; agendamento com Pix testado em sandbox
- [ ] Política de cancelamento vem de `app_settings`, não hardcoded

| ID | Título | Status |
|----|--------|--------|
| D-B1 | `docs/setup-pagamento-calendario.md`: passo-a-passo Mercado Pago (sandbox, token, webhook via túnel) + Google Calendar (Service Account, compartilhar agenda) | pending |
| D-B2 | Ligar `StudioSettingsForm` ao `app_settings` (hoje hardcoded — ver `ponytail:` na L4) via action | pending |
| D-B3 | Verificação end-to-end: criar serviço com sinal, agendar, pagar Pix sandbox, confirmar webhook → `confirmed` + evento no GCal | pending |

## Errata
| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-07-28 | Remover e-commerce inteiro em vez de adaptar `products`→flash | Usuário escolheu "só portfólio"; deletar é mais simples que reaproveitar |
| 2026-07-28 | Dropar tabelas e-commerce via migration (irreversível) | Banco recém-semeado, pivô definitivo; dados de produto não têm valor no domínio tattoo |
| 2026-07-28 | Apertar `custom_orders_status_check` ao ciclo puro de orçamento (dentro de 101) | Sem produção física, `accepted` já é o estado final; status de produção (in_production, shipped, etc.) ficaram órfãos |
