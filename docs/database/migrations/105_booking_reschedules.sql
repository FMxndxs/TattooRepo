-- Migration 105: Contador de remarcações persistido em bookings (Cycle E)
-- Rodar no SQL Editor do Supabase, após 104_harden_rls.sql.
--
-- Problema (P2-c da auditoria): rescheduleBookingByToken() recebe `reschedulesUsed`
-- como parâmetro do cliente, e o único caller (src/app/agendamento/[token]/page.tsx)
-- sempre passa 0 — o limite `max_reschedules` da política de cancelamento nunca é
-- aplicado de fato. Solução: persistir o contador no próprio booking e incrementá-lo
-- no servidor a cada remarcação bem-sucedida.

alter table public.bookings
  add column if not exists reschedules_used int not null default 0;

comment on column public.bookings.reschedules_used is
  'Quantidade de vezes que este booking já foi remarcado. Incrementado em rescheduleBookingByToken (src/lib/booking/service.ts); usado para aplicar max_reschedules de app_settings.cancellation_policy.';
