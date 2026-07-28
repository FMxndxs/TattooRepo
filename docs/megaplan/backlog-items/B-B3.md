<!-- megaplan v2.0.0 -->
# B-B3 — `whatsapp.ts`: mensagens sem "Imagination 3D"/frete/CEP

| Field | Value |
|-------|-------|
| Status | done |
| Workflow step | COMPLETE |
| Owner | — |
| Verification | automated |
| Depends on | B-B2 |
| Target | Cycle B |
| Last updated | 2026-07-28 |

## Outcome
As mensagens de WhatsApp falam de orçamento/agendamento de tatuagem, sem branding 3D nem
campos de frete/CEP.

## Scope
- [x] `buildWhatsAppMessage`/`buildWhatsAppUrl` (payload de carrinho com CEP/frete) removidas
      — dead code, sem consumidor desde a remoção do catálogo (0-B4)
- [x] `buildSupportMessage`/`buildSupportUrl` (chatbot) removidas — dead code
- [x] `buildCustomOrderMessage`/`Url` reescritas: "Imagination 3D" → "Kadu Freitas Tattoo",
      "Cor desejada" → "Estilo desejado"
- [x] `buildOrderConfirmationMessage`/`Url` mantidas (ainda genéricas/válidas), sem
      "Imagination 3D" nelas

## Non-goals
- Trocar o número (segue `5511989525014`)

## Dependencies / blockers
- B-B2

## Test plan
| Level | File | Intent |
|-------|------|--------|
| Unit | `whatsapp.test.ts` | reescrito do zero para `buildCustomOrderMessage`/`Url` (as
      funções que sobreviveram) |

## Acceptance criteria
- [x] Testes verdes; status synced

## Traceability
- Glossary: [[Orçamento / Custom order]], [[Agendamento / Booking]]

## Notes
Resolvido efetivamente durante 0-B4/0-B5, antes deste item existir no backlog — aqui só
formaliza o status. `buildOrderConfirmationMessage`/`Url` não têm mais consumidor desde a
simplificação do OrdersPanel em 0-B5 (o botão "Confirmar WA" foi removido); ficaram como
dead code candidato — não removidas aqui por estarem fora do escopo textual deste item,
mas vale revisar numa limpeza futura.
