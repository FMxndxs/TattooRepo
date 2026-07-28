-- ============================================================
-- TattooRepo — Domínio de tatuagem (agenda, sinal, promoções)
-- Executar no SQL Editor do Supabase APÓS o schema base.
-- Fonte da verdade da agenda: este banco. Google Calendar é espelho.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists btree_gist; -- p/ EXCLUDE constraint anti-double-booking

-- ─── SERVIÇOS (tipos de sessão) ──────────────────────────────
create table services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  duration_min int not null default 60,          -- duração do slot
  deposit_amount numeric(10,2) not null default 0,-- valor do sinal (garantia de reserva)
  price_from numeric(10,2),                        -- "a partir de" (informativo)
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ─── REGRAS DE DISPONIBILIDADE (semanais recorrentes) ────────
create table availability_rules (
  id uuid primary key default uuid_generate_v4(),
  weekday int not null check (weekday between 0 and 6), -- 0=domingo ... 6=sábado
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  check (end_time > start_time)
);

-- ─── BLOQUEIOS PONTUAIS (folgas/feriados) ────────────────────
create table time_off (
  id uuid primary key default uuid_generate_v4(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  check (ends_at > starts_at)
);

-- ─── AGENDAMENTOS ────────────────────────────────────────────
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','confirmed','cancelled','no_show','done')),
  deposit_amount numeric(10,2) not null default 0,
  hold_expires_at timestamptz,                    -- pending expira se não pagar
  mp_payment_id text unique,                       -- idempotência do webhook
  gcal_event_id text,                              -- id do evento espelhado no Google Calendar
  manage_token uuid not null default uuid_generate_v4(), -- link público de gestão
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (ends_at > starts_at)
);

create index bookings_starts_at_idx on bookings (starts_at);
create index bookings_manage_token_idx on bookings (manage_token);

-- Anti double-booking: nenhum par de bookings ATIVOS pode sobrepor no tempo.
-- Ativo = confirmed, done, ou pending_payment ainda não expirado.
-- ponytail: hold expirado é ignorado via WHERE parcial; um job/limpeza opcional
-- pode marcar 'cancelled', mas o cálculo de slots já desconsidera expirados.
alter table bookings add constraint bookings_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (
    status in ('confirmed','done')
    or (status = 'pending_payment' and hold_expires_at > now())
  );

-- ─── PROMOÇÕES ───────────────────────────────────────────────
create table promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  valid_from date,
  valid_until date,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ─── PORTFÓLIO (trabalhos realizados, sem venda) ─────────────
create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  title text,
  image_url text not null,
  style text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ─── SETTINGS extra (política de cancelamento) ───────────────
-- Reaproveita a tabela settings do base se existir; senão cria pares chave/valor.
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
insert into settings (key, value) values
  ('cancellation_policy', '{"refundable_hours_before": 72, "reschedule_hours_before": 48, "max_reschedules": 1}')
  on conflict (key) do nothing;

-- ─── updated_at trigger ──────────────────────────────────────
create trigger bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table services          enable row level security;
alter table availability_rules enable row level security;
alter table time_off          enable row level security;
alter table bookings          enable row level security;
alter table promotions        enable row level security;
alter table portfolio_items   enable row level security;
alter table settings          enable row level security;

-- Leitura pública do que o site mostra
create policy "public read services"    on services        for select using (is_active = true);
create policy "public read promotions"  on promotions      for select using (is_active = true);
create policy "public read portfolio"   on portfolio_items for select using (true);
create policy "public read availability"on availability_rules for select using (is_active = true);
create policy "public read time_off"    on time_off        for select using (true);

-- Bookings: SEM acesso público direto (nem select nem insert).
-- Criação e confirmação passam por Server Action / webhook usando service role,
-- que ignora RLS. Gestão pública é feita por RPC SECURITY DEFINER via manage_token.

-- Admin (autenticado) faz tudo
create policy "admin all services"     on services          for all using (auth.role() = 'authenticated');
create policy "admin all availability" on availability_rules for all using (auth.role() = 'authenticated');
create policy "admin all time_off"     on time_off          for all using (auth.role() = 'authenticated');
create policy "admin all bookings"     on bookings          for all using (auth.role() = 'authenticated');
create policy "admin all promotions"   on promotions        for all using (auth.role() = 'authenticated');
create policy "admin all portfolio"    on portfolio_items   for all using (auth.role() = 'authenticated');
create policy "admin all settings"     on settings          for all using (auth.role() = 'authenticated');

-- ============================================================
-- RPC: slots disponíveis para um serviço num intervalo de datas
-- Gera slots a partir das availability_rules, remove time_off e bookings ativos.
-- SECURITY DEFINER: roda com privilégios do dono (lê bookings sob RLS bypass),
-- mas só devolve horários LIVRES — nunca dados de clientes.
-- ============================================================
create or replace function get_available_slots(
  p_service_id uuid,
  p_from timestamptz,
  p_to   timestamptz
)
returns table (slot_start timestamptz, slot_end timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration int;
  v_step interval;
begin
  select duration_min into v_duration from services where id = p_service_id and is_active = true;
  if v_duration is null then return; end if;
  v_step := make_interval(mins => v_duration);

  return query
  with days as (
    select generate_series(date_trunc('day', p_from), date_trunc('day', p_to), interval '1 day') as day
  ),
  candidate_slots as (
    select
      gs as slot_start,
      gs + v_step as slot_end
    from days d
    join availability_rules r
      on r.is_active and r.weekday = extract(dow from d.day)::int
    cross join lateral generate_series(
      d.day + r.start_time,
      d.day + r.end_time - v_step,
      v_step
    ) as gs
  )
  select c.slot_start, c.slot_end
  from candidate_slots c
  where c.slot_start >= greatest(p_from, now())
    and c.slot_end <= p_to
    -- não conflita com folgas
    and not exists (
      select 1 from time_off t
      where tstzrange(t.starts_at, t.ends_at) && tstzrange(c.slot_start, c.slot_end)
    )
    -- não conflita com bookings ativos
    and not exists (
      select 1 from bookings b
      where (b.status in ('confirmed','done')
             or (b.status = 'pending_payment' and b.hold_expires_at > now()))
        and tstzrange(b.starts_at, b.ends_at) && tstzrange(c.slot_start, c.slot_end)
    )
  order by c.slot_start;
end;
$$;

grant execute on function get_available_slots(uuid, timestamptz, timestamptz) to anon, authenticated;

-- ============================================================
-- RPC: gestão pública de booking via manage_token (cancelar/remarcar)
-- Retorna dados mínimos do booking; escrita validada no app.
-- ============================================================
create or replace function get_booking_by_token(p_token uuid)
returns table (
  id uuid, service_name text, starts_at timestamptz, ends_at timestamptz,
  status text, deposit_amount numeric, customer_name text
)
language sql
security definer
set search_path = public
as $$
  select b.id, s.name, b.starts_at, b.ends_at, b.status, b.deposit_amount, b.customer_name
  from bookings b join services s on s.id = b.service_id
  where b.manage_token = p_token;
$$;

grant execute on function get_booking_by_token(uuid) to anon, authenticated;

-- ─── SEED inicial (Kadu Freitas) ─────────────────────────────
insert into services (name, slug, description, duration_min, deposit_amount, price_from, sort_order) values
  ('Flash / Tattoo pequena', 'flash', 'Desenhos prontos do catálogo', 60, 50.00, 150.00, 1),
  ('Sessão fechada', 'sessao', 'Projeto autoral, sessão de horas', 240, 100.00, 600.00, 2),
  ('Orçamento personalizado', 'personalizado', 'Envie sua ideia para orçamento', 60, 0, null, 3)
  on conflict (slug) do nothing;

-- Disponibilidade padrão: ter-sáb 10h-19h
insert into availability_rules (weekday, start_time, end_time) values
  (2,'10:00','19:00'),(3,'10:00','19:00'),(4,'10:00','19:00'),(5,'10:00','19:00'),(6,'10:00','19:00');
