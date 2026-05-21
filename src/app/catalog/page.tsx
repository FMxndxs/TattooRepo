'use client'

import { useState, useEffect } from 'react'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { PrintLayerSkeletonGrid } from '@/components/ui/PrintLayerSkeleton'
import type { Product, Category } from '@/types'
import { createClient } from '@/lib/supabase/browser'

const ITEMS_PER_PAGE = 20

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setPage(1) 

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

      const { data, error: productsError } = await q
      if (productsError) console.error('[catalog] products query error:', productsError)
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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <>
          <ProductGrid products={paginated} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium border transition-colors ${
                    p === page
                      ? 'bg-brand-700 border-brand-500 text-white'
                      : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Próxima →
              </button>
            </div>
          )}

          {products.length > 0 && (
            <p className="text-center text-zinc-600 text-xs mt-4">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, products.length)} de {products.length} produtos
            </p>
          )}
        </>
      )}
    </div>
  )
}
