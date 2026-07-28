'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Plus } from 'lucide-react'
import { timeOffSchema } from '@/lib/validations/availability'
import { createTimeOffAction, deleteTimeOffAction } from '@/app/actions/availability'
import type { TimeOffFormData } from '@/lib/validations/availability'
import type { TimeOff } from '@/types/booking'

interface TimeOffPanelProps {
  initialTimeOffs: TimeOff[]
}

export function TimeOffPanel({ initialTimeOffs }: TimeOffPanelProps) {
  const [timeOffs, setTimeOffs] = useState(initialTimeOffs)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeOffFormData>({
    resolver: zodResolver(timeOffSchema),
  })

  async function onSubmit(data: TimeOffFormData) {
    setIsSubmitting(true)
    const result = await createTimeOffAction(data)
    setIsSubmitting(false)

    if (result.success) {
      reset()
      setShowForm(false)
      // Re-fetch via revalidatePath
      window.location.reload()
    }
  }

  async function handleDelete(id: string) {
    setDeleteError(null)
    const result = await deleteTimeOffAction(id)
    if (!result.success) {
      setDeleteError(result.error || 'Erro ao deletar')
      return
    }
    setTimeOffs((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Nova Folga</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Data/Hora Inicial
              </label>
              <input
                {...register('starts_at')}
                type="datetime-local"
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.starts_at && (
                <p className="text-red-400 text-xs mt-1">{errors.starts_at.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Data/Hora Final
              </label>
              <input
                {...register('ends_at')}
                type="datetime-local"
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              {errors.ends_at && (
                <p className="text-red-400 text-xs mt-1">{errors.ends_at.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Motivo (opcional)
              </label>
              <input
                {...register('reason')}
                type="text"
                placeholder="Ex: Férias, Feriado, Evento"
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder-zinc-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  reset()
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-medium transition-colors hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Folga
        </button>
      )}

      {timeOffs.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          <p>Nenhuma folga agendada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timeOffs.map((timeOff) => {
            const start = new Date(timeOff.starts_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            const end = new Date(timeOff.ends_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={timeOff.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {timeOff.reason && (
                      <span className="text-white font-bold">{timeOff.reason}</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">
                    {start} — {end}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(timeOff.id)}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {deleteError && (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
          {deleteError}
        </div>
      )}
    </div>
  )
}
