'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/browser'
import type { ProductFormData } from '@/lib/validations/product'
import type { Category } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    createClient().from('categories').select('*').order('name').then(({ data }) => {
      setCategories((data ?? []) as Category[])
    })
  }, [])

  async function handleSubmit(data: ProductFormData, imageUrl: string | null | undefined) {
    setLoading(true)
    const supabase = createClient()

    const { data: inserted, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category_id: data.category_id || null,
        print_time_minutes: data.print_time_minutes || null,
        filament_grams: data.filament_grams || null,
        is_available: data.is_available,
        is_featured: data.is_featured,
        allows_custom_color: data.allows_custom_color,
        allows_custom_size: data.allows_custom_size,
        makerworld_url: data.makerworld_url || null,
      })
      .select('id')
      .single()

    if (!error && inserted && imageUrl) {
      await supabase.from('product_images').insert({
        product_id: inserted.id,
        url: imageUrl,
        is_primary: true,
        sort_order: 0,
      })
    }

    setLoading(false)
    if (!error) router.push('/admin/products')
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar aos produtos
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">Novo produto</h1>
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <ProductForm categories={categories} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
