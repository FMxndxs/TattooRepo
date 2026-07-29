'use client'

import { useState, useTransition } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import { updateAppSetting } from '@/app/actions/settings'

type StudioSettings = {
  whatsapp_number?: string | null
  cancellation_policy?: {
    refundable_hours_before?: number
    reschedule_hours_before?: number
    max_reschedules?: number
  } | null
}

export function StudioSettingsForm({ initialData = {} }: { initialData?: StudioSettings }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<StudioSettings>({
    whatsapp_number: initialData.whatsapp_number ?? '',
    cancellation_policy: initialData.cancellation_policy ?? {
      refundable_hours_before: 24,
      reschedule_hours_before: 12,
      max_reschedules: 3,
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        // Atualizar política de cancelamento
        if (data.cancellation_policy) {
          const result = await updateAppSetting('cancellation_policy', data.cancellation_policy)
          if (!result.success) {
            throw new Error(result.error || 'Erro ao salvar configurações')
          }
        }

        // Atualizar número de WhatsApp (se houver implementação de persistência)
        if (data.whatsapp_number) {
          const result = await updateAppSetting('whatsapp_number', data.whatsapp_number)
          if (!result.success) {
            throw new Error(result.error || 'Erro ao salvar número WhatsApp')
          }
        }

        showToast('Configurações salvas com sucesso!', 'success')
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao salvar', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Número WhatsApp
        </label>
        <input
          type="text"
          placeholder="55 11 98952-5014"
          value={data.whatsapp_number || ''}
          onChange={(e) => setData({ ...data, whatsapp_number: e.target.value })}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="text-white text-sm font-semibold">Política de Cancelamento</legend>

        <div>
          <label className="block text-zinc-300 text-xs font-medium mb-1">
            Reembolso disponível até (horas antes)
          </label>
          <input
            type="number"
            value={data.cancellation_policy?.refundable_hours_before ?? 24}
            onChange={(e) => setData({
              ...data,
              cancellation_policy: {
                ...data.cancellation_policy,
                refundable_hours_before: parseInt(e.target.value),
              },
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-xs font-medium mb-1">
            Remarcação permitida até (horas antes)
          </label>
          <input
            type="number"
            value={data.cancellation_policy?.reschedule_hours_before ?? 12}
            onChange={(e) => setData({
              ...data,
              cancellation_policy: {
                ...data.cancellation_policy,
                reschedule_hours_before: parseInt(e.target.value),
              },
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-xs font-medium mb-1">
            Máximo de remarcações
          </label>
          <input
            type="number"
            value={data.cancellation_policy?.max_reschedules ?? 3}
            onChange={(e) => setData({
              ...data,
              cancellation_policy: {
                ...data.cancellation_policy,
                max_reschedules: parseInt(e.target.value),
              },
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-brand-700 hover:bg-brand-600 disabled:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {isPending ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  )
}
