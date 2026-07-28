export interface CustomOrder {
  id?: string
  /** Usuário autenticado que enviou o pedido (null em registros antigos pré-mig032). */
  user_id?: string | null
  customer_name: string
  customer_phone: string
  description: string
  reference_url: string | null
  reference_image_url: string | null
  status?: 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'cancelled'
  /** Código amigável gerado pelo banco (ex. A4F9). null em registros antigos pré-mig026. */
  order_code?: string | null
  created_at?: string
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
