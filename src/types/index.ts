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
  makerworld_url: string | null
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
  email?: string
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

// ─── Auth & Profile ─────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  phone: string
  neighborhood: string | null
  city: string | null
  created_at: string
  updated_at: string
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  neighborhood: string
  city: string
  notes: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  color_id: string | null
  size_id: string | null
  quantity: number
  unit_price: number
  product?: Product
  color?: Color | null
  size?: ProductSize | null
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

export type ChatNodeType =
  | 'greeting'
  | 'menu'
  | 'info'
  | 'action'
  | 'product-list'
  | 'whatsapp-redirect'

export interface ChatOption {
  label: string
  nextNodeId: string
  icon?: string
}

export interface ChatNode {
  id: string
  type: ChatNodeType
  message: string
  options?: ChatOption[]
  action?: {
    type: 'navigate' | 'open-url' | 'open-whatsapp'
    payload?: string
  }
}

export interface ChatMessage {
  id: string
  from: 'nozzle' | 'user'
  text: string
  timestamp: number
  options?: ChatOption[]
}
