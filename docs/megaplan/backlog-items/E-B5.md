<!-- megaplan v2.0.0 -->
# E-B5 — Reativação segura de pagamento atrasado + GCal best-effort

| Field | Value |
|-------|-------|
| Status | done — pendente rodar a migration 106 no Supabase |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | E-B2 (mesma tabela `bookings`) |
| Target | Cycle E |
| Last updated | 2026-07-29 |

## Outcome
Dois achados do runbook D-B3 corrigidos, com decisão explícita do usuário sobre o
comportamento (não presumido):

1. **GCal indisponível durante a confirmação** não trava mais o booking em
   `pending_payment` com o sinal já pago — o banco confirma primeiro; o Google Calendar é
   melhor-esforço.
2. **Pagamento aprovado depois do hold de 20min expirar** agora tenta reativar
   automaticamente, mas só quando o cancelamento foi automático (`cancel_reason =
   'hold_expired'`) — nunca quando o próprio cliente cancelou de propósito
   (`cancel_reason = 'customer'`). A constraint `bookings_no_overlap` do banco continua
   sendo a defesa final contra double-booking; se o horário foi ocupado nesse meio tempo,
   o webhook recebe um erro acionável em vez de silenciosamente falhar ou duplicar.

## Scope
- [x] Migration `106_booking_cancel_reason.sql`: coluna `bookings.cancel_reason`
      (`'hold_expired' | 'customer' | null`)
- [x] `expireStaleHolds` grava `cancel_reason = 'hold_expired'`
- [x] `cancelBookingByToken` grava `cancel_reason = 'customer'`
- [x] `confirmBookingFromPayment`: UPDATE de confirmação roda antes do espelho no GCal;
      `mirrorToCalendar` (novo helper) engole erro do Google com `console.error`, nunca
      derruba o `success: true`
- [x] `confirmBookingFromPayment`: aceita `cancelled` → `confirmed` só quando
      `cancel_reason === 'hold_expired'`; captura `23P01` (exclusion_violation) da
      constraint e devolve mensagem acionável para reconciliação manual

## Non-goals
- Reativar bookings cancelados pelo cliente, mesmo que o pagamento chegue depois (decisão
  do usuário: nunca)
- Criar evento no GCal para serviços com sinal zero (decisão do usuário: manter como está)
- Retry automático do espelho no GCal quando ele falha (fica só o log; sincronização
  manual/futura)

## Dependencies / blockers
- Migration `106` precisa rodar no Supabase antes do comportamento valer em produção —
  pendente (mesma limitação de acesso das migrations 104/105: precisa ser aplicada pelo
  usuário ou por CLI autenticado)

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `src/__tests__/unit/confirmBookingFromPayment.test.ts` | idempotência, GCal falhando não bloqueia, GCal ok grava `gcal_event_id`, reativação `hold_expired` funciona, reativação `customer` é bloqueada, colisão `23P01` retorna mensagem acionável, transições inválidas normais continuam rejeitadas |

## Acceptance criteria
- [x] `npm test` (28 suites / 214 testes), `npx tsc --noEmit`, `npm run build` verdes
- [ ] Migration 106 rodada no Supabase real (pendente)

## Traceability
- Glossary: [[Agendamento / Booking]], [[Sinal / Deposit]]

## Notes
Decisões tomadas explicitamente com o usuário (não assumidas): reativar automaticamente
pagamento atrasado (com a trava de `cancel_reason`), e **não** mexer no caso de sinal zero
sem evento no GCal (mantido como estava).
