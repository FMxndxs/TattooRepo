-- Migration 030: Habilita Realtime para orders e custom_orders
-- Adiciona as tabelas à publication supabase_realtime para que o cliente
-- receba eventos INSERT/UPDATE/DELETE em tempo real via Supabase Realtime.
-- Projeto Supabase: oflozudwutxgvwyvygll
--
-- Nota: a publication `supabase_realtime` já existe no Supabase por padrão.
-- Se o projeto usa RLS (como o nosso), o cliente só recebe eventos de linhas
-- que ele pode SELECTar — as policies existentes já protegem os dados.

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_orders;
