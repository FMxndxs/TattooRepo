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
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
}

// ─── Freight / Delivery ──────────────────────────────────────────────────────

export type DeliveryMode = 'delivery' | 'pickup_or_courier' | 'unknown'

export interface DeliveryQuote {
  distanceKm: number | null
  withinRadius: boolean
  freight: number | null
  mode: DeliveryMode
  /** R$ por km aplicado nesta cotação */
  perKm: number
  /** Raio máximo de entrega (km) aplicado nesta cotação */
  radiusKm: number
  address?: {
    cep: string
    street: string
    neighborhood: string
    city: string
    state: string
  }
}

export interface CustomOrder {
  id?: string
  customer_name: string
  customer_phone: string
  description: string
  reference_url: string | null
  reference_image_url: string | null
  status?:
    | 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected'
    | 'in_production' | 'finishing' | 'ready'
    | 'out_for_delivery' | 'shipped' | 'delivered'
    | 'completed' | 'cancelled'
  /** Código amigável gerado pelo banco (ex. A4F9). null em registros antigos pré-mig026. */
  order_code?: string | null
  created_at?: string
}

export interface WhatsAppOrderPayload {
  customer: CustomerInfo
  items: CartItem[]
  total: number
  deliveryQuote?: DeliveryQuote | null
}

// ─── Auth & Profile ─────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  phone: string
  is_admin: boolean
  neighborhood: string | null
  city: string | null
  created_at: string
  updated_at: string
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'finishing'         // impressão concluída, em acabamento/pós-processamento
  | 'ready'             // pronto para entrega/envio/retirada
  | 'out_for_delivery'  // saiu para entrega local (raio 8km)
  | 'shipped'           // enviado pelos correios/transportadora
  | 'delivered'
  | 'cancelled'
  | 'completed'         // legado — mapeado para delivered na exibição

/** Modalidade de atendimento do pedido */
export type FulfillmentType = 'delivery' | 'shipping' | 'pickup'

export interface Order {
  id: string
  user_id: string
  customer_name: string
  customer_phone: string
  status: OrderStatus
  total: number
  freight: number | null
  cep: string | null
  street: string | null
  street_number: string | null
  neighborhood: string
  city: string
  notes: string | null
  created_at: string
  /** Código amigável gerado no banco (ex. #A4F9). null em registros antigos pré-mig026. */
  order_code: string | null
  /** Modalidade de atendimento. null em registros antigos pré-mig025. */
  fulfillment_type: FulfillmentType | null
  /** Nome do entregador local (preenchido no despacho). */
  courier_name: string | null
  /** Código de rastreamento dos correios (preenchido no envio). */
  tracking_code: string | null
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
  /** Snapshot do nome do produto no momento da compra (pré-mig028 pode ser null). */
  product_name: string | null
  /** Snapshot do nome da cor selecionada. */
  color_name: string | null
  /** Snapshot do label do tamanho selecionado. */
  size_label: string | null
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
