'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import type { Product, Category } from '@/types'

const ITEMS_PER_PAGE = 20

interface CatalogClientProps {
  products: Product[]
  categories: Category[]
  selected: string | null
}

export function CatalogClient({ products, categories, selected }: CatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  function handleSelect(slug: string | null) {
    setPage(1)
    startTransition(() => {
      if (slug) {
        router.push(`${pathname}?categoria=${slug}`)
      } else {
        router.push(pathname)
      }
    })
  }

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
          onSelect={handleSelect}
        />
      </div>

      <div className={isPending ? 'opacity-60 pointer-events-none transition-opacity duration-200' : ''}>
        {products.length === 0 ? (
          <p className="text-zinc-500 text-center py-16">Nenhum produto encontrado nesta categoria.</p>
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
                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, products.length)} de{' '}
                {products.length} produtos
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
