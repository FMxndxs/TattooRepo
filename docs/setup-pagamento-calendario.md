# Guia de Setup: Mercado Pago (Pix) + Google Calendar

Este guia é para o Kadu ativar o sistema de pagamento via Pix (Mercado Pago) e o espelho automático de agendamentos no Google Calendar.

---

## 1. Mercado Pago — Setup da conta de testes (Sandbox)

### 1.1 Criar conta de testes

1. Acesse https://www.mercadopago.com.br
2. Faça login com a conta da sua empresa ou crie uma (se não tiver)
3. No painel, vá para **Configurações** → **Dados da conta** → **Modo de testes**
4. Ative o **Modo de Testes** se ainda não estiver ativo
   - Isso cria automaticamente uma conta de testes (sandbox) vinculada à sua conta

### 1.2 Gerar o Access Token (teste/sandbox)

1. Ainda no painel, vá para **Configurações** → **Credenciais**
2. Você verá duas abas: **Produção** (real) e **Teste** (sandbox)
3. Selecione a aba **Teste**
4. Copie o **Access Token** começado com `APP_USR-...`
   - Este token é segredo — não compartilhar em público nem em repositório

### 1.3 Gerar o Webhook Secret (teste/sandbox)

1. No painel do Mercado Pago, vá para **Webhooks** (pode estar em Configurações ou em um menu separado)
2. Você verá um campo "Adicionar webhook" ou algo similar
3. No campo de URL, coloque por enquanto um placeholder local (será alterado logo):
   ```
   https://localhost:3000/api/webhooks/mercadopago
   ```
4. Selecione o evento **payment.created** (ou deixe todos selecionados)
5. Confirme — o sistema deve gerar um **ID de webhook** e uma **Chave secreta**
6. Copie a **Chave secreta** (Webhook Secret)

### 1.4 Expor localhost via túnel (para testar webhook em desenvolvimento)

Você tem duas opções:

#### Opção A: ngrok (recomendado para simplificar)

1. Baixe ngrok em https://ngrok.com/download
2. Crie uma conta gratuita em ngrok.com (opcional para ngrok gratuito, necessário para URL fixa)
3. Descompacte o arquivo e execute no terminal:
   ```bash
   ngrok http 3000
   ```
   - Isso vai exibir uma URL pública como `https://abc123xyz.ngrok.io`
4. Volte ao painel do Mercado Pago e **atualize a URL do webhook** para:
   ```
   https://abc123xyz.ngrok.io/api/webhooks/mercadopago
   ```

#### Opção B: cloudflare (alternativa)

1. Instale Wrangler: `npm install -g @cloudflare/wrangler`
2. Execute:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   - Isso vai exibir uma URL pública
3. Copie a URL e atualize o webhook do Mercado Pago

### 1.5 Configurar variáveis de ambiente (teste local)

Abra `.env.local` na raiz do projeto e preencha:

```env
# Mercado Pago — TEST/SANDBOX
MP_ACCESS_TOKEN=APP_USR-[seu_access_token_teste_aqui]
MP_WEBHOOK_SECRET=[sua_chave_secreta_webhook_aqui]
MP_WEBHOOK_URL=https://abc123xyz.ngrok.io/api/webhooks/mercadopago
```

Salve o arquivo.

### 1.6 Testar o fluxo Pix (sandbox)

1. Inicie o servidor local:
   ```bash
   npm run dev
   ```
2. Acesse a página de agendamento no seu site local (ex: `http://localhost:3000`)
3. Complete um agendamento com dados de teste:
   - Email: qualquer email (ex: `teste@example.com`)
   - Nome: qualquer nome
4. Escolha a opção de pagamento Pix
5. Você verá um QR code com a mensagem "Sandbox — somente para testes"
6. **Faça login em uma segunda aba** com a conta de testes do Mercado Pago (você recebeu acesso ao criar a sandbox)
7. Copie o código Pix exibido no QR code (ou escaneie)
8. Coloque o código na app/site de testes do Mercado Pago para "pagar"
9. Após 1-3 segundos, o webhook deve ser chamado, e o agendamento deve mudar para "confirmado" no seu site
10. Verifique também se o evento apareceu no Google Calendar (após step 2)

---

## 2. Google Calendar — Setup da Service Account

### 2.1 Criar um projeto no Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Se não tiver conta Google Cloud, crie uma (você pode usar a mesma Google Account do Kadu)
3. Clique em **Criar projeto** e dê um nome (ex: "Kadu Freitas Tattoo")
4. Aguarde a criação (pode levar alguns segundos)

### 2.2 Ativar a Google Calendar API

1. No painel do projeto, procure por **APIs e Serviços** no menu esquerdo
2. Clique em **Ativar APIs e Serviços** (ou vá direto a **Biblioteca**)
3. Procure por "Google Calendar API"
4. Clique em **Google Calendar API**
5. Clique em **Ativar**

### 2.3 Criar uma Service Account

1. No painel do projeto, vá para **APIs e Serviços** → **Credenciais**
2. Clique em **Criar credenciais** → **Service Account**
3. Preencha:
   - **Nome da Service Account**: ex. "tattoo-app"
   - **ID**: será gerado automaticamente (ex. `tattoo-app@seu-projeto-123.iam.gserviceaccount.com`)
   - **Descrição** (opcional): ex. "Integracao com o sistema de agendamentos"
4. Clique em **Criar**
5. Na próxima tela (permissões), deixe em branco e clique **Continuar**
6. Na tela de "Concessão de acesso do usuário" (opcional), deixe em branco e clique **Concluir**

### 2.4 Gerar a chave JSON (Private Key)

1. Você será redirecionado para a lista de Service Accounts
2. Clique no e-mail da Service Account que acabou de criar (ex. `tattoo-app@seu-projeto-123.iam.gserviceaccount.com`)
3. Vá para a aba **Chaves**
4. Clique em **Adicionar chave** → **Criar nova chave**
5. Selecione **JSON** como tipo
6. Clique em **Criar**
   - Um arquivo `.json` será baixado automaticamente para seu computador
7. **Salve este arquivo em um local seguro** — nunca compartilhe em repositório público

### 2.5 Extrair `GOOGLE_SA_EMAIL` e `GOOGLE_SA_PRIVATE_KEY` do JSON

1. Abra o arquivo JSON baixado com um editor de texto
2. Você verá algo como:
   ```json
   {
     "type": "service_account",
     "project_id": "seu-projeto-123",
     "private_key_id": "abc123def456...",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n",
     "client_email": "tattoo-app@seu-projeto-123.iam.gserviceaccount.com",
     ...
   }
   ```

3. Copie dois valores:
   - **GOOGLE_SA_EMAIL**: o valor de `client_email`
   - **GOOGLE_SA_PRIVATE_KEY**: o valor de `private_key` (mantendo as quebras de linha `\n` literais, conforme aparecem)

### 2.6 Compartilhar o Google Calendar com a Service Account

1. Abra o Google Calendar do Kadu (ou de quem manage a agenda) em https://calendar.google.com
2. Localize o calendário que quer sincronizar (ex. "Agendamentos Tatuagem")
3. Clique com o botão direito no calendário e selecione **Configurações**
4. Vá para a aba **Compartilhar com pessoas e grupos**
5. Clique em **Adicionar pessoas e grupos**
6. Cole o **GOOGLE_SA_EMAIL** (ex. `tattoo-app@seu-projeto-123.iam.gserviceaccount.com`)
7. Selecione a permissão **Editor** (não apenas "visualizar")
8. Clique em **Compartilhar**

### 2.7 Obter o `GOOGLE_CALENDAR_ID`

1. Ainda nas configurações do calendário, procure por **ID do calendário**
2. Copie o ID (geralmente parece com um UUID ou um e-mail)
   - Se for um calendário padrão, pode ser simplesmente o e-mail da conta (ex. `seu-email@gmail.com`)

### 2.8 Configurar variáveis de ambiente

Abra `.env.local` na raiz do projeto e preencha:

```env
# Google Calendar
GOOGLE_SA_EMAIL=tattoo-app@seu-projeto-123.iam.gserviceaccount.com
GOOGLE_SA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=seu-email@gmail.com
```

**Importante:**
- A chave privada deve estar entre aspas duplas
- As quebras de linha `\n` devem estar literais (como aparecem no JSON)
- Nunca fazer commit do `.env.local` — é arquivo local

---

## 3. Configurar para Produção (Vercel ou outro hosting)

### 3.1 Mudar Mercado Pago para Produção

Quando estiver pronto para ir live:

1. No painel do Mercado Pago, vá para **Configurações** → **Credenciais**
2. Mude para a aba **Produção** (em vez de **Teste**)
3. Copie o **Access Token de Produção**
4. Copie a **Chave secreta do webhook de Produção** (adicione um novo webhook em Webhooks com a URL final do seu site)
5. Adicione ou atualize no seu provedor de hosting (Vercel, Heroku, etc.):
   - `MP_ACCESS_TOKEN` (produção)
   - `MP_WEBHOOK_SECRET` (produção)
   - `MP_WEBHOOK_URL` (URL final do seu site, ex: `https://seudominio.com.br/api/webhooks/mercadopago`)

### 3.2 Manter Google Calendar em Produção

O Google Calendar não tem "modo teste" — você usa a mesma Service Account.

1. Verifique se `GOOGLE_SA_EMAIL`, `GOOGLE_SA_PRIVATE_KEY` e `GOOGLE_CALENDAR_ID` já estão corretos
2. Adicione-os no seu provedor de hosting (Vercel, etc.)
   - No Vercel: **Settings** → **Environment Variables** → adicione as 3 variáveis
   - Certifique-se de que a chave privada está entre aspas e com quebras de linha literais

---

## 4. Como testar o fluxo completo (local com sandbox)

### Checklist de teste:

1. **Setup completo?**
   - [ ] `.env.local` preenchido com tokens de teste do Mercado Pago
   - [ ] `.env.local` preenchido com credenciais do Google (Service Account)
   - [ ] Servidor local rodando: `npm run dev`
   - [ ] Túnel local aberto (ngrok ou cloudflared)
   - [ ] URL do webhook atualizada no painel do Mercado Pago

2. **Agendar e pagar:**
   - [ ] Acesse a página de agendamento
   - [ ] Preencha dados de teste (nome, email, horário, tatuagem)
   - [ ] Clique em "Confirmar e pagar com Pix"
   - [ ] Você verá um QR code com a mensagem "Sandbox"

3. **Simular pagamento:**
   - [ ] Copie o código Pix (ou escaneie)
   - [ ] Faça login em outra aba na conta de testes do Mercado Pago
   - [ ] Vá para a app de testes e "pague" o código Pix copiado
   - [ ] Você deve receber a confirmação em ~1-3 segundos

4. **Verificar confirmação:**
   - [ ] Volte ao seu site — o agendamento deve estar "confirmado"
   - [ ] Abra o Google Calendar do Kadu
   - [ ] Um novo evento deve aparecer com o nome e horário do agendamento
   - [ ] Se não aparecer em tempo real, aguarde 5-10 segundos (pode haver pequeno delay)

5. **Logs:**
   - [ ] Se algo falhar, verifique o console do seu servidor local (`npm run dev`)
   - [ ] Logs de erro indicam problemas na assinatura do webhook ou credenciais

---

## 5. Troubleshooting

### "MP_ACCESS_TOKEN não configurado"
- Verifique se `.env.local` foi criado corretamente na raiz do projeto
- Certifique-se de que o token começa com `APP_USR-`
- Reinicie o servidor local após editar `.env.local`

### "Webhook signature inválida"
- Verifique se `MP_WEBHOOK_SECRET` está correto no `.env.local`
- Certifique-se de que a URL do webhook no painel do Mercado Pago é exatamente a mesma que `MP_WEBHOOK_URL`
- Se estiver usando ngrok, a URL muda a cada execução — atualize no painel do Mercado Pago

### "GOOGLE_SA_EMAIL / GOOGLE_SA_PRIVATE_KEY não configurados"
- Verifique se as variáveis foram adicionadas ao `.env.local`
- Certifique-se de que `GOOGLE_SA_PRIVATE_KEY` está entre aspas duplas
- Verifique se as quebras de linha (`\n`) foram mantidas literais (não substituídas por espaços)

### "Evento não aparece no Google Calendar"
- Verifique se a Service Account foi compartilhada com permissão de **Editor** (não apenas "ver")
- Certifique-se de que `GOOGLE_CALENDAR_ID` está correto (copie novamente das configurações do calendário)
- Verifique se o agendamento foi confirmado com sucesso (check "confirmado" no status do agendamento)
- Aguarde 5-10 segundos (pequeno delay é normal na primeira vez)

### "Token inválido no Mercado Pago"
- Se estiver testando sandbox, certifique-se de que está usando o token de **Teste**, não o de Produção
- Tokens expiram se não forem renovados — gere um novo em Configurações → Credenciais

---

## Resumo das variáveis de ambiente

| Variável | Origem | Tipo | Descrição |
|----------|--------|------|-----------|
| `MP_ACCESS_TOKEN` | Mercado Pago > Configurações > Credenciais | Teste/Prod | Token de autenticação API |
| `MP_WEBHOOK_SECRET` | Mercado Pago > Webhooks | Teste/Prod | Chave para validar assinatura |
| `MP_WEBHOOK_URL` | Manual | Teste/Prod | URL pública do webhook (ex: ngrok) |
| `GOOGLE_SA_EMAIL` | Google Cloud Console > Service Account > JSON | Produção | E-mail da Service Account |
| `GOOGLE_SA_PRIVATE_KEY` | Google Cloud Console > Service Account > JSON | Produção | Chave privada (formato PEM) |
| `GOOGLE_CALENDAR_ID` | Google Calendar > Configurações | Produção | ID do calendário a sincronizar |

---

## Próximas etapas

Após confirmar que o fluxo funciona em sandbox:

1. **Preparar produção:** Gere credenciais de produção do Mercado Pago (em vez de sandbox)
2. **Testar em staging:** Se tiver um ambiente de staging, faça testes com credenciais reais (mas ainda em sandbox do MP, se possível)
3. **Deploy:** Faça deploy da aplicação e configure as variáveis de produção no seu hosting
4. **Monitorar:** Acompanhe os primeiros pagamentos reais para garantir que tudo está funcionando

---

**Dúvidas?** Revise a documentação oficial:
- Mercado Pago: https://developers.mercadopago.com.br
- Google Calendar API: https://developers.google.com/calendar
- Google Cloud Console: https://console.cloud.google.com
