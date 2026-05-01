'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customOrderSchema, type CustomOrderFormData, type CustomOrderFormInput } from '@/lib/validations/customOrder'
import { ImageUpload } from './ImageUpload'
import { useImageUpload } from '@/hooks/useImageUpload'

const COLORS = ['Preto', 'Branco', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja', 'Rosa', 'Roxo']

interface CustomOrderFormProps {
  onSubmit: (data: CustomOrderFormData & { image_url: string | null }) => void
  loading?: boolean
}

export function CustomOrderForm({ onSubmit, loading = false }: CustomOrderFormProps) {
  const { uploading, preview, uploadedUrl, error: uploadError, handleFile } = useImageUpload()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomOrderFormInput, unknown, CustomOrderFormData>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: { reference_url: '' },
  })

  const fields: { id: keyof CustomOrderFormData; label: string; placeholder: string; type?: string }[] = [
    { id: 'name', label: 'Nome', placeholder: 'Seu nome completo' },
    { id: 'phone', label: 'Telefone', placeholder: '(11) 98765-4321' },
  ]

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, image_url: uploadedUrl }))}
      noValidate
      className="space-y-5"
    >
      {/* Nome e Telefone */}
      {fields.map(({ id, label, placeholder }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-white text-sm font-medium mb-1.5">{label}</label>
          <input
            id={id}
            placeholder={placeholder}
            {...register(id)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors[id] && <p role="alert" className="text-red-400 text-xs mt-1">{errors[id]?.message}</p>}
        </div>
      ))}

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="block text-white text-sm font-medium mb-1.5">
          Descrição do projeto
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Descreva o que você quer imprimir: tamanho, finalidade, detalhes importantes..."
          {...register('description')}
          className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
        />
        {errors.description && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Cor */}
      <div>
        <label htmlFor="color_name" className="block text-white text-sm font-medium mb-1.5">Cor desejada</label>
        <select
          id="color_name"
          {...register('color_name')}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">Selecione uma cor</option>
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.color_name && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.color_name.message}</p>
        )}
      </div>

      {/* URL de referência */}
      <div>
        <label htmlFor="reference_url" className="block text-white text-sm font-medium mb-1.5">
          Link de referência <span className="text-zinc-500 font-normal">(opcional)</span>
        </label>
        <input
          id="reference_url"
          placeholder="https://makerworld.com/..."
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
          Imagem de referência <span className="text-zinc-500 font-normal">(opcional)</span>
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
