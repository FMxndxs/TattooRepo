export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface Color {
  id: string
  name: string
  hex_code: string
  is_available: boolean
}

export interface ProductSize {
  id: string
  label: string
  price_modifier: number
  is_available: boolean
}

export interface ProductImage {
  id: string
  url: string
  alt: string | null
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  print_time_minutes: number | null
  filament_grams: number | null
  price: number
  is_available: boolean
  is_featured: boolean
  allows_custom_size: boolean
  allows_custom_color: boolean
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
  colors?: Color[]
  sizes?: ProductSize[]
}

export interface CartItem {
  product: Product
  quantity: number
  selected_color: Color | null
  selected_size: ProductSize | null
  unit_price: number
}

export interface CustomerInfo {
  name: string
  phone: string
  neighborhood: string
  city: string
}

export interface CustomOrder {
  id?: string
  customer_name: string
  customer_phone: string
  description: string
  reference_url: string | null
  reference_image_url: string | null
  status?: 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'
  created_at?: string
}

export interface WhatsAppOrderPayload {
  customer: CustomerInfo
  items: CartItem[]
  total: number
}
