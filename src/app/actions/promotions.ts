'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Promotion } from '@/types/booking'

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

function revalidatePromotions() {
  revalidatePath('/admin/promocoes')
  revalidatePath('/promocoes')
  revalidatePath('/')
}

export async function createPromotion(
  data: Omit<Promotion, 'id' | 'created_at'> & { image_url?: string | null },
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = await assertAdmin()

    const { data: promotion, error } = await client
      .from('promotions')
      .insert([data])
      .select('id')
      .single()

    if (error) throw error

    revalidatePromotions()
    return { success: true, id: promotion?.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function updatePromotion(
  id: string,
  data: Partial<Omit<Promotion, 'id' | 'created_at'>>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('promotions')
      .update(data)
      .eq('id', id)

    if (error) throw error

    revalidatePromotions()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function deletePromotion(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePromotions()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function togglePromotionActive(
  id: string,
  is_active: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('promotions')
      .update({ is_active })
      .eq('id', id)

    if (error) throw error

    revalidatePromotions()
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
