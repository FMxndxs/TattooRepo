'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/browser'
import type { ProductFormData } from '@/lib/validations/product'
import type { Category, Product } from '@/types'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('products').select('*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))').eq('id', id).single(),
      supabase.from('categories').select('*').order('name'),
    ]).then(([{ data: product }, { data: cats }]) => {
      setProduct(product as Product)
      setCategories((cats ?? []) as Category[])
    })
  }, [id])

  async function handleSubmit(data: ProductFormData, imageUrl: string | null | undefined) {
    setLoading(true)
    const supabase = createClient()

    await supabase.from('products').update({
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
    }).eq('id', id)

    // imageUrl === undefined → não mexe nas imagens
    // imageUrl === null     → remove todas as imagens do produto
    // imageUrl === string   → substitui pela nova foto principal
    if (imageUrl !== undefined) {
      await supabase.from('product_images').delete().eq('product_id', id)
      if (imageUrl) {
        await supabase.from('product_images').insert({
          product_id: id,
          url: imageUrl,
          is_primary: true,
          sort_order: 0,
        })
      }
    }

    setLoading(false)
    router.push('/admin/products')
  }

  if (!product) return (
    <div className="p-8">
      <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-4" />
      <div className="h-96 bg-zinc-900 rounded-2xl animate-pulse" />
    </div>
  )

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar aos produtos
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">Editar produto</h1>
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <ProductForm product={product} categories={categories} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
