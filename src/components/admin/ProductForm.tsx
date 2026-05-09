'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { productSchema, type ProductFormData, type ProductFormInput } from '@/lib/validations/product'
import { StockToggle } from './StockToggle'
import { calculatePrice, formatPrintTime } from '@/lib/utils/priceCalculator'
import { slugify } from '@/lib/utils/formatters'
import { formatBRL } from '@/lib/utils/formatters'
import type { Category, Product } from '@/types'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: ProductFormData) => Promise<void>
  loading?: boolean
}

export function ProductForm({ product, categories, onSubmit, loading = false }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? '',
          price: product.price,
          category_id: product.category_id ?? null,
          print_time_minutes: product.print_time_minutes ?? undefined,
          filament_grams: product.filament_grams ?? undefined,
          is_available: product.is_available,
          is_featured: product.is_featured,
          allows_custom_color: product.allows_custom_color,
          allows_custom_size: product.allows_custom_size,
        }
      : { is_available: true, is_featured: false, allows_custom_color: true, allows_custom_size: false },
  })

  const name = watch('name')
  const filamentGrams = watch('filament_grams') ?? 0
  const printTimeMinutes = watch('print_time_minutes') ?? 0
  const isAvailable = watch('is_available')

  const [autoSlug, setAutoSlug] = useState(!product)

  useEffect(() => {
    if (autoSlug && name) setValue('slug', slugify(name))
  }, [name, autoSlug, setValue])

  const suggestedPrice = calculatePrice({ filamentGrams, printTimeMinutes, marginPercent: 150 })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">Nome do produto</label>
          <input
            {...register('name')}
            placeholder="Ex.: Suporte de Fone"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">Slug (URL)</label>
          <input
            {...register('slug')}
            onFocus={() => setAutoSlug(false)}
            placeholder="suporte-de-fone"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors font-mono"
          />
          {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">Categoria</label>
          <select
            {...register('category_id')}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Preço */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">
            Preço (R$)
            {suggestedPrice > 0 && (
              <button
                type="button"
                onClick={() => setValue('price', Math.ceil(suggestedPrice * 10) / 10)}
                className="ml-2 text-brand-300 text-xs hover:underline"
              >
                Usar sugerido: {formatBRL(suggestedPrice)}
              </button>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('price', { valueAsNumber: true })}
            placeholder="29.90"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Tempo de impressão */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">
            Tempo de impressão (min.)
            {printTimeMinutes > 0 && (
              <span className="ml-2 text-zinc-500 text-xs">{formatPrintTime(printTimeMinutes)}</span>
            )}
          </label>
          <input
            type="number"
            min="0"
            {...register('print_time_minutes', { valueAsNumber: true })}
            placeholder="120"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Filamento */}
        <div>
          <label className="block text-white text-sm font-medium mb-1.5">Filamento (g)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            {...register('filament_grams', { valueAsNumber: true })}
            placeholder="45"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-white text-sm font-medium mb-1.5">Descrição</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Descreva o produto..."
          className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
        />
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-800/50 rounded-2xl">
        <div>
          <p className="text-zinc-400 text-xs mb-2">Disponibilidade</p>
          <StockToggle
            available={isAvailable ?? true}
            onChange={(v) => setValue('is_available', v)}
          />
        </div>
        {[
          { field: 'is_featured' as const, label: 'Destaque' },
          { field: 'allows_custom_color' as const, label: 'Cores personalizáveis' },
          { field: 'allows_custom_size' as const, label: 'Tamanho personalizável' },
        ].map(({ field, label }) => (
          <div key={field}>
            <p className="text-zinc-400 text-xs mb-2">{label}</p>
            <StockToggle
              available={watch(field) ?? false}
              onChange={(v) => setValue(field, v)}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-700 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors"
      >
        {loading
          ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</span>
          : product ? 'Salvar alterações' : 'Criar produto'}
      </button>
    </form>
  )
}
