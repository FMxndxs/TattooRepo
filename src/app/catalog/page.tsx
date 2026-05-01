'use client'

import { useState, useEffect } from 'react'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { PrintLayerSkeletonGrid } from '@/components/ui/PrintLayerSkeleton'
import type { Product, Category } from '@/types'
import { createClient } from '@/lib/supabase/browser'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    ;(async () => {
      setLoading(true)

      const { data: cats } = await supabase.from('categories').select('*').order('name')
      if (cancelled) return
      setCategories(cats ?? [])

      let q = supabase
        .from('products')
        .select(
          '*, category:categories(*), images:product_images(*), colors:product_colors(color:colors(*))',
        )
        .eq('is_available', true)
        .order('is_featured', { ascending: false })

      // Filtra pela FK (slug vem só do metadata em categories; `.eq('category.slug', …)` não filtra no PostgREST).
      if (selected) {
        const cat = cats?.find((c) => c.slug === selected)
        if (!cat) {
          setProducts([])
          setLoading(false)
          return
        }
        q = q.eq('category_id', cat.id)
      }

      const { data } = await q
      if (cancelled) return
      const mapped = (data ?? []).map((p) => ({
        ...p,
        colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
      })) as Product[]
      setProducts(mapped)
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
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
        <PrintLayerSkeletonGrid count={8} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
