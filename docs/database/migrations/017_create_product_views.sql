-- Tabela de cliques em produtos para ranking dinâmico
create table if not exists public.product_views (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        not null references public.products(id) on delete cascade,
  session_id  text        not null,
  viewed_at   timestamptz not null default now(),
  viewed_day  date        not null default current_date
);

-- 1 clique por sessão por produto por dia
alter table public.product_views
  add constraint product_views_session_product_day_unique
  unique (product_id, session_id, viewed_day);

create index if not exists product_views_product_id_idx on public.product_views (product_id);
create index if not exists product_views_viewed_at_idx  on public.product_views (viewed_at desc);

-- RLS habilitado; escrita apenas via RPC SECURITY DEFINER
alter table public.product_views enable row level security;

-- -------------------------------------------------------
-- RPC: registra um clique (write)
-- -------------------------------------------------------
create or replace function public.register_product_click(
  p_product_id uuid,
  p_session_id text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Ignora produtos indisponíveis ou inexistentes
  if not exists (
    select 1 from public.products
    where id = p_product_id and is_available = true
  ) then
    return;
  end if;

  insert into public.product_views (product_id, session_id)
  values (p_product_id, p_session_id)
  on conflict (product_id, session_id, viewed_day) do nothing;
end;
$$;

grant execute on function public.register_product_click(uuid, text) to anon, authenticated;

-- -------------------------------------------------------
-- RPC: retorna ranking dos 30 últimos dias (read)
-- -------------------------------------------------------
create or replace function public.get_most_clicked_products(p_limit int default 8)
returns table (product_id uuid, click_count bigint)
language sql
security definer
stable
set search_path = public
as $$
  select
    pv.product_id,
    count(*) as click_count
  from public.product_views pv
  where pv.viewed_at >= now() - interval '30 days'
  group by pv.product_id
  order by click_count desc
  limit p_limit;
$$;

grant execute on function public.get_most_clicked_products(int) to anon, authenticated;
