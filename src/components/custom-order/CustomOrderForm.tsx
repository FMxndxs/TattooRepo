'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { customOrderSchema, type CustomOrderFormData, type CustomOrderFormInput } from '@/lib/validations/customOrder'
import { ImageUpload } from './ImageUpload'
import { useImageUpload } from '@/hooks/useImageUpload'

const STYLES = [
  'Realismo',
  'Blackwork',
  'Fineline',
  'Tribal',
  'Geométrico',
  'Watercolor',
  'Lettering',
  'Minimalista',
  'Pontilhismo',
  'Outro',
]

interface CustomOrderFormProps {
  onSubmit: (data: CustomOrderFormData & { image_url: string | null }) => void
  loading?: boolean
}

export function CustomOrderForm({ onSubmit, loading = false }: CustomOrderFormProps) {
  const { profile } = useAuth()
  const { uploading, preview, uploadedUrl, error: uploadError, handleFile } = useImageUpload()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomOrderFormInput, unknown, CustomOrderFormData>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: { reference_url: '' },
  })

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, image_url: uploadedUrl ?? null }))}
      noValidate
      className="space-y-5"
    >
      {/* Identificação do usuário (read-only) */}
      {fullName && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-700/10 border border-brand-700/30 rounded-xl">
          <User className="w-4 h-4 text-brand-300 shrink-0" />
          <span className="text-zinc-200 text-sm font-medium">{fullName}</span>
        </div>
      )}

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="block text-white text-sm font-medium mb-1.5">
          Descreva sua ideia
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Conte sobre a tatuagem que deseja: tema, significado, tamanho aproximado, local do corpo, detalhes importantes..."
          {...register('description')}
          className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
        />
        {errors.description && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Estilo */}
      <div>
        <label htmlFor="color_name" className="block text-white text-sm font-medium mb-1.5">
          Estilo preferido
        </label>
        <select
          id="color_name"
          {...register('color_name')}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">Selecione um estilo</option>
          {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.color_name && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.color_name.message}</p>
        )}
      </div>

      {/* URL de referência */}
      <div>
        <label htmlFor="reference_url" className="block text-white text-sm font-medium mb-1.5">
          Link com referências <span className="text-zinc-500 font-normal">(opcional)</span>
        </label>
        <input
          id="reference_url"
          placeholder="https://pinterest.com/... ou https://instagram.com/..."
          {...register('reference_url')}
          className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
        />
        {errors.reference_url && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.reference_url.message}</p>
        )}
      </div>

      {/* Upload de imagem */}
      <div>
        <label className="block text-white text-sm font-medium mb-1.5">
          Insira imagem(ns) de inspiração <span className="text-zinc-500 font-normal">(opcional)</span>
        </label>
        <ImageUpload
          preview={preview}
          uploading={uploading}
          error={uploadError}
          onChange={handleFile}
        />
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-brand-700 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors text-base"
      >
        {loading ? 'Enviando...' : 'Enviar solicitação via WhatsApp'}
      </button>
    </form>
  )
}
