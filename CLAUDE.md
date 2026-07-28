# Kadu Freitas Tattoo — Project Intelligence

## Visão geral
Portfólio + agendamento para estúdio de tatuagem. Cliente agenda sessão, paga sinal via Pix (Mercado Pago), reserva é espelhada no Google Calendar. Fonte da verdade da agenda é o banco (Supabase), não o Google Calendar.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Zustand · React Hook Form · Zod · Jest + Testing Library · Motion (`motion/react`)

**WhatsApp:** (11) 98952-5014 → `5511989525014`
**GitHub:** https://github.com/FMxndxs
**Conta Git:** FMxndxs / felipemendescampos40@gmail.com

**Memórias relacionadas:** `.cursorrules`, `AGENTS.md` (índice rápido para agentes)

---

## Histórico

Projeto nasceu como "Imagination 3D" (e-commerce de impressão 3D). Em 28/07/2026 (`aa703bd`) foi pivotado para o domínio de tatuagem: carrinho/frete/chatbot removidos, substituídos por agendamento + sinal + calendário. Boa parte da infra (Supabase, design tokens, componentes de motion, testes) foi reaproveitada da base anterior.

---

## Domínio — agendamento

### Ciclo de vida do booking
`pending_payment → confirmed (sinal pago) → done`, ou `→ cancelled` / `→ no_show`.
Implementado em `src/lib/booking/stateMachine.ts` (`canTransition`, `isRefundable`, `canReschedule` conforme `CancellationPolicy`).

### Anti double-booking
Constraint `EXCLUDE USING gist` em `bookings` (migration `100_tattoo_domain.sql`) impede overlap de horários entre bookings ativos (`confirmed`, `done`, ou `pending_payment` com `hold_expires_at` não expirado).
**Hold de 20min:** reservas `pending_payment` expiram e liberam o slot automaticamente — não precisa de job de limpeza, o cálculo de slots disponíveis já ignora holds expirados.

### Pagamento — Mercado Pago (Pix)
`src/lib/payments/mercadopago.ts` — fetch direto na API REST (sem SDK; cobre só criar Pix e consultar por id). Webhook em `src/app/api/webhooks/mercadopago/route.ts`, idempotência via `mp_payment_id` único.

### Google Calendar
`src/lib/calendar/google.ts` — espelha bookings confirmados via Service Account. **Não é fonte de verdade**; se divergir do banco, o banco vence.

### Rotas públicas de agendamento
- `/agendar` — fluxo de reserva
- `/agendamento/[token]` — autoatendimento (cancelar/remarcar) via `manage_token` do booking

---

## Sistema de design

### Paleta — brand `#431370` (dark/violeta)

| Token | Valor | Uso |
|-------|-------|-----|
| `brand-300` | `#b683ff` | Preços, destaques |
| `brand-500` | `#6a2ba8` | Hover de botões |
| `brand-700` | `#431370` | **Primária** |
| `brand-glow` | `rgba(67,19,112,0.45)` | Sombras CTA |

Definidos em `src/app/globals.css` via `@theme inline`. **Nunca usar `orange-*`.**

### Logo
`public/logo-kadu.png`

### Animações (reaproveitadas da base 3D, tema visual adaptado)
- **`src/components/ui/MotionPrimitives.tsx`** — `LayerReveal`, `StaggerGroup`, `PrintLineHover`, todos respeitando **`useReducedMotion()`**
- **`next/image`** com **`fill`**: sempre definir **`sizes`**

---

## Banco de dados

**Schema base:** `docs/database/schema.sql` (herdado da fase e-commerce: produtos, categorias, orders — parte ainda em uso, parte legado)
**Domínio de tatuagem:** `docs/database/migrations/100_tattoo_domain.sql`
- `services` — tipos de sessão (duração, valor do sinal, preço "a partir de")
- `availability_rules` — regras semanais recorrentes de disponibilidade
- `time_off` — bloqueios pontuais (folgas/feriados)
- `bookings` — agendamentos (ver ciclo de vida acima)
- `promotions` — promoções
- `portfolio_items` — trabalhos realizados (sem venda)
- `settings` — política de cancelamento, etc.

Migrations numeradas até 037 são da fase e-commerce (categorias, produtos, orders, hardening). `100_tattoo_domain.sql` é o corte do pivot — rodar após o schema base.

`products` (tabela e código) hoje representa **flash designs** disponíveis para tatuar, não produtos físicos.

---

## O que já existe (não recriar)

### Tipos — `src/types/`
`index.ts` (Product/flash, Category, CustomOrder, WhatsAppOrderPayload, etc.) · `booking.ts` (`BookingStatus`, `CancellationPolicy`)

### Utilitários — `src/lib/utils/`
`formatters.ts` (`formatBRL`, …), `phoneMask.ts`, `priceCalculator.ts`, `whatsapp.ts` (`buildWhatsAppMessage`), `authErrors.ts`

> ⚠️ `whatsapp.ts` ainda tem texto de mensagem e payload (`cep`, `freight`, endereço) da fase e-commerce — não foi adaptado no pivot. Revisar antes de usar em fluxos de booking/custom-order.

### Supabase — `src/lib/supabase/`
`browser.ts` / `server.ts` (`createClient()`) · `admin.ts` (service role) · `queries.ts` / `clientQueries.ts` · `storage.ts`

### Domínio — `src/lib/`
`booking/` (stateMachine, service) · `payments/mercadopago.ts` · `calendar/google.ts` · `orders/` (stateMachine, service — legado de custom orders) · `security/rateLimit.ts` · `seo/schema.ts` (JSON-LD) · `analytics/`

### Componentes (resumo)
- **Layout:** `Header`, `Footer`, `AdminSidebar`
- **Booking/admin:** `src/components/admin/booking/`
- **Auth:** `src/components/auth/`
- **Custom order / portfólio / catálogo:** como nas pastas correspondentes em `src/components/`

### Páginas — `src/app/`
`agendar/`, `agendamento/[token]/`, `portfolio/`, `promocoes/`, `custom-order/`, `catalog/`, `product/[slug]/`, `meus-pedidos/`, `perfil/`, `nossa-historia/`, `admin/(auth)/login`, `admin/(dashboard)/{agenda,disponibilidade,services,products,portfolio,promocoes,orders,settings}`

---

## Arquitetura de pastas (resumida)

```
src/
├── app/                 # App Router, globals.css
├── components/
│   ├── ui/, layout/, admin/(booking), auth/, catalog/, custom-order/, orders/, seo/
├── lib/
│   ├── booking/, payments/, calendar/, orders/, security/, seo/, analytics/
│   ├── supabase/, store/, utils/, validations/, context/
├── types/
└── __tests__/unit/
```

---

## TDD — Red → Green → Blue

Red: teste falha · Green: mínimo para passar · Blue: refatorar mantendo `npm test` e `npx tsc --noEmit` verdes.

Estado atual: 34 suites / 325 testes passando, `tsc --noEmit` limpo.

---

## WhatsApp

`5511989525014` · `src/lib/utils/whatsapp.ts` (revisar texto/payload — ver aviso acima)

---

## Convenções

- `'use client'` só quando necessário
- Sem `any`
- Commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **brand-***, não orange-*

---

## Variáveis de ambiente

Ver `.env.example` para a lista completa e atualizada (Supabase, WhatsApp, site, Mercado Pago, Google Calendar). `REPORTS_API_KEY` / `/api/reports` da fase e-commerce **foram removidos** — não recriar sem necessidade real.
