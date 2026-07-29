-- Verificação de regressão RLS — rodar no SQL Editor do Supabase após 104_harden_rls.sql.
-- Não altera nada; falha (RAISE EXCEPTION) se encontrar policies com padrão fraco.

-- ─── 1. Toda tabela de `public` referenciada pelo app tem RLS ativo ──────────
select
  schemaname, tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- ─── 2. Inventário completo de policies vivas ────────────────────────────────
select
  schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by tablename, policyname;

-- ─── 3. Assert: nenhuma policy usa os padrões fracos que esta migration remove ──
do $$
declare
  v_bad record;
  v_found boolean := false;
begin
  for v_bad in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname in ('public', 'storage')
      and (
        qual = 'true'
        or with_check = 'true'
        or qual ilike '%auth.role() = ''authenticated''%'
        or with_check ilike '%auth.role() = ''authenticated''%'
      )
      -- exceções conhecidas e intencionais (leitura de conteúdo público filtrado
      -- por is_active, não `true` puro; ou dados sem risco de PII):
      and policyname not in (
        'portfolio_items_public_read',      -- galeria pública, sem PII (F5 aceito)
        'Leitura pública de imagens de produtos'
      )
  loop
    v_found := true;
    raise warning 'Policy fraca encontrada: %.% "%" — qual=% with_check=%',
      v_bad.schemaname, v_bad.tablename, v_bad.policyname, v_bad.qual, v_bad.with_check;
  end loop;

  if v_found then
    raise exception 'verify_rls: encontradas policies com padrão fraco (ver warnings acima)';
  else
    raise notice 'verify_rls: nenhuma policy fraca encontrada — OK';
  end if;
end $$;

-- ─── 4. Assert: bookings não tem nenhuma policy para anon/authenticated comum ──
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from pg_policies
  where schemaname = 'public' and tablename = 'bookings'
    and policyname <> 'bookings_admin_all';

  if v_count > 0 then
    raise exception 'verify_rls: bookings tem % policy(ies) além de bookings_admin_all — deveria estar fechada a cliente comum', v_count;
  else
    raise notice 'verify_rls: bookings fechada corretamente — OK';
  end if;
end $$;

-- ─── 5. Assert: profiles não concede UPDATE de coluna is_admin a authenticated ──
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from information_schema.column_privileges
  where table_schema = 'public' and table_name = 'profiles'
    and column_name = 'is_admin'
    and grantee = 'authenticated'
    and privilege_type = 'UPDATE';

  if v_count > 0 then
    raise exception 'verify_rls: authenticated ainda tem GRANT UPDATE em profiles.is_admin';
  else
    raise notice 'verify_rls: coluna is_admin protegida — OK';
  end if;
end $$;

