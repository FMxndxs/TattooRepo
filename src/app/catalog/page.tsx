'use client'

import { useState, useEffect } from 'react'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import type { Product, Category } from '@/types'
import { createClient } from '@/lib/supabase/browser'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data ?? [])
    })

    let query = supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))')
      .eq('is_available', true)
      .order('is_featured', { ascending: false })

    if (selected) {
      query = query.eq('category.slug', selected) as typeof query
    }

    query.then(({ data }) => {
      const mapped = (data ?? []).map((p) => ({
        ...p,
        colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
      })) as Product[]
      setProducts(mapped)
      setLoading(false)
    })
  }, [selected])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Catálogo</h1>
        <p className="text-zinc-400">Explore todos os nossos produtos impressos em 3D</p>
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
