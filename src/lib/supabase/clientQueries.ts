'use client'

import { createClient } from './browser'
import type { CartItem, Order, Product } from '@/types'

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createClient()

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle()

  if (!cat) return []

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      colors:product_colors(color:colors(*))
    `)
    .eq('is_available', true)
    .eq('category_id', cat.id)
    .order('is_featured', { ascending: false })
    .order('price', { ascending: true })

  if (error) return []

  return (data ?? []).map((p) => ({
    ...p,
    colors: p.colors?.map((pc: { color: unknown }) => pc.color) ?? [],
  })) as Product[]
}

export interface CreateOrderParams {
  userId: string
  items: CartItem[]
  total: number
  neighborhood: string
  city: string
  notes?: string
  customerName: string
  customerPhone: string
}

export async function createOrder(params: CreateOrderParams): Promise<string | null> {
  const supabase = createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: params.userId,
      total: params.total,
      neighborhood: params.neighborhood,
      city: params.city,
      notes: params.notes ?? null,
      status: 'pending',
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
    })
    .select('id')
    .single()

  if (orderError || !order) return null

  const orderItems = params.items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    color_id: item.selected_color?.id ?? null,
    size_id: item.selected_size?.id ?? null,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return null

  return order.id
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(id, name, slug),
        color:colors(id, name, hex_code),
        size:product_sizes(id, label)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as Order[]
}
