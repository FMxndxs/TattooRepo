import { createClient } from './server'
import type { Product, Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getProducts(categorySlug?: string | null): Promise<Product[]> {
  const supabase = await createClient()

  let categoryId: string | undefined
  if (categorySlug) {
    const { data: row, error } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()
    if (error) throw error
    if (!row) return []
    categoryId = row.id
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      colors:product_colors(color:colors(*))
    `)
    .eq('is_available', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((p) => ({
    ...p,
    colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
  })) as Product[]
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      colors:product_colors(color:colors(*))
    `)
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) throw error

  return (data ?? []).map((p) => ({
    ...p,
    colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
  })) as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      colors:product_colors(color:colors(*)),
      sizes:product_sizes(*)
    `)
    .eq('slug', slug)
    .single()

  if (error) return null

  return {
    ...data,
    colors: data.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
  } as Product
}
