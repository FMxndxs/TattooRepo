'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { ProductTable } from '@/components/admin/ProductTable'
import { ColorManager } from '@/components/admin/ColorManager'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import type { Product, Color, Category } from '@/types'

type Tab = 'products' | 'colors'

export default function AdminProductsPage() {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const supabase = createClient()
    const [{ data: prods }, { data: cols }, { data: cats }] = await Promise.all([
      supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false }),
      supabase
        .from('colors')
        .select('*')
        .order('name', { ascending: true }),
      supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true }),
    ])
    setProducts((prods ?? []) as Product[])
    setColors((cols ?? []) as Color[])
    setCategories((cats ?? []) as Category[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const TABS: { value: Tab; label: string }[] = [
    { value: 'products', label: 'Produtos' },
    { value: 'colors', label: 'Cores globais' },
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Produtos</h1>
        <p className="text-zinc-400 mt-1">Gerencie o catálogo e as cores da loja</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit mb-6">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === value
                ? 'bg-brand-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tab === 'products' ? (
        <>
          <div className="mb-4">
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
          <ProductTable
            products={
              selectedCategory === null
                ? products
                : products.filter((p) => p.category?.slug === selectedCategory)
            }
            onRefresh={fetchAll}
            
          />
        </>
      ) : (
        <ColorManager colors={colors} onRefresh={fetchAll} />
      )}
    </div>
  )
}
