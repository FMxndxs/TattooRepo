'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { availabilityRuleSchema, timeOffSchema } from '@/lib/validations/availability'
import type { AvailabilityRuleFormData, TimeOffFormData } from '@/lib/validations/availability'

// ─── Helper de autorização ────────────────────────────────────────────────────

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

// ─── Availability Rules ───────────────────────────────────────────────────────

export async function createAvailabilityRuleAction(
  data: AvailabilityRuleFormData,
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const client = await assertAdmin()
    const validated = availabilityRuleSchema.parse(data)

    const { data: rule, error } = await client
      .from('availability_rules')
      .insert([{
        weekday: validated.weekday,
        start_time: validated.start_time,
        end_time: validated.end_time,
        is_active: validated.is_active,
      }])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/disponibilidade')
    return { success: true, id: rule.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function deleteAvailabilityRuleAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('availability_rules')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/disponibilidade')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function toggleAvailabilityRuleAction(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('availability_rules')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/disponibilidade')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

// ─── Time Off ──────────────────────────────────────────────────────────────────

export async function createTimeOffAction(
  data: TimeOffFormData,
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const client = await assertAdmin()
    const validated = timeOffSchema.parse(data)

    const { data: timeOff, error } = await client
      .from('time_off')
      .insert([{
        starts_at: validated.starts_at,
        ends_at: validated.ends_at,
        reason: validated.reason || null,
      }])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/disponibilidade')
    return { success: true, id: timeOff.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function deleteTimeOffAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('time_off')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/disponibilidade')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
