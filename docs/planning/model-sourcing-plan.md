# Plano de Curadoria de Modelos 3D — Imagination 3D

> **Objetivo:** colocar produtos reais no site de forma que o time de criação consiga obter o arquivo fonte (`.3mf` / `.stl`) para imprimir no Bambu Lab — usando modelos com licença comercial verificável.
>
> **Estratégia escolhida:** Ideia 1 — Catálogo curado de modelos com licença livre comercial em Printables, MakerWorld, Thingiverse e Cults3D, com fallback para Cults3D Commercial / MakerWorld Membership / Patreon Merchant Tier quando o modelo desejado não tiver licença livre.
>
> **Status atual:** planejamento. Nenhum código foi escrito ainda.
>
> **Última atualização:** 2026-05-01.

---

## Sumário

1. [Visão geral do fluxo](#1-visão-geral-do-fluxo)
2. [Etapa 0 — Preparação (humano, antes do código)](#2-etapa-0--preparação-humano-antes-do-código)
3. [Etapa 1 — Curadoria piloto (humano)](#3-etapa-1--curadoria-piloto-humano)
4. [Etapa 2 — Implementação no código (agente)](#4-etapa-2--implementação-no-código-agente)
5. [Etapa 3 — Cadastro e teste em produção (humano)](#5-etapa-3--cadastro-e-teste-em-produção-humano)
6. [Etapa 4 — Roll-out completo (humano)](#6-etapa-4--rollout-completo-humano)
7. [Critérios de pronto](#7-critérios-de-pronto)
8. [Riscos e contingências](#8-riscos-e-contingências)
9. [Referências rápidas](#9-referências-rápidas)

---

## 1. Visão geral do fluxo

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLUXO POR PRODUTO                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Curador busca modelo na plataforma (filtro de licença comercial) │
│ 2. Valida licença e tira screenshot da página                       │
│ 3. Baixa o .3mf (ou .stl + slicing manual no Bambu Studio)          │
│ 4. Imprime peça de teste                                            │
│ 5. Fotografa a peça pronta                                          │
│ 6. Cadastra no admin: dados do produto + origem + arquivo + foto    │
│ 7. Pedido entra via WhatsApp                                        │
│ 8. Time abre /admin/sourcing → baixa arquivo via signed URL         │
│ 9. Imprime e entrega                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Etapa 0 — Preparação (humano, antes do código)

> **Quem:** você (Felipe). **Quando:** antes do agente começar a codar. **Tempo estimado:** 1–2 h.

### 2.1 Decisões de negócio

- [ ] **Definir a política de licenças aceitas.** Sugestão: aceitar `CC0`, `CC-BY`, `CC-BY-SA`, `CC-BY-ND`, `Cults3D Commercial`, `MakerWorld Commercial Membership` e `Patreon Merchant Tier`. **Bloquear** qualquer licença com `NC` (Non-Commercial).
- [ ] **Definir orçamento mensal** para licenças pagas (Cults3D €/modelo + assinaturas Patreon/MakerWorld). Sugestão inicial: **R$ 100/mês**, revisão trimestral.
- [ ] **Definir política de atribuição** no site: rodapé discreto na página do produto com nome do designer e link para o original (obrigatório em CC-BY).
- [ ] **Designar curador responsável** (pode ser você inicialmente).

### 2.2 Contas em plataformas

> Crie contas grátis nas 4 plataformas — sem isso, não dá pra baixar arquivos. **Não use redes sociais para login** (atrelar à empresa, não à pessoa).

- [ ] **Printables**: criar conta em [printables.com](https://www.printables.com) com e-mail comercial.
- [ ] **MakerWorld**: criar conta em [makerworld.com](https://makerworld.com) — mesmo e-mail. Instalar **Bambu Studio** se ainda não tiver.
- [ ] **Thingiverse**: criar conta em [thingiverse.com](https://www.thingiverse.com).
- [ ] **Cults3D**: criar conta em [cults3d.com](https://cults3d.com) — manter cartão pronto para licenças avulsas.
- [ ] (Opcional) **Patreon**: conta para assinar Merchant Tiers de designers específicos quando necessário.

### 2.3 Bookmarks de filtros prontos

> Salvar como pasta de favoritos `Imagination 3D — Sourcing` no navegador.

- [ ] Printables — só licenças comerciais:  
  `https://www.printables.com/search/models?licenses=cc,cc-by,cc-sa,cc-by-sa,cc0`
- [ ] MakerWorld — Commercial License Membership hub:  
  `https://makerworld.com/en/community/tag?name=Commercial+License+Membership`
- [ ] Thingiverse — Public Domain + CC-BY:  
  `https://www.thingiverse.com/search?q=&type=things&license=cc&license=cc-sa&license=pd`
- [ ] Cults3D — apenas com licença comercial:  
  `https://cults3d.com/en/search/license/standard-commercial`

### 2.4 Pasta de trabalho local

- [ ] Criar pasta no Google Drive (ou OneDrive) `Imagination3D / Sourcing` com subpastas:
  - `models/` — backup local dos `.3mf` baixados
  - `licenses/` — screenshots das páginas de licença (PNG nomeado `slug-do-produto_AAAA-MM-DD.png`)
  - `prints/` — fotos das peças impressas, prontas para upload no site
- [ ] Definir convenção de nomes: `slug-do-produto.3mf`, `slug-do-produto-license.png`.

### 2.5 Política de prova de licença

- [ ] Para **todo** modelo baixado, antes de fechar a aba: **screenshot da página inteira** com a tag de licença visível e a data do sistema operacional aparecendo. Salvar em `licenses/` com o nome `slug_AAAA-MM-DD.png`.
- [ ] Manter um arquivo `licenses/CHANGELOG.md` no Drive registrando: produto · designer · plataforma · licença · data de aquisição · link.

---

## 3. Etapa 1 — Curadoria piloto (humano)

> **Quem:** curador. **Quando:** depois da Etapa 0, antes do agente codar. **Tempo:** 4–8 h.
>
> **Meta:** validar manualmente o fluxo com **3 a 5 produtos piloto** antes de mexer no código. Se a curadoria não der certo, código bem-feito não salva.

### 3.1 Selecionar 5 produtos piloto

Sugestão (mistura de complexidade + categorias):

- [ ] Suporte de Plantas Hexagonal (decoração — fácil, modular)
- [ ] Suporte de Celular Ajustável (utilitário — alta demanda)
- [ ] Dice Tower Dobrável (games — apelo visual)
- [ ] Axolotl Articulado (bonecos — testa print-in-place)
- [ ] Marca-Páginas Personalizado (brindes — custo de teste baixo)

### 3.2 Para cada produto piloto

- [ ] Buscar 3 candidatos na plataforma (use os bookmarks da Etapa 0).
- [ ] Verificar a licença em cada um — descartar imediatamente se tem **NC** ou se o card menciona "personal use only".
- [ ] Conferir as métricas: tempo de impressão e gramatura batem com o que está no `seed/001_products.sql`? Se não bate, ajustar o produto no admin depois.
- [ ] Tirar screenshot da página com licença visível.
- [ ] Baixar `.3mf` (ou `.stl` + slicing no Bambu Studio).
- [ ] Imprimir peça de teste — registrar tempo real e gramatura real.
- [ ] Fotografar a peça pronta com fundo neutro (boa iluminação, ângulo de 3/4).
- [ ] Preencher entrada no `licenses/CHANGELOG.md`.

### 3.3 Critérios de aceite do piloto

- [ ] Pelo menos **3 dos 5 piloto** com licença válida e arquivo + foto prontos.
- [ ] Nenhum dos 5 caiu em modelo com NC ou marca registrada.
- [ ] Workflow operacional documentado (foi viável? quanto tempo gastou?).

> Só seguir para a Etapa 2 quando isso estiver feito. Caso contrário, repensar a estratégia (ex.: priorizar Cults3D pago, ou começar a desenhar internamente).

---

## 4. Etapa 2 — Implementação no código (agente)

> **Quem:** o agente IA (eu). **Quando:** depois do piloto manual validado. **Tempo:** 1–2 sessões de chat.
>
> **Você não precisa fazer nada aqui** além de revisar os PRs e rodar `npm test` + `npm run build`.

### 4.1 Migrations

- [ ] **`docs/database/migrations/011_product_sources_and_files.sql`**
  - Tabela `product_sources` (origem, licença, designer, prova).
  - Tabela `product_files` (arquivos com `kind`, `storage_path`, `checksum`).
  - RLS: `auth.role() = 'authenticated'` para tudo.
  - Trigger de `updated_at`.

### 4.2 Storage

- [ ] **Bucket `product-files`** privado no Supabase (criar pelo dashboard ou via SQL).
- [ ] Política RLS no bucket: só `authenticated` pode `select` e `insert`.

### 4.3 Tipos e validação

- [ ] Estender `src/types/index.ts` com `ProductSource`, `ProductFile`, enums de `License` e `SourcePlatform`.
- [ ] `src/lib/validations/product-source.ts` (Zod) — recusar licenças `NC*`.
- [ ] Atualizar `src/lib/supabase/queries.ts`:
  - `getProductWithSource(slug)` para a página pública (atribuição CC-BY).
  - `getAdminProductFull(id)` para o admin.

### 4.4 Componentes

- [ ] **`src/components/admin/ProductSourceForm.tsx`** — bloco extra do `ProductForm` com 6 campos (URL, plataforma, licença, designer, designer_url, acquired_at).
- [ ] **`src/components/admin/ProductFileUploader.tsx`** — drag-and-drop para `.3mf` / `.stl`.
- [ ] **`src/components/product/ProductCredit.tsx`** — rodapé de atribuição (só renderiza se `license` exigir BY).
- [ ] **`src/components/admin/LicenseBadge.tsx`** — pílula visual com cor por licença.
- [ ] **`src/components/admin/SourceWarningBanner.tsx`** — alerta se um produto está sem origem cadastrada ou com licença suspeita.

### 4.5 Páginas

- [ ] **`src/app/admin/sourcing/page.tsx`** — dashboard:
  - Lista de produtos sem `product_source`.
  - Lista de produtos com origem mas sem `.3mf` no bucket.
  - Botão "Gerar download (válido 1h)" → signed URL.
- [ ] Atualizar `src/app/product/[slug]/page.tsx` — incluir `<ProductCredit />` no rodapé.
- [ ] Atualizar `src/app/admin/products/[id]/page.tsx` — incluir `ProductSourceForm` + `ProductFileUploader`.

### 4.6 Testes (TDD)

- [ ] Unit: validação Zod recusa `cc-by-nc`.
- [ ] Unit: `ProductCredit` renderiza só em licenças BY.
- [ ] Unit: `LicenseBadge` mostra cor correta por licença.
- [ ] Integration: `getProductWithSource()` retorna `null` em `source` quando não existe.
- [ ] Manter `npm test` e `npm run build` verdes.

### 4.7 Documentação

- [ ] **`docs/sourcing-playbook.md`** — guia operacional do curador (passo a passo, frases-modelo para contatar designers em PT/EN, política de licenças).
- [ ] Atualizar `CLAUDE.md` com a nova fase 6.3 (sourcing).
- [ ] Atualizar `.cursorrules` com regra: "produtos novos exigem `product_source` cadastrado".

---

## 5. Etapa 3 — Cadastro e teste em produção (humano)

> **Quem:** você + curador. **Quando:** depois da Etapa 2 mergeada. **Tempo:** 2–3 h.

### 5.1 Aplicar migration

- [ ] Rodar `011_product_sources_and_files.sql` no SQL Editor do Supabase (`oflozudwutxgvwyvygll`).
- [ ] Verificar: `SELECT * FROM product_sources LIMIT 1;` deve não dar erro.
- [ ] Criar bucket privado `product-files` no dashboard (Storage → New bucket → uncheck "Public").

### 5.2 Cadastrar os 5 produtos piloto

Para cada um:

- [ ] Abrir `/admin/products/[id]` em produção.
- [ ] Preencher bloco "Origem do modelo".
- [ ] Anexar `.3mf` (deve aparecer em `product_files`).
- [ ] Anexar screenshot da licença em `license_proof_url` (campo separado).
- [ ] Trocar a imagem do produto pela foto real da peça impressa (substitui o placeholder).
- [ ] Salvar e visitar a página pública — confirmar que `<ProductCredit />` aparece no rodapé com link para o designer.

### 5.3 Simulação de pedido end-to-end

- [ ] Você se passa por cliente: abre o site, adiciona ao carrinho, finaliza pelo WhatsApp.
- [ ] Curador entra em `/admin/sourcing`, clica em "Gerar download (1h)" no produto.
- [ ] Confirma que a signed URL abre o `.3mf` correto no Bambu Studio.
- [ ] Imprime e cronometra — bate com o tempo cadastrado?

### 5.4 Checklist de "produção pronta"

- [ ] Todos os 5 piloto têm origem, arquivo, screenshot de licença e foto real.
- [ ] Página pública mostra atribuição correta (quando aplicável).
- [ ] Time de criação confirma que o fluxo de download é simples.
- [ ] Nenhum produto antigo (sem origem) ficou exposto sem aviso no admin.

---

## 6. Etapa 4 — Roll-out completo (humano)

> **Quem:** curador. **Quando:** após validar o piloto em produção. **Tempo:** 2–4 semanas (paralelo às vendas).

### 6.1 Repetir o ciclo para os 17 produtos restantes

- [ ] 1 produto por dia útil = ~3 semanas.
- [ ] Priorizar **mais vendidos** primeiro (consultar admin).
- [ ] Produtos que **não acharem modelo livre comercial**:
  - Comprar licença avulsa no Cults3D (registrar no orçamento), **ou**
  - Assinar Patreon Merchant Tier do designer relevante, **ou**
  - Mover para a categoria `personalizados` (sob demanda) e marcar `is_available = false`, **ou**
  - Desenhar internamente (Tinkercad / Fusion 360).

### 6.2 Cadência operacional permanente

- [ ] Revisar `licenses/CHANGELOG.md` no fim de cada mês.
- [ ] Verificar se algum designer cancelou Patreon → produtos afetados ficam `is_available = false` até regularizar.
- [ ] Backup mensal do bucket `product-files` para Drive (script via `supabase storage download`).

---

## 7. Critérios de pronto

A iniciativa está concluída quando:

- [ ] **22 produtos** com origem, licença válida e arquivo no bucket.
- [ ] **22 produtos** com foto real (sem placeholder).
- [ ] Página pública sempre exibe atribuição quando licença exige.
- [ ] Time de criação consegue baixar arquivo em < 30s a partir do recebimento do pedido.
- [ ] `licenses/CHANGELOG.md` completo e auditável.
- [ ] Backup mensal automatizado funcionando.

---

## 8. Riscos e contingências

| Risco | Sintoma | Mitigação |
|------|---------|-----------|
| Designer muda licença para NC após download | Card no Printables agora diz "Non-Commercial" | Snapshot da licença em `licenses/` prova boa-fé. Mantemos uso enquanto não há reclamação formal; se houver, removemos. |
| Modelo deletado pelo designer | Link 404 | Cópia local no bucket privado já garante operação. |
| Patreon Merchant Tier cancelado | Período expirou | Produtos do designer ficam `is_available = false`. Renovar ou trocar de designer. |
| Bucket Supabase passa de 1 GB (free) | Aviso no dashboard | Migrar para plano Pro ($25/mês = 100 GB) ou mover arquivos antigos para Backblaze B2. |
| Modelo com marca registrada (Pokémon, Disney) | Recebe DMCA | Lista negra de IPs no checklist do curador. Em caso de DMCA, remover em <24h. |
| Curador erra e cadastra NC | Validador Zod barra | Etapa 4.6 (testes) garante. Se passar, banner de alerta no admin. |
| Cliente pede modificação não permitida (CC-BY-ND) | "Pode trocar a frase do marca-páginas?" | Marcar produtos `cc-by-nd` com `allows_custom_size = false`. UI bloqueia request. |

---

## 9. Referências rápidas

### URLs de filtro pré-aplicados (bookmarks)

- Printables comerciais: `https://www.printables.com/search/models?licenses=cc,cc-by,cc-sa,cc-by-sa,cc0`
- MakerWorld Commercial: `https://makerworld.com/en/community/tag?name=Commercial+License+Membership`
- Thingiverse comerciais: `https://www.thingiverse.com/search?type=things&license=cc&license=cc-sa&license=pd`
- Cults3D comerciais: `https://cults3d.com/en/search/license/standard-commercial`

### Tabela de licenças (quick reference)

| Licença | Vender impresso? | Atribuir? | Subir STL no nosso bucket? | Editar arquivo? |
|---|---|---|---|---|
| CC0 / Public Domain | ✅ | ❌ | ✅ | ✅ |
| CC-BY | ✅ | ✅ obrigatório | ✅ | ✅ |
| CC-BY-SA | ✅ | ✅ | ✅ (derivados ficam SA) | ✅ |
| CC-BY-ND | ✅ sem editar | ✅ | ✅ | ❌ |
| **CC-BY-NC*** | ❌ | — | ❌ | — |
| Printables Standard Digital | ✅ | varia | ⚠️ uso interno só | varia |
| MakerWorld Commercial Membership | ✅ enquanto assinado | varia | ✅ uso interno | varia |
| Cults3D Commercial (paga) | ✅ permanente | varia | ✅ uso interno | varia |

### Frase-modelo para contatar designer (PT/EN)

> **PT:** Olá [Nome], adoramos seu modelo "[X]". Operamos uma pequena loja de impressão 3D em SP (Imagination 3D, Bambu A1) e gostaríamos de oferecer prints físicos do seu design aos nossos clientes. Você oferece licença comercial avulsa ou tier mensal? Aguardo retorno, obrigado!
>
> **EN:** Hi [Name], we love your "[X]" model. We run a small 3D print shop in São Paulo, Brazil (Imagination 3D, Bambu A1) and would like to offer physical prints of your design. Do you offer a commercial license (one-time or monthly tier)? Thanks!

### Arquivos relacionados neste repo

- `docs/database/schema.sql` — schema atual.
- `docs/database/seed/001_products.sql` — 22 produtos curados (texto e metadados).
- `src/components/admin/ProductForm.tsx` — onde entra o bloco "Origem".
- `src/lib/supabase/queries.ts` — onde entra `getProductWithSource()`.

---

## Próximo passo imediato

Você precisa fazer **só a Etapa 0 e a Etapa 1** antes de pedir o código.

Quando o piloto manual estiver pronto, abra um chat dizendo "vamos para a Etapa 2 do plano de sourcing" e eu executo a parte de código de uma vez.
