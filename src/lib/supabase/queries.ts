import { createClient } from './server'
import type { Product, Category } from '@/types'
import type { FreightConfig } from '@/lib/utils/freight'
import { DEFAULT_FREIGHT_CONFIG } from '@/lib/utils/freight'

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


type ClickRow = { product_id: string; click_count: number }

export async function getMostClickedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()

  const { data: clicks, error: clicksError } = await supabase
    .rpc('get_most_clicked_products', { p_limit: limit })

  if (clicksError) throw clicksError

  const productIds = (clicks as ClickRow[] ?? []).map((r) => r.product_id)
  let products: Product[] = []

  if (productIds.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        colors:product_colors(color:colors(*))
      `)
      .eq('is_available', true)
      .in('id', productIds)

    if (error) throw error

    const countMap = new Map((clicks as ClickRow[]).map((r) => [r.product_id, r.click_count]))
    products = (data ?? [])
      .map((p) => ({ ...p, colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [] }) as Product)
      .sort((a, b) => ((countMap.get(b.id) as number) ?? 0) - ((countMap.get(a.id) as number) ?? 0))
  }

  if (products.length < limit) {
    const featured = await getFeaturedProducts()
    const existingIds = new Set(products.map((p) => p.id))
    const extras = featured.filter((p) => !existingIds.has(p.id)).slice(0, limit - products.length)
    products = [...products, ...extras]
  }

  return products
}

/**
 * Lê os parâmetros de frete da tabela `settings` (linha única).
 * Retorna DEFAULT_FREIGHT_CONFIG como fallback seguro — o checkout não quebra
 * se a migration 023 ainda não foi executada no Supabase.
 */
export async function getFreightConfig(): Promise<FreightConfig & { hq_cep?: string | null; hq_label?: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('hq_lat, hq_lng, hq_cep, hq_label, freight_per_km, delivery_radius_km')
      .eq('id', 1)
      .maybeSingle()

    if (error || !data) return DEFAULT_FREIGHT_CONFIG

    return {
      hqCoords: { lat: Number(data.hq_lat), lng: Number(data.hq_lng) },
      perKm: Number(data.freight_per_km),
      radiusKm: Number(data.delivery_radius_km),
      hq_cep: data.hq_cep ?? null,
      hq_label: data.hq_label ?? null,
    }
  } catch {
    return DEFAULT_FREIGHT_CONFIG
  }
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
