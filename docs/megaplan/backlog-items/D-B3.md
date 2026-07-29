<!-- megaplan v2.0.0 -->
# D-B3 — Verificação end-to-end: Pix sandbox → webhook → confirmed + evento GCal

| Field | Value |
|-------|-------|
| Status | pending — runbook pronto, aguardando execução manual |
| Workflow step | — |
| Owner | — |
| Verification | manual |
| Depends on | D-B2 |
| Target | Cycle D |
| Last updated | 2026-07-29 |

## Outcome
O fluxo de agendamento com sinal funciona ponta a ponta em sandbox, com espelho no Google
Calendar.

## Scope
- [ ] Criar serviço com sinal
- [ ] Agendar
- [ ] Pagar Pix sandbox
- [ ] Confirmar webhook → `confirmed` + evento no GCal

## Non-goals
- Produção real (sandbox apenas)

## Dependencies / blockers
- D-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| E2E manual | `docs/megaplan/backlog-items/D-B3-runbook.md` | Pix → webhook → confirmed → GCal + prova de RLS (Cycle E) |

## Acceptance criteria
- [ ] Fluxo validado em sandbox; status synced

## Traceability
- Glossary: [[Sinal / Deposit]], [[Agendamento / Booking]], [[Serviço]]

## Notes
Fonte da verdade é o banco; GCal é espelho.

Durante a preparação deste item (auditoria de segurança + fechamento do Cycle D) foi
encontrado um bug que anulava o D-B2: `getPolicy` (`src/lib/booking/service.ts`) lia a
tabela `settings` (config de frete legada) em vez de `app_settings` — a política de
cancelamento editada em `/admin/settings` nunca era aplicada de fato. Corrigido junto do
[[Cycle E]] (ver `E-B2`), com teste de regressão (`getPolicy.test.ts`).

Este agente não tem acesso a browser, sandbox do Mercado Pago ou à conta Google do estúdio
— o runbook em `D-B3-runbook.md` está pronto e cobre os 4 checkboxes do escopo mais os
casos de borda achados na auditoria (sinal zero, GCal indisponível, pagamento atrasado,
prova de RLS), mas a execução manual (pagar o Pix, checar a agenda do Google) ainda precisa
ser feita por alguém com esse acesso antes de marcar este item como `done`.

**Atualização 2026-07-29:** o §6 do runbook (prova de RLS) já foi executado — via Admin API
+ curl, com um usuário de teste descartável criado e apagado na mesma sessão (não precisa
de browser). Resultado: `bookings` retorna `[]` para conta comum, e a tentativa de
`is_admin=true` falha com `403 42501`, sem quebrar a escrita normal do próprio perfil. Os
itens §1–§5 (caminho feliz do Pix, sinal zero, GCal indisponível, pagamento atrasado,
cancelar/remarcar) continuam pendentes — dependem de sandbox do Mercado Pago e da agenda
Google reais.
