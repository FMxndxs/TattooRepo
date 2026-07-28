<!-- megaplan v2.0.0 -->
# Glossary

Canonical domain terms. Every agent session uses these words — no synonyms, no improvisation.

| Termo | Definição | Confusão comum |
|-------|-----------|----------------|
| **Trabalho / Portfolio item** | Tatuagem já realizada, exibida na galeria (`portfolio_items`): imagem + título + estilo + local do corpo. Sem preço, sem venda. | ≠ "produto" (removido) |
| **Estilo** | Técnica/traço: Blackwork, Fineline, Realismo, Old School, Pontilhismo, Lettering, Geométrico… | ≠ categoria de produto |
| **Local do corpo** | Região onde a tattoo foi/será feita: braço, antebraço, perna, costas, mão, pescoço… | novo campo `body_placement` |
| **Serviço** | Tipo de sessão agendável (`services`): flash, sessão fechada, orçamento. Tem duração e `deposit_amount` (sinal). | ≠ "produto"; "flash" aqui é serviço, não item de catálogo |
| **Agendamento / Booking** | Reserva de horário (`bookings`) com sinal via Pix; fonte da verdade é o banco, GCal é espelho. | — |
| **Sinal / Deposit** | Pix pago para garantir a reserva; hold de 20min. | ≠ preço total |
| **Orçamento / Custom order** | Pedido personalizado (`custom_orders`); cliente descreve a ideia, acompanhamento por WhatsApp. Ciclo: pending → reviewing → quoted → accepted\|rejected. | ≠ pedido de e-commerce (removido) |
| **Promoção** | Oferta com validade (`promotions`). | — |
