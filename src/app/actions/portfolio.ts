'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { PortfolioItem } from '@/types/booking'

async function assertAdmin() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: profile } = await client
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) throw new Error('Acesso negado: requer permissão de admin')

  return client
}

function revalidatePortfolio() {
  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
}

export async function createPortfolioItem(
  data: Omit<PortfolioItem, 'id' | 'created_at'>,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = await assertAdmin()

    const { data: item, error } = await client
      .from('portfolio_items')
      .insert([data])
      .select('id')
      .single()

    if (error) throw error

    revalidatePortfolio()
    return { success: true, id: item?.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<Omit<PortfolioItem, 'id' | 'created_at'>>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('portfolio_items')
      .update(data)
      .eq('id', id)

    if (error) throw error

    revalidatePortfolio()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function deletePortfolioItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('portfolio_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePortfolio()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
