import { StudioSettingsForm } from '@/components/admin/StudioSettingsForm'
import { getAppSettings } from '@/app/actions/settings'

export default async function AdminSettingsPage() {
  const result = await getAppSettings()

  const initialData = result.success && result.data
    ? {
        whatsapp_number: result.data.whatsapp_number ?? null,
        cancellation_policy: result.data.cancellation_policy ?? {
          refundable_hours_before: 24,
          reschedule_hours_before: 12,
          max_reschedules: 3,
        },
      }
    : {
        whatsapp_number: null,
        cancellation_policy: {
          refundable_hours_before: 24,
          reschedule_hours_before: 12,
          max_reschedules: 3,
        },
      }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 mt-1">Parâmetros do estúdio de tatuagem.</p>
      </div>

      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-white font-semibold mb-1">Estúdio</h2>
        <p className="text-zinc-500 text-sm mb-6">
          Configure contato do WhatsApp e políticas de cancelamento/remarcação.
        </p>
        <StudioSettingsForm initialData={initialData} />
      </section>
    </div>
  )
}
