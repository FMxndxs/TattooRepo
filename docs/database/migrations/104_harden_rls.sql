-- Migration 104: Blindagem RLS pós-auditoria (Cycle E)
-- Rodar no SQL Editor do Supabase, após 103_fix_portfolio_seed_image_urls.sql.
--
-- Contexto: auditoria de segurança encontrou 2 falhas P0 que anulam o modelo de
-- autorização do app (middleware/layout/assertAdmin são todos contornáveis via
-- PostgREST direto com a anon key):
--
--   P0-a  profiles_update_own permite qualquer usuário setar o próprio is_admin=true
--         (013_create_profiles.sql + is_admin adicionado por 020 na mesma linha).
--   P0-b  100_tattoo_domain.sql recriou o anti-pattern que 035 removeu:
--         "admin all <tabela>" usa auth.role()='authenticated' — qualquer logado
--         é admin no banco, sem precisar do flag. Pior caso: "admin all bookings"
--         expõe PII + manage_token de toda a clientela.
--
-- Mais achados P1/P2/P3 corrigidos aqui: time_off/settings legíveis por anon,
-- app_settings sem filtro de chave, profiles sem policy de INSERT, custom_orders
-- sem UPDATE/DELETE do dono, bucket "products" deletável por qualquer autenticado,
-- bucket "custom-orders" inexistente, funções órfãs ainda executáveis por anon.
--
-- Idempotente: seguro rodar mais de uma vez (DROP POLICY/FUNCTION IF EXISTS antes
-- de recriar), no estilo de 035_harden_baseline_policies.sql.

-- ============================================================
-- 1. Escalada de privilégio via profiles.is_admin (P0-a)
-- ============================================================

-- 1.1 Trigger de guarda: só service_role pode mudar is_admin.
-- (defesa redundante ao GRANT de coluna abaixo — cobre o caso de o GRANT
-- de tabela ser reconcedido no futuro; privilégio de coluna não vence
-- privilégio de tabela sozinho.)
CREATE OR REPLACE FUNCTION public.guard_profile_is_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN 
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin
     AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'is_admin só pode ser alterado por service_role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_guard_is_admin ON public.profiles;
CREATE TRIGGER profiles_guard_is_admin
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_is_admin();

-- 1.2 Privilégio de coluna: authenticated só escreve nos campos de perfil,
-- nunca em is_admin (nem em id/created_at).
REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT UPDATE (first_name, last_name, phone, neighborhood, city, updated_at)
  ON public.profiles TO authenticated;

-- ============================================================
-- 2. profiles — policies completas (P2-a: faltava INSERT)
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;
CREATE POLICY "profiles_admin_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- "profiles_service_role_all" (013) mantida intacta — necessária ao
-- handle_new_user() trigger e a rotinas server-side.

-- ============================================================
-- 3. Domínio de tatuagem — substitui "admin all *" (auth.role()='authenticated')
--    por is_admin() em todas as 7 tabelas (P0-b)
-- ============================================================

DROP POLICY IF EXISTS "admin all services" ON public.services;
CREATE POLICY "services_admin_all"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin all availability" ON public.availability_rules;
CREATE POLICY "availability_rules_admin_all"
  ON public.availability_rules FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin all time_off" ON public.time_off;
CREATE POLICY "time_off_admin_all"
  ON public.time_off FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- bookings: fechada por completo a cliente comum (ver §4 — sem policy pública)
DROP POLICY IF EXISTS "admin all bookings" ON public.bookings;
CREATE POLICY "bookings_admin_all"
  ON public.bookings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin all promotions" ON public.promotions;
CREATE POLICY "promotions_admin_all"
  ON public.promotions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin all portfolio" ON public.portfolio_items;
CREATE POLICY "portfolio_items_admin_all"
  ON public.portfolio_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin all app_settings" ON public.app_settings;
CREATE POLICY "app_settings_admin_write"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 4. Leitura pública — explicitar TO anon, authenticated e remover o que
--    não deveria ser público (P1-b time_off, P1-c settings)
-- ============================================================

DROP POLICY IF EXISTS "public read services" ON public.services;
CREATE POLICY "services_public_read"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "public read promotions" ON public.promotions;
CREATE POLICY "promotions_public_read"
  ON public.promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "public read portfolio" ON public.portfolio_items;
CREATE POLICY "portfolio_items_public_read"
  ON public.portfolio_items FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "public read availability" ON public.availability_rules;
CREATE POLICY "availability_rules_public_read"
  ON public.availability_rules FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- time_off: remove a leitura pública. Nenhum código público lê esta tabela —
-- disponibilidade é derivada via get_available_slots() (SECURITY DEFINER),
-- que já ignora time_off internamente sem expor `reason`.
DROP POLICY IF EXISTS "public read time_off" ON public.time_off;

-- app_settings: leitura pública só das chaves não sensíveis, não a tabela toda.
DROP POLICY IF EXISTS "app_settings_public_read" ON public.app_settings;
CREATE POLICY "app_settings_public_read"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (key IN ('cancellation_policy', 'whatsapp_number'));

-- ============================================================
-- 5. settings (config de frete legada) — remove leitura anon (P1-c)
-- ============================================================
-- Motivo original ("checkout precisa ler sem login") não existe mais desde
-- que o e-commerce foi removido (101_drop_ecommerce.sql). Só is_admin() lê/escreve.
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
DROP POLICY IF EXISTS "Admin write settings" ON public.settings;
CREATE POLICY "settings_admin_all"
  ON public.settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 6. custom_orders — dono pode editar/apagar o próprio orçamento
-- ============================================================
DROP POLICY IF EXISTS "custom_orders_update_own" ON public.custom_orders;
CREATE POLICY "custom_orders_update_own"
  ON public.custom_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "custom_orders_delete_own" ON public.custom_orders;
CREATE POLICY "custom_orders_delete_own"
  ON public.custom_orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. Storage — bucket "products" só admin escreve/apaga (P1-d)
-- ============================================================
DROP POLICY IF EXISTS "Upload de imagens de produtos por admin autenticado" ON storage.objects;
CREATE POLICY "products_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

DROP POLICY IF EXISTS "Remoção de imagens de produtos por admin autenticado" ON storage.objects;
CREATE POLICY "products_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products' AND public.is_admin());

DROP POLICY IF EXISTS "products_admin_update" ON storage.objects;
CREATE POLICY "products_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products' AND public.is_admin())
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

-- "Leitura pública de imagens de produtos" (012) mantida intacta.

-- Bucket custom-orders — usado por useImageUpload.ts/storage.ts mas nunca
-- criado. Público (o código lê via getPublicUrl e o admin exibe a foto de
-- referência num <a href> direto em OrdersPanel — trocar para signed URL é
-- um refactor maior, fora do escopo desta blindagem). Mantido público, mas
-- escrita/apagar restritos ao próprio prefixo `${auth.uid()}/...`, então um
-- usuário não pode mais sobrescrever ou apagar o upload de outro.
insert into storage.buckets (id, name, public)
values ('custom-orders', 'custom-orders', true)
on conflict (id) do nothing;

DROP POLICY IF EXISTS "Leitura pública de imagens de custom-orders" ON storage.objects;
CREATE POLICY "Leitura pública de imagens de custom-orders"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'custom-orders');

DROP POLICY IF EXISTS "custom_orders_own_insert" ON storage.objects;
CREATE POLICY "custom_orders_own_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'custom-orders'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "custom_orders_own_delete" ON storage.objects;
CREATE POLICY "custom_orders_own_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'custom-orders'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 8. Limpeza de funções/publicações órfãs (P3) — sobraram da fase e-commerce
--    depois de 101_drop_ecommerce.sql (DROP TABLE ... CASCADE não derruba
--    funções que só referenciam a tabela por corpo, não por dependência).
-- ============================================================
DROP FUNCTION IF EXISTS public.register_product_click(uuid, text);
DROP FUNCTION IF EXISTS public.get_most_clicked_products(int);
DROP FUNCTION IF EXISTS public.create_order_atomic(
  uuid, numeric, numeric, text, text, text, text, text, text, text, text, text, jsonb
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.orders';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bookings'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings';
  END IF;
END $$;

-- ============================================================
-- Notas
-- ============================================================
-- • bookings permanece SEM policy de leitura/escrita para anon/authenticated
--   comum (decisão: fechar em vez de adicionar user_id — o fluxo /agendar é
--   100% anônimo hoje). Cliente só acessa via:
--     - get_available_slots()  (SECURITY DEFINER, só devolve horários livres)
--     - get_booking_by_token() (SECURITY DEFINER, exige manage_token)
--     - Server Actions em src/app/actions/bookings.ts (service role)
-- • is_admin() (020/035) não foi alterada — continua SECURITY DEFINER para
--   evitar recursão de RLS contra profiles.
-- • Ver docs/database/verify_rls.sql para a query de regressão desta migration.
