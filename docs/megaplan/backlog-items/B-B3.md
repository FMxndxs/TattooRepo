<!-- megaplan v2.0.0 -->
# B-B3 — `whatsapp.ts`: mensagens sem "Imagination 3D"/frete/CEP

| Field | Value |
|-------|-------|
| Status | pending |
| Workflow step | — |
| Owner | — |
| Verification | automated |
| Depends on | B-B2 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
As mensagens de WhatsApp falam de orçamento/agendamento de tatuagem, sem branding 3D nem
campos de frete/CEP.

## Scope
- [ ] Revisar mensagens em `lib/utils/whatsapp.ts`

## Non-goals
- Trocar o número (segue `5511989525014`)

## Dependencies / blockers
- B-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `whatsapp.test.ts` | mensagem sem "Imagination 3D"/frete |

## Acceptance criteria
- [ ] Testes verdes; status synced

## Traceability
- Glossary: [[Orçamento / Custom order]], [[Agendamento / Booking]]

## Notes
Já resolvido em 0-B4/0-B5: `buildWhatsAppMessage`/`buildWhatsAppUrl` (payload de carrinho
com CEP/frete) e `buildSupportMessage`/`buildSupportUrl` (chatbot morto) foram removidos —
eram dead code sem consumidor. `buildCustomOrderMessage`/`Url` e
`buildOrderConfirmationMessage`/`Url` já foram reescritos sem "Imagination 3D" (agora dizem
"Kadu Freitas Tattoo" e "Estilo desejado" em vez de "Cor desejada"). Restou conferir se
`buildOrderConfirmationMessage` ("Seu pedido... foi confirmado") ainda faz sentido dado que
`OrdersPanel` não chama mais esse fluxo (removido em 0-B5) — decidir se mantém para uso
futuro ou remove como dead code.
