-- Migration 106: Distingue o motivo de cancelamento de um booking (Cycle E)
-- Rodar no SQL Editor do Supabase, após 105_booking_reschedules.sql.
--
-- Problema (achado do runbook D-B3, "pagamento atrasado"): se o cliente paga o Pix depois
-- que o hold de 20min expirou, expireStaleHolds() já marcou o booking como 'cancelled' e
-- o slot foi liberado. Sem saber POR QUE foi cancelado, o sistema não pode decidir se é
-- seguro reativar automaticamente quando o pagamento aprovado chega — reativar um
-- cancelamento feito de propósito pelo cliente seria um bug pior que o original.
--
-- Solução: gravar o motivo do cancelamento. confirmBookingFromPayment (webhook) só tenta
-- reativar bookings cancelados por 'hold_expired', nunca por 'customer'. A constraint
-- bookings_no_overlap (100_tattoo_domain.sql) continua sendo a defesa final: se o horário
-- foi ocupado por outra reserva nesse meio tempo, a reativação falha com erro acionável
-- em vez de criar um double-booking.

alter table public.bookings
  add column if not exists cancel_reason text
  check (cancel_reason is null or cancel_reason in ('hold_expired', 'customer'));

comment on column public.bookings.cancel_reason is
  'Por que o booking foi cancelado: hold_expired (expireStaleHolds, pagamento pode reativar) ou customer (cancelBookingByToken, nunca reativa automaticamente). NULL para bookings não cancelados.';
