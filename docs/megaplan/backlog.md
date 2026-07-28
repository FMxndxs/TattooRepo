<!-- megaplan v2.0.0 -->
# Backlog

Rules:
- Status change = update this row AND the detail file in the same commit
- Every B-item needs a detail file before dev starts
- Mark done even with known issues — document drift in the item's Notes

| ID | Title | Cycle | Status | Detail |
|------|-------|-------|--------|--------|
| 0-B1 | Criar estrutura `docs/megaplan/` a partir do plano | 0 | done | [0-B1.md](backlog-items/0-B1.md) |
| 0-B2 | Remover rotas/páginas e-commerce + repontar links Header/Footer | 0 | done | [0-B2.md](backlog-items/0-B2.md) |
| 0-B3 | Remover admin de produtos + `catalog/*` + `Product*`/`ColorManager`/`StockToggle` + testes | 0 | done | [0-B3.md](backlog-items/0-B3.md) |
| 0-B4 | Migration `101_drop_ecommerce.sql` + remover `priceCalculator`/queries produto/tipos 3D | 0 | done | [0-B4.md](backlog-items/0-B4.md) |
| 0-B5 | Reduzir admin "Pedidos" → "Orçamentos" (`custom_orders`) | 0 | done | [0-B5.md](backlog-items/0-B5.md) |
| A-B1 | Migration `102_portfolio_placement.sql`: coluna `body_placement` + índice | A | done | [A-B1.md](backlog-items/A-B1.md) |
| A-B2 | Seed `003_portfolio.sql`: 12–16 trabalhos com imagens Unsplash | A | done | [A-B2.md](backlog-items/A-B2.md) |
| A-B3 | Filtros por estilo + local do corpo em `/portfolio` | A | done | [A-B3.md](backlog-items/A-B3.md) |
| A-B4 | Layout galeria estilo Instagram + link pro Instagram do estúdio | A | done | [A-B4.md](backlog-items/A-B4.md) |
| A-B5 | Campo `body_placement` em `PortfolioForm`/`PortfolioPanel` + action | A | done | [A-B5.md](backlog-items/A-B5.md) |
| B-B1 | Branding textual → Kadu Freitas Tattoo (metadata, manifest, icons, dashboard) | B | pending | [B-B1.md](backlog-items/B-B1.md) |
| B-B2 | `lib/seo/schema.ts` para estúdio + ajustar `seo-schema.test.ts` | B | pending | [B-B2.md](backlog-items/B-B2.md) |
| B-B3 | `whatsapp.ts`: mensagens sem "Imagination 3D"/frete/CEP | B | pending | [B-B3.md](backlog-items/B-B3.md) |
| B-B4 | `Footer.tsx` + `AuthModal.tsx` + comentário `Modal.tsx` | B | pending | [B-B4.md](backlog-items/B-B4.md) |
| B-B5 | Reescrever `nossa-historia/page.tsx` para a história do estúdio | B | pending | [B-B5.md](backlog-items/B-B5.md) |
| B-B6 | Renomear componentes/classes tema 3D → tema tattoo | B | pending | [B-B6.md](backlog-items/B-B6.md) |
| B-B7 | `next.config.ts`: remover host makerworld; renomear chave sessionId | B | pending | [B-B7.md](backlog-items/B-B7.md) |
| C-B1 | Página `/cuidados` (aftercare) + nav + sitemap + FAQPage JSON-LD | C | pending | [C-B1.md](backlog-items/C-B1.md) |
| D-B1 | `docs/setup-pagamento-calendario.md`: guia Mercado Pago + Google Calendar | D | pending | [D-B1.md](backlog-items/D-B1.md) |
| D-B2 | Ligar `StudioSettingsForm` ao `app_settings` via action | D | pending | [D-B2.md](backlog-items/D-B2.md) |
| D-B3 | Verificação end-to-end: Pix sandbox → webhook → confirmed + evento GCal | D | pending | [D-B3.md](backlog-items/D-B3.md) |
