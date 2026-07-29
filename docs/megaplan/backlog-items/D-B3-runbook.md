<!-- megaplan v2.0.0 -->
# D-B3 — Runbook de verificação end-to-end (Pix sandbox + Google Calendar + RLS)

Executar depois de aplicar `104_harden_rls.sql` e `105_booking_reschedules.sql` — as
migrations mudam o que as páginas admin conseguem ler, então rodar o runbook contra o
banco já blindado valida as duas frentes (D-B3 e Cycle E) numa passada só.

## 0. Setup

Seguir `docs/setup-pagamento-calendario.md` §1–2:
- `.env.local`: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_WEBHOOK_URL`, `GOOGLE_SA_EMAIL`,
  `GOOGLE_SA_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`.
- Túnel (`ngrok http 3000` ou `cloudflared`) apontando o webhook do MP para
  `POST /api/webhooks/mercadopago`.
- Service Account do Google compartilhada na agenda como **Editor** (não "visualizar").
- Rodar as migrations `104_harden_rls.sql` e `105_booking_reschedules.sql` no SQL Editor
  do Supabase, depois `docs/database/verify_rls.sql` — deve terminar sem `RAISE EXCEPTION`.

## 1. Caminho feliz

1. `/admin/services` → criar/editar um serviço com `deposit_amount > 0`.
2. `/agendar` → escolher esse serviço, um horário, preencher os dados e enviar.
3. Escanear/copiar o Pix e pagar pela **conta de teste** do Mercado Pago.
4. Aguardar 1–3s pelo webhook (log no `npm run dev`: `[mercadopago webhook] ...` só
   aparece em caso de falha — sucesso é silencioso).
5. Conferir em `/admin/agenda`: status `confirmed`, e o evento apareceu na agenda do Google
   dentro de ~5-10s.
6. Abrir o link `/agendamento/<manage_token>` mostrado na tela de sucesso do `/agendar`
   (antes desta correção esse link não era exibido — conferir que agora aparece).

**Resultado observado:** _preencher ao rodar_

## 2. Sinal zero (controle negativo)

O serviço seed `personalizado` tem `deposit_amount = 0`. Agendar por ele deve confirmar
**na hora**, sem Pix e **sem** criar evento no Google Calendar (`service.ts:83-86`).

**Resultado observado:** _preencher ao rodar_ — se este comportamento não for o desejado
pelo estúdio (ex.: quer evento no GCal mesmo sem sinal), abrir um item de backlog separado.

## 3. Google Calendar indisponível

Comentar temporariamente `GOOGLE_SA_EMAIL` em `.env.local`, reiniciar o dev server, repetir
o caminho feliz. `createCalendarEvent` roda **antes** do `UPDATE` em
`confirmBookingFromPayment` (`service.ts:129` vs `:136`) — ao lançar, o webhook loga o erro
e mesmo assim devolve **200** (`route.ts:32-38`, deliberado para o MP não reenviar em loop).//
O booking fica **`pending_payment` com o sinal já pago**.

**Resultado observado:** _preencher ao rodar_. Se confirmado, é um achado a corrigir depois
(inverter a ordem: gravar `confirmed` primeiro, espelhar no GCal depois — coerente com "o
banco é a fonte da verdade").

Restaurar `GOOGLE_SA_EMAIL` ao final do teste.

## 4. Pagamento atrasado (hold expirado)

Criar um agendamento e **não pagar** por mais de 20 minutos (ou reduzir `HOLD_MINUTES` em
`service.ts` temporariamente para testar mais rápido). `expireStaleHolds` marca o booking
como `cancelled`. Pagar o Pix depois disso — `canTransition('cancelled', 'confirmed')` é
`false` (`stateMachine.ts`), então a confirmação falha **permanentemente**, com o dinheiro
já recebido pelo MP.

**Resultado observado:** _preencher ao rodar_. Achado conhecido, sem mitigação automática
ainda — depende de conciliação manual (ver saldo no MP vs. bookings `cancelled` com
`mp_payment_id` preenchido).

## 5. Cancelar e remarcar

1. Pelo link `/agendamento/<manage_token>`, cancelar um booking `confirmed` — conferir que
   a mensagem de reembolso reflete `refundable_hours_before` de `/admin/settings` (prova de
   que o bug do D-B2 — `getPolicy` lendo a tabela errada — está corrigido).
2. Remarcar um booking `confirmed` `max_reschedules` vezes seguidas (valor default: 1) —
   a próxima tentativa deve ser bloqueada com "limite de remarcações" mesmo enviando a
   requisição diretamente (o contador agora vem de `bookings.reschedules_used`, não do
   cliente).

**Resultado observado:** _preencher ao rodar_

## 6. Prova de RLS (Cycle E)

Com o JWT de uma conta comum (não-admin), logada via `AuthModal`:

```bash
# 6a. bookings deve retornar vazio para qualquer autenticado comum
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/bookings?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $USER_JWT"
# esperado: []

# 6b. escalada de privilégio deve falhar
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles?id=eq.$USER_ID" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"is_admin": true}'
# esperado: erro 42501 (coluna) ou exceção do trigger guard_profile_is_admin
```

Antes de `104_harden_rls.sql`, ambos passavam sem erro — essa é a demonstração dos dois
achados P0 da auditoria.

**Resultado observado (2026-07-29, automatizado via Admin API + curl, usuário de teste
descartável criado e apagado na mesma sessão):**
- 6a. `GET bookings` com JWT de conta comum → `[]` ✅
- 6b. `PATCH profiles set is_admin=true` → `403 42501 permission denied for table profiles`
  (hint: `GRANT UPDATE ON public.profiles TO authenticated`) ✅ — a escalada de privilégio
  está bloqueada
- Controle negativo: `PATCH profiles set first_name=...` (campo não sensível) → `200`,
  sucesso — confirma que a blindagem não quebrou a escrita normal do próprio perfil

## 7. Regressão — nada quebrou com o RLS mais rígido

- Deslogado: `/portfolio`, `/promocoes`, `/agendar` (lista de serviços + RPC de slots),
  `/cuidados` carregam normalmente.
- Logado como admin (`is_admin = true`): `/admin/{agenda,services,disponibilidade,
  portfolio,promocoes,settings}` continuam funcionando (todos leem com o client de
  usuário, então dependem das novas policies `*_admin_all`/`*_admin_write`).
- `npm test`, `npx tsc --noEmit`, `npm run build` verdes (rodados nesta sessão: 27 suites
  / 207 testes, tsc limpo, build ok).
