'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { serviceSchema } from '@/lib/validations/service'
import { createServiceAction, updateServiceAction } from '@/app/actions/services'
import type { ServiceFormData } from '@/lib/validations/service'
import type { Service } from '@/types/booking'

interface ServiceFormProps {
  service?: Service
  onClose: () => void
  onSuccess?: () => void
}

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name ?? '',
      slug: service?.slug ?? '',
      description: service?.description ?? null,
      duration_min: service?.duration_min ?? 60,
      deposit_amount: service?.deposit_amount ?? 0,
      price_from: service?.price_from ?? null,
      is_active: service?.is_active ?? true,
    },
  })

  async function onSubmit(data: ServiceFormData) {
    setIsLoading(true)
    setError(null)

    const result = service
      ? await updateServiceAction(service.id, data)
      : await createServiceAction(data)

    setIsLoading(false)

    if (!result.success) {
      setError(result.error || 'Erro desconhecido')
      return
    }

    onSuccess?.()
    onClose()
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          {service ? 'Editar Serviço' : 'Novo Serviço'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Nome
          </label>
          <input
            {...register('name')}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            placeholder="Ex: Flash / Tattoo pequena"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Slug
          </label>
          <input
            {...register('slug')}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            placeholder="Ex: flash"
          />
          {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Descrição
          </label>
          <textarea
            {...register('description')}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
            placeholder="Descrição opcional"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Duração (min)
            </label>
            <input
              {...register('duration_min', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
            {errors.duration_min && (
              <p className="text-red-400 text-xs mt-1">{errors.duration_min.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Sinal (R$)
            </label>
            <input
              {...register('deposit_amount', { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
            {errors.deposit_amount && (
              <p className="text-red-400 text-xs mt-1">{errors.deposit_amount.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Preço a partir de (R$)
          </label>
          <input
            {...register('price_from', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors.price_from && (
            <p className="text-red-400 text-xs mt-1">{errors.price_from.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('is_active')}
            type="checkbox"
            className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded cursor-pointer"
          />
          <label className="text-sm font-medium text-zinc-300">Ativo</label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-medium transition-colors hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : service ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  )
}
