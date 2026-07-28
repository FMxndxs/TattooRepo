'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { Loader2, X } from 'lucide-react'
import { ImageUpload } from '@/components/custom-order/ImageUpload'
import { promotionSchema, type PromotionFormData } from '@/lib/validations/promotion'
import { uploadImage } from '@/lib/supabase/storage'
import { createPromotion, updatePromotion } from '@/app/actions/promotions'
import type { Promotion } from '@/types/booking'

interface PromotionFormProps {
  promotion?: Promotion | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PromotionForm({ promotion, onSuccess, onCancel }: PromotionFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(promotion?.image_url ?? null)
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
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: promotion?.title ?? '',
      description: promotion?.description ?? null,
      valid_from: promotion?.valid_from ?? null,
      valid_until: promotion?.valid_until ?? null,
      is_active: promotion?.is_active ?? true,
      sort_order: promotion?.sort_order ?? 0,
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

  const onSubmit = async (data: PromotionFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      let image_url = promotion?.image_url ?? null

      if (imageFile) {
        try {
          setUploading(true)
          image_url = await uploadImage(imageFile, 'promotions')
        } catch (err) {
          throw new Error(`Erro ao enviar imagem: ${err instanceof Error ? err.message : 'desconhecido'}`)
        } finally {
          setUploading(false)
        }
      }

      if (promotion) {
        const result = await updatePromotion(promotion.id, {
          ...data,
          image_url,
        })
        if (!result.success) throw new Error(result.error)
      } else {
        const result = await createPromotion({
          ...data,
          image_url,
        })
        if (!result.success) throw new Error(result.error)
      }

      reset()
      setImageFile(null)
      setImagePreview(null)
      onSuccess?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar promoção')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Imagem da promoção
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
          Título *
        </label>
        <input
          type="text"
          placeholder="Título da promoção"
          {...register('title')}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Descrição
        </label>
        <textarea
          placeholder="Descrição da promoção (opcional)"
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Válida de (opcional)
          </label>
          <input
            type="date"
            {...register('valid_from')}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors.valid_from && <p className="text-red-400 text-xs mt-1">{errors.valid_from.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Válida até (opcional)
          </label>
          <input
            type="date"
            {...register('valid_until')}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors.valid_until && <p className="text-red-400 text-xs mt-1">{errors.valid_until.message}</p>}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-brand-500 focus:ring-brand-500 cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-zinc-300 cursor-pointer">
          Ativa
        </label>
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
          ) : promotion ? (
            'Atualizar'
          ) : (
            'Criar'
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
