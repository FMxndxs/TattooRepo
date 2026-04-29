# Fase 1 — Foundation & Setup

## Objetivo
Estabelecer a base do projeto: configuracao de testes, tipos globais, cliente Supabase e layout base.

---

## RED PHASE — Testes que devem falhar primeiro

### 1.1 Testes de tipos e utilitarios
```
src/__tests__/unit/whatsapp.test.ts
src/__tests__/unit/formatters.test.ts
src/__tests__/unit/types.test.ts
```

### 1.2 Testes de componentes de layout
```
src/__tests__/unit/Header.test.tsx
src/__tests__/unit/Footer.test.tsx
```

### Rodar testes (devem falhar):
```bash
npm test
```

---

## GREEN PHASE — Implementacao minima

### 1.1 Configurar Jest
- `jest.config.ts`
- `jest.setup.ts`

### 1.2 Tipos globais
- `src/types/index.ts` — Product, Category, Color, CartItem, CustomOrder

### 1.3 Cliente Supabase
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`

### 1.4 Utilitarios
- `src/lib/utils/whatsapp.ts` — gerador de link wa.me
- `src/lib/utils/formatters.ts` — formatBRL, formatPhone

### 1.5 Layout base
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/layout.tsx` atualizado

### 1.6 Variaveis de ambiente
- `.env.local` (template)
- `.env.example`

---

## BLUE PHASE — Refatoracao

- Extrair constantes para `src/lib/constants.ts`
- Garantir que Header seja responsivo (mobile-first)
- Adicionar testes de snapshot para layout
- Documentar todas as funcoes utilitarias com JSDoc

---

## Criterios de Conclusao

- [ ] `npm test` passa com 100% dos testes verdes
- [ ] `npm run build` conclui sem erros de TypeScript
- [ ] Layout renderiza corretamente no browser (npm run dev)
- [ ] Schema SQL pronto para ser executado no Supabase
- [ ] CLAUDE.md atualizado com status "Concluida"
