'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_CANCELLATION_POLICY } from '@/lib/booking/stateMachine'

type CancellationPolicy = {
  refundable_hours_before?: number
  reschedule_hours_before?: number
  max_reschedules?: number
}

type AppSettingsData = {
  cancellation_policy?: CancellationPolicy
  whatsapp_number?: string | null
  [key: string]: unknown
}

// Mesmo default usado por getPolicy() (src/lib/booking/service.ts) e semeado
// em 100_tattoo_domain.sql — uma única fonte de verdade para o fallback.
const DEFAULT_SETTINGS: AppSettingsData = {
  cancellation_policy: { ...DEFAULT_CANCELLATION_POLICY },
  whatsapp_number: null,
}

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

export async function getAppSettings(): Promise<{ success: boolean; data?: AppSettingsData; error?: string }> {
  try {
    const client = await assertAdmin()

    const { data, error } = await client
      .from('app_settings')
      .select('key, value')

    if (error) throw error

    const settings: AppSettingsData = { ...DEFAULT_SETTINGS }
    if (data && data.length > 0) {
      data.forEach((row) => {
        settings[row.key] = row.value
      })
    }

    return { success: true, data: settings }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

export async function updateAppSetting(
  key: string,
  value: unknown,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await assertAdmin()

    const { error } = await client
      .from('app_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) throw error

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}
