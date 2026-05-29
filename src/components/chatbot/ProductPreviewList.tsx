'use client'

import { useState, useEffect, useRef } from 'react'
import { getProductsByCategory } from '@/lib/supabase/clientQueries'
import { ProductPreviewCard } from './ProductPreviewCard'
import type { Product } from '@/types'
import type { ChatSubFilter } from '@/lib/chatbot/types'

interface ProductPreviewListProps {
  categorySlug: string
  subFilter?: ChatSubFilter
  limit?: number
}

function ChatProductSkeleton() {
  return (
    <div className="flex gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/40 animate-pulse">
      <div className="w-16 h-16 shrink-0 rounded-lg bg-zinc-800" />
      <div className="flex-1 py-1 space-y-2">
        <div className="h-3 bg-zinc-800 rounded-lg w-4/5" />
        <div className="h-3 bg-zinc-800/70 rounded-lg w-3/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 w-14 bg-brand-900/60 rounded-lg" />
          <div className="flex gap-1.5">
            <div className="h-5 w-8 bg-zinc-800 rounded-full" />
            <div className="h-5 w-10 bg-zinc-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Module-level cache keyed by categorySlug (base fetch — filters applied in memory)
const productCache = new Map<string, Product[]>()

function applyFilter(products: Product[], subFilter?: ChatSubFilter, limit = 3): Product[] {
  let result = [...products]

  if (subFilter === 'featured') {
    const featured = result.filter((p) => p.is_featured)
    result = featured.length > 0 ? featured : result
  } else if (subFilter === 'more') {
    result = result.slice(limit)
    if (result.length === 0) result = products // wrap if category is small
  } else if (subFilter === 'sort-price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  }

  return result.slice(0, limit)
}

export function ProductPreviewList({ categorySlug, subFilter, limit = 3 }: ProductPreviewListProps) {
  const cached = productCache.get(categorySlug)

  const [allProducts, setAllProducts] = useState<Product[]>(cached ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current || productCache.has(categorySlug)) return
    fetchedRef.current = true

    getProductsByCategory(categorySlug)
      .then((data) => {
        productCache.set(categorySlug, data)
        setAllProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [categorySlug])

  // Update allProducts if cache was populated by another instance
  useEffect(() => {
    if (loading && productCache.has(categorySlug)) {
      const cached = productCache.get(categorySlug)!
      setAllProducts(cached)
      setLoading(false)
    }
  })

  const products = applyFilter(allProducts, subFilter, limit)

  if (loading) {
    return (
      <div className="space-y-2 mt-2">
        {Array.from({ length: limit }).map((_, i) => (
          <ChatProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="mt-2 text-xs text-zinc-500 bg-zinc-900/60 rounded-xl px-3 py-2.5 border border-zinc-800/40">
        Não consegui carregar os produtos agora. Veja o catálogo completo! 🛒
      </p>
    )
  }

  if (products.length === 0) {
    return (
      <p className="mt-2 text-xs text-zinc-500 bg-zinc-900/60 rounded-xl px-3 py-2.5 border border-zinc-800/40">
        Essa categoria está sendo abastecida — em breve terá produtos aqui! ✨
      </p>
    )
  }

  return (
    <div className="space-y-2 mt-2">
      {products.map((product, i) => (
        <ProductPreviewCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}
