'use client'

import { createClient } from './browser'
import type { CartItem } from '@/types'

export interface CreateOrderParams {
  userId: string
  items: CartItem[]
  total: number
  neighborhood: string
  city: string
  notes?: string
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
