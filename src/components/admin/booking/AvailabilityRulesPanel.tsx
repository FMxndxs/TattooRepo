'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Check, X, Plus } from 'lucide-react'
import { availabilityRuleSchema } from '@/lib/validations/availability'
import { createAvailabilityRuleAction, deleteAvailabilityRuleAction, toggleAvailabilityRuleAction } from '@/app/actions/availability'
import type { AvailabilityRuleFormData } from '@/lib/validations/availability'
import type { AvailabilityRule } from '@/types/booking'

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

interface AvailabilityRulesPanelProps {
  initialRules: AvailabilityRule[]
}

export function AvailabilityRulesPanel({ initialRules }: AvailabilityRulesPanelProps) {
  const [rules, setRules] = useState(initialRules)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AvailabilityRuleFormData>({
    resolver: zodResolver(availabilityRuleSchema),
    defaultValues: {
      weekday: 1,
      start_time: '10:00',
      end_time: '19:00',
      is_active: true,
    },
  })

  async function onSubmit(data: AvailabilityRuleFormData) {
    setIsSubmitting(true)
    const result = await createAvailabilityRuleAction(data)
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
    const result = await deleteAvailabilityRuleAction(id)
    if (!result.success) {
      setDeleteError(result.error || 'Erro ao deletar')
      return
    }
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleToggleActive(rule: AvailabilityRule) {
    const result = await toggleAvailabilityRuleAction(rule.id, rule.is_active)
    if (result.success) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id ? { ...r, is_active: !r.is_active } : r
        )
      )
    }
  }

  // Group rules by weekday
  const rulesByWeekday: Record<number, AvailabilityRule[]> = {}
  rules.forEach((rule) => {
    if (!rulesByWeekday[rule.weekday]) {
      rulesByWeekday[rule.weekday] = []
    }
    rulesByWeekday[rule.weekday].push(rule)
  })

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Novo Horário</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Dia da Semana
              </label>
              <select
                {...register('weekday', { valueAsNumber: true })}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              >
                {WEEKDAYS.map((day, idx) => (
                  <option key={idx} value={idx}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.weekday && (
                <p className="text-red-400 text-xs mt-1">{errors.weekday.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Horário Inicial
                </label>
                <input
                  {...register('start_time')}
                  type="time"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                {errors.start_time && (
                  <p className="text-red-400 text-xs mt-1">{errors.start_time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Horário Final
                </label>
                <input
                  {...register('end_time')}
                  type="time"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                {errors.end_time && (
                  <p className="text-red-400 text-xs mt-1">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                {...register('is_active')}
                type="checkbox"
                className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded cursor-pointer"
              />
              <label className="text-sm font-medium text-zinc-300">Ativo</label>
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
          Novo Horário
        </button>
      )}

      {rules.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          <p>Nenhum horário definido.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {WEEKDAYS.map((day, weekday) => {
            const dayRules = rulesByWeekday[weekday] || []
            return (
              <div key={weekday} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-bold text-white mb-3">{day}</h4>
                {dayRules.length === 0 ? (
                  <p className="text-sm text-zinc-500">Sem horários</p>
                ) : (
                  <div className="space-y-2">
                    {dayRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-mono">
                            {rule.start_time} - {rule.end_time}
                          </span>
                          {rule.is_active && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
                              Ativo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(rule)}
                            title={rule.is_active ? 'Desativar' : 'Ativar'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              rule.is_active
                                ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                                : 'bg-zinc-700 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {rule.is_active ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
