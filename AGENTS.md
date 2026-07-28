# Kadu Freitas Tattoo — Orientação para agentes (Cursor / Claude)

## Fonte de verdade

Detalhes completos do projeto estão em **`CLAUDE.md`** (domínio de agendamento, arquitetura, pastas, WhatsApp, DB, convenções). Use este arquivo como índice rápido; não duplique páginas inteiras do `CLAUDE.md` sem necessidade.

## Stack (resumo)

- Next.js 16 (App Router), TypeScript, Tailwind v4 (`@theme inline` em `src/app/globals.css`)
- Supabase — `createClient()` de `@/lib/supabase/browser` (client) ou `server` (RSC), `admin.ts` (service role)
- Zustand (`authModalStore`), RHF + Zod, Jest + Testing Library, **Motion** (`import from 'motion/react'`)
- Mercado Pago (Pix, sem SDK — `src/lib/payments/mercadopago.ts`) + Google Calendar (espelho — `src/lib/calendar/google.ts`)
- WhatsApp: **5511989525014**

## Domínio: agendamento, não e-commerce

Fluxo real: cliente escolhe serviço → agenda horário em `/agendar` → paga sinal via Pix → booking `pending_payment` vira `confirmed` no webhook do Mercado Pago → evento espelhado no Google Calendar. Cliente gerencia (cancela/remarca) via `/agendamento/[token]`.

Fonte da verdade da agenda é o **banco** (tabela `bookings`), não o Google Calendar. Detalhes do ciclo de vida em `src/lib/booking/stateMachine.ts`.

## Regras que evitam regressão

1. **Paleta:** usar **`brand-*`**; nunca **`orange-*`**.
2. **`next/image` com `fill`:** sempre informar **`sizes`** (performance).
3. **Anti double-booking:** não confiar em checagem de overlap só na aplicação — a constraint `EXCLUDE USING gist` em `bookings` (migration `100_tattoo_domain.sql`) é a garantia real. Holds `pending_payment` expiram sozinhos (`hold_expires_at`, 20min) e já são ignorados no cálculo de slots.
4. **`prefers-reduced-motion`:** animações devem degradar (`useReducedMotion()` em Motion e regras em `globals.css`).
5. **`whatsapp.ts` tem lixo do domínio antigo** (mensagem "Imagination 3D", payload com `cep`/`freight`) — não copiar esse texto sem revisar antes de usar em fluxos de booking.

## UI

- **MotionPrimitives:** `LayerReveal`, `StaggerGroup`, `PrintLineHover` (`src/components/ui/MotionPrimitives.tsx`)
- **Extras:** `PrintCtaLink`, `PrintLayerSkeleton`, `FilamentBackdrop` (`src/components/ui/`) — reaproveitados visualmente, sem relação funcional com impressão 3D
- **Reduced motion:** todos os primitives acima já tratam

## TDD

Preferir Red → Green → Blue; manter `npm test` e `npx tsc --noEmit` verdes antes de entregar. Estado atual: 34 suites / 325 testes passando.
