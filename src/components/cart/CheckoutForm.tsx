'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout'
import type { CustomerInfo } from '@/types'

interface CheckoutFormProps {
  onSubmit: (data: CustomerInfo) => void
  loading?: boolean
}

export function CheckoutForm({ onSubmit, loading = false }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })

  const fields: { id: keyof CheckoutFormData; label: string; placeholder: string }[] = [
    { id: 'name', label: 'Nome', placeholder: 'Seu nome completo' },
    { id: 'phone', label: 'Telefone', placeholder: '(11) 98765-4321' },
    { id: 'neighborhood', label: 'Bairro', placeholder: 'Seu bairro' },
    { id: 'city', label: 'Cidade', placeholder: 'Sua cidade' },
  ]

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate className="space-y-4">
      {fields.map(({ id, label, placeholder }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-white text-sm font-medium mb-1.5">
            {label}
          </label>
          <input
            id={id}
            placeholder={placeholder}
            {...register(id)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
          {errors[id] && (
            <p role="alert" className="text-red-400 text-xs mt-1">
              {errors[id]?.message}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors text-base mt-2"
      >
        {loading ? 'Processando...' : 'Finalizar pedido via WhatsApp'}
      </button>
    </form>
  )
}
