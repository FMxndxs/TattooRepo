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
- [x] Grep por `Imagination|Bambu|MakerWorld|filament|impress|print-|3D` em `src/` só
      retorna ocorrências intencionais (ou zero)
- [x] `seo-schema.test` e `MotionPrimitives.test` atualizados e verdes

| ID | Título | Status |
|----|--------|--------|
| B-B1 | Branding textual → Kadu Freitas Tattoo: `app/page.tsx` metadata, `manifest.ts`, `apple-icon.tsx`, `opengraph-image.tsx`, `admin/(dashboard)/page.tsx` | done |
| B-B2 | `lib/seo/schema.ts` (organization/localBusiness) para estúdio + ajustar `seo-schema.test.ts` L47 | done |
| B-B3 | `lib/utils/whatsapp.ts`: mensagens sem "Imagination 3D"/frete/CEP; adequar ao contexto de orçamento/agendamento | done |
| B-B4 | `Footer.tsx` (logo, textos, Instagram real, remover links de carrinho/catálogo) + `AuthModal.tsx` + comentário em `Modal.tsx` | done |
| B-B5 | Reescrever `app/nossa-historia/page.tsx` para a história do estúdio | done |
| B-B6 | Renomear componentes/classes de tema 3D → tema tattoo: `PrintCtaLink`→`CtaLink`, `PrintLayerSkeleton`, `FilamentBackdrop`, `PrintLineHover` (+ `data-testid`), classes `print-*`/`filament-*` em `globals.css` e consumidores; ajustar `MotionPrimitives.test` | done |
| B-B7 | `next.config.ts`: remover host `makerworld.bblmw.com`; renomear chave `imagination3d_session_id` em `sessionId.ts`+teste | done |

### Cycle C — Conteúdo & SEO (cuidados pós-tattoo)
**Objetivo:** página de valor que também rende SEO orgânico.
**Exit criteria:**
- [x] `/cuidados` no ar, no nav e no `sitemap.ts`, com FAQ JSON-LD

| ID | Título | Status |
|----|--------|--------|
| C-B1 | Página estática `app/cuidados/page.tsx` (guia de aftercare) + link no Header/Footer + `sitemap.ts` + `FAQPage` JSON-LD em `lib/seo/schema.ts` | done |

### Cycle D — Ativar pagamento (Pix) e calendário
**Objetivo:** deixar o fluxo de sinal e o espelho no Google Calendar operáveis + guia.
**Exit criteria:**
- [ ] Guia de setup escrito e validado; agendamento com Pix testado em sandbox
- [ ] Política de cancelamento vem de `app_settings`, não hardcoded

| ID | Título | Status |
|----|--------|--------|
| D-B1 | `docs/setup-pagamento-calendario.md`: passo-a-passo Mercado Pago (sandbox, token, webhook via túnel) + Google Calendar (Service Account, compartilhar agenda) | done |
| D-B2 | Ligar `StudioSettingsForm` ao `app_settings` (hoje hardcoded — ver `ponytail:` na L4) via action | done |
| D-B3 | Verificação end-to-end: criar serviço com sinal, agendar, pagar Pix sandbox, confirmar webhook → `confirmed` + evento no GCal | pending — runbook pronto (ver `D-B3-runbook.md`), falta execução manual |

### Cycle E — Blindagem RLS (auditoria de segurança Supabase)
**Objetivo:** eliminar as falhas de autorização encontradas numa auditoria de segurança do
banco — RLS ativo em toda tabela não é suficiente se as *policies* são fracas. Também
corrigir um bug de código descoberto na mesma auditoria que anulava o D-B2.
**Exit criteria:**
- [x] Nenhuma policy usa `USING (true)`/`auth.role() = 'authenticated'` como proxy de admin
      fora das exceções documentadas em `verify_rls.sql`
- [x] `bookings` sem policy alguma para anon/authenticated comum (só `is_admin()`)
- [x] `profiles.is_admin` não pode ser alterado por `authenticated` via update comum
- [x] `getPolicy` lê `app_settings` (não `settings`); `max_reschedules` aplicado com o
      contador vindo do banco, não do cliente
- [x] `npm test`, `npx tsc --noEmit`, `npm run build` verdes
- [x] Migrations `104`/`105` rodadas no Supabase real e `verify_rls.sql` executado sem
      exceção

| ID | Título | Status |
|----|--------|--------|
| E-B1 | Migration `104_harden_rls.sql`: escalada de privilégio, 7 policies `admin all *` → `is_admin()`, `bookings` fechada, `time_off`/`settings` sem leitura pública, `app_settings` seletivo, `profiles` INSERT, `custom_orders` update/delete próprio, storage escopado por dono, limpeza de órfãos, `verify_rls.sql` | done |
| E-B2 | Migration `105_booking_reschedules.sql` + correções de código: `getPolicy` → `app_settings`, contador de remarcações persistido, rate limit nas Server Actions de booking, link de gestão exibido em `/agendar` | done |
| E-B3 | Testes de regressão: `getPolicy`, `bookingReschedule`, `bookingRateLimit`, `mercadopagoWebhook` (rota sem cobertura antes) | done |
| E-B4 | Runbook `D-B3-runbook.md` (estende o checklist do D-B3 com os casos de borda achados na auditoria) + fechamento de documentação do Cycle D | done |
| E-B5 | Migration `106_booking_cancel_reason.sql` + `confirmBookingFromPayment`: reativação segura de pagamento atrasado (só se `cancel_reason='hold_expired'`, nunca se cancelado pelo cliente), espelho no GCal best-effort (banco confirma antes, Google nunca bloqueia) | done — **pendente rodar a migration 106 no Supabase** |

## Errata
| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-07-28 | Remover e-commerce inteiro em vez de adaptar `products`→flash | Usuário escolheu "só portfólio"; deletar é mais simples que reaproveitar |
| 2026-07-28 | Dropar tabelas e-commerce via migration (irreversível) | Banco recém-semeado, pivô definitivo; dados de produto não têm valor no domínio tattoo |
| 2026-07-28 | Apertar `custom_orders_status_check` ao ciclo puro de orçamento (dentro de 101) | Sem produção física, `accepted` já é o estado final; status de produção (in_production, shipped, etc.) ficaram órfãos |
| 2026-07-29 | `100_tattoo_domain.sql` reintroduziu `auth.role() = 'authenticated'` como proxy de admin em 7 tabelas, o mesmo anti-pattern que `035_harden_baseline_policies.sql` foi escrita para eliminar na fase e-commerce | A migration 100 foi escrita depois da 035 mas não reaproveitou o padrão `is_admin()`; corrigido em `104_harden_rls.sql` (Cycle E) |
| 2026-07-29 | `bookings` ficou sem policy alguma para anon/authenticated comum, em vez de ganhar `user_id` + policy de dono | Decisão do usuário: o fluxo `/agendar` é 100% anônimo hoje (identidade é nome/telefone/email + `manage_token`); fechar é mais simples e mais seguro do que introduzir ownership numa tabela que nunca teve dono |
| 2026-07-29 | Bucket de storage `custom-orders` mantido público (com escrita/apagar escopados por `auth.uid()/...`) em vez de virar privado com signed URL | O código já assume `getPublicUrl` e o admin exibe a foto de referência num `<a href>` direto em `OrdersPanel`; migrar para signed URL é um refactor maior, fora do escopo da blindagem de RLS |
