# Imagination 3D — Power BI via endpoint REST

## Visão geral

O endpoint `GET /api/reports` expõe os dados dos relatórios em JSON para consumo no
Power BI (Desktop ou Service). Ele é protegido por **API key** e retorna os mesmos dados
que alimentam o painel em `/admin/relatorios`.

## Datasets disponíveis

| `?dataset=`        | View SQL             | Campos principais |
|--------------------|----------------------|-------------------|
| `revenue_daily`    | `v_revenue_daily`    | `day`, `order_count`, `revenue`, `avg_ticket` |
| `top_products`     | `v_top_products`     | `product_name`, `color_name`, `order_count`, `total_qty`, `total_revenue` |
| `lead_times`       | `v_production_lead_times` | `order_code`, `customer_name`, `total`, `confirmed_at`, `ready_at`, `lead_minutes` |
| `peak_hours`       | `v_peak_hours`       | `hour_of_day`, `order_count` |

**Parâmetros opcionais:**
- `?days=N` — filtra `revenue_daily` e `lead_times` pelos últimos N dias (1–365).
- `?dataset=<nome>` — retorna apenas aquele dataset como array (ideal para o Power BI).
- Sem `?dataset=` — retorna objeto JSON com os 4 conjuntos de uma vez.

## Autenticação

A key **deve** ser enviada no header `Authorization`:

```
Authorization: Bearer <REPORTS_API_KEY>
```

> ⚠️ **Não use `?key=` na query string** — esse caminho foi removido (a chave ficaria
> registrada em logs de servidor e histórico do browser).
>
> A `REPORTS_API_KEY` está definida nas variáveis de ambiente da plataforma de deploy
> (ex.: Vercel → Settings → Environment Variables → Production). Nunca a exponha no
> código ou no repositório.

---

## Passo a passo — Power BI Desktop

### 1. Abrir o Editor de Consultas (Power Query)

Power BI Desktop → **Obter Dados** → **Consulta em Branco** → **Editor Avançado**.

### 2. Criar uma query por dataset

Cole o código M abaixo para cada dataset. Substitua:
- `<URL_DO_SITE>` pela URL de produção (ex.: `https://imagination3-d.vercel.app`)
- `<REPORTS_API_KEY>` pela chave configurada no servidor

**Faturamento Diário (`revenue_daily`)**
```powerquery
let
    Fonte = Web.Contents(
        "https://<URL_DO_SITE>/api/reports?dataset=revenue_daily",
        [ Headers = [ #"Authorization" = "Bearer <REPORTS_API_KEY>" ] ]
    ),
    JSON = Json.Document(Fonte),
    Tabela = Table.FromList(JSON, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandida = Table.ExpandRecordColumn(Tabela, "Column1", {"day", "order_count", "revenue", "avg_ticket"})
in
    Expandida
```

**Top Produtos (`top_products`)**
```powerquery
let
    Fonte = Web.Contents(
        "https://<URL_DO_SITE>/api/reports?dataset=top_products",
        [ Headers = [ #"Authorization" = "Bearer <REPORTS_API_KEY>" ] ]
    ),
    JSON = Json.Document(Fonte),
    Tabela = Table.FromList(JSON, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandida = Table.ExpandRecordColumn(Tabela, "Column1", {"product_name", "color_name", "order_count", "total_qty", "total_revenue"})
in
    Expandida
```

**Lead Times (`lead_times`)**
```powerquery
let
    Fonte = Web.Contents(
        "https://<URL_DO_SITE>/api/reports?dataset=lead_times",
        [ Headers = [ #"Authorization" = "Bearer <REPORTS_API_KEY>" ] ]
    ),
    JSON = Json.Document(Fonte),
    Tabela = Table.FromList(JSON, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandida = Table.ExpandRecordColumn(Tabela, "Column1", {"order_code", "customer_name", "total", "confirmed_at", "ready_at", "lead_minutes"})
in
    Expandida
```

**Pico de Horários (`peak_hours`)**
```powerquery
let
    Fonte = Web.Contents(
        "https://<URL_DO_SITE>/api/reports?dataset=peak_hours",
        [ Headers = [ #"Authorization" = "Bearer <REPORTS_API_KEY>" ] ]
    ),
    JSON = Json.Document(Fonte),
    Tabela = Table.FromList(JSON, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandida = Table.ExpandRecordColumn(Tabela, "Column1", {"hour_of_day", "order_count"})
in
    Expandida
```

### 3. Configurar autenticação no Desktop

Quando o Power BI Desktop pedir autenticação para a URL, selecione **Anonymous** (a
autenticação já está embutida no header via Power Query).

### 4. Formatar os tipos de coluna

Após expandir, ajustar os tipos na aba **Transformar**:
- `day` → Data
- `revenue`, `avg_ticket`, `total`, `total_revenue` → Número Decimal Fixo
- `order_count`, `total_qty`, `lead_minutes`, `hour_of_day` → Número Inteiro
- `confirmed_at`, `ready_at` → Data/Hora

---

## Refresh agendado no Power BI Service (nuvem gratuita)

1. Publique o relatório no Power BI Service (arquivo `.pbix` → **Publicar**).
2. No Service, vá em **Conjuntos de dados** → o dataset do relatório → **Configurações**.
3. Em **Credenciais da fonte de dados**, clique em **Editar credenciais** para cada
   URL → autenticação **Anônima** → **Entrar**.
4. Em **Atualização agendada**, ative e configure a frequência desejada.

> ✅ Não é necessário nenhum Data Gateway — o endpoint é público (protegido por API key)
> e o Power BI Service acessa diretamente via HTTPS.

---

## Variáveis de ambiente necessárias no servidor

```env
REPORTS_API_KEY=<chave forte gerada — 64+ chars hex>
SUPABASE_SERVICE_ROLE_KEY=<já existente>
```

Adicionar `REPORTS_API_KEY` nas variáveis de ambiente da plataforma de deploy
(ex.: Vercel → Settings → Environment Variables → Production).
