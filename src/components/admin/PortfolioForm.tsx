'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/custom-order/ImageUpload'
import { portfolioSchema, type PortfolioFormData } from '@/lib/validations/portfolio'
import { uploadImage } from '@/lib/supabase/storage'
import { createPortfolioItem, updatePortfolioItem } from '@/app/actions/portfolio'
import type { PortfolioItem } from '@/types/booking'

interface PortfolioFormProps {
  item?: PortfolioItem | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PortfolioForm({ item, onSuccess, onCancel }: PortfolioFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: item?.title ?? null,
      style: item?.style ?? null,
      body_placement: item?.body_placement ?? null,
      sort_order: item?.sort_order ?? 0,
    },
  })

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      setUploadError(null)
      return
    }

    setImageFile(file)
    setUploadError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Image is required for new items
      let image_url = item?.image_url

      if (imageFile) {
        try {
          setUploading(true)
          image_url = await uploadImage(imageFile, 'portfolio')
        } catch (err) {
          throw new Error(`Erro ao enviar imagem: ${err instanceof Error ? err.message : 'desconhecido'}`)
        } finally {
          setUploading(false)
        }
      } else if (!item) {
        throw new Error('Imagem é obrigatória para novos trabalhos')
      }

      if (item) {
        const result = await updatePortfolioItem(item.id, {
          ...data,
          image_url: image_url!,
        })
        if (!result.success) throw new Error(result.error)
      } else {
        const result = await createPortfolioItem({
          ...data,
          image_url: image_url!,
        })
        if (!result.success) throw new Error(result.error)
      }

      reset()
      setImageFile(null)
      setImagePreview(null)
      onSuccess?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar trabalho')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Imagem do trabalho {!item && '*'}
        </label>
        <ImageUpload
          preview={imagePreview}
          uploading={uploading}
          error={uploadError}
          onChange={handleImageChange}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Título do trabalho
        </label>
        <input
          type="text"
          placeholder="Nome ou descrição breve (opcional)"
          {...register('title')}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Style */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Estilo
        </label>
        <input
          type="text"
          placeholder="Ex: Blackwork, Color Realism, Tribal (opcional)"
          {...register('style')}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        {errors.style && <p className="text-red-400 text-xs mt-1">{errors.style.message}</p>}
      </div>

      {/* Local do corpo */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Local do corpo
        </label>
        <input
          type="text"
          placeholder="Ex: braço, antebraço, perna, costas, mão, peito (opcional)"
          {...register('body_placement')}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        {errors.body_placement && <p className="text-red-400 text-xs mt-1">{errors.body_placement.message}</p>}
      </div>

      {/* Errors */}
      {submitError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : item ? (
            'Atualizar'
          ) : (
            'Adicionar'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
