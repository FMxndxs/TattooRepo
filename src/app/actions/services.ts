'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { serviceSchema } from '@/lib/validations/service'
import type { ServiceFormData } from '@/lib/validations/service'

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

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function createServiceAction(
  data: ServiceFormData,
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const client = await assertAdmin()
    const validated = serviceSchema.parse(data)

    const { data: service, error } = await client
      .from('services')
      .insert([{
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        duration_min: validated.duration_min,
        deposit_amount: validated.deposit_amount,
        price_from: validated.price_from || null,
        is_active: validated.is_active,
      }])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/services')
    return { success: true, id: service.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function updateServiceAction(
  id: string,
  data: ServiceFormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const validated = serviceSchema.parse(data)

    const { error } = await client
      .from('services')
      .update({
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        duration_min: validated.duration_min,
        deposit_amount: validated.deposit_amount,
        price_from: validated.price_from || null,
        is_active: validated.is_active,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/services')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function deleteServiceAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/services')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function toggleServiceActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('services')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/services')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function advanceBookingStatusAction(
  bookingId: string,
  nextStatus: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()
    const { canTransition } = await import('@/lib/booking/stateMachine')

    const { data: booking, error: fetchError } = await client
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single()

    if (fetchError) throw fetchError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!canTransition(booking.status, nextStatus as any)) {
      throw new Error(`Transição inválida de ${booking.status} para ${nextStatus}`)
    }

    const { error } = await client
      .from('bookings')
      .update({ status: nextStatus })
      .eq('id', bookingId)

    if (error) throw error

    revalidatePath('/admin/agenda')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
