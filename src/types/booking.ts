// Domínio de agendamento (tatuagem). Fonte da verdade: banco; GCal é espelho.

export type BookingStatus =
  | 'pending_payment' // criado, aguardando sinal
  | 'confirmed'       // sinal pago
  | 'cancelled'
  | 'no_show'
  | 'done'

export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  duration_min: number
  deposit_amount: number
  price_from: number | null
  is_active: boolean
  sort_order: number
}

export interface AvailabilityRule {
  id: string
  weekday: number // 0=domingo ... 6=sábado
  start_time: string // 'HH:MM'
  end_time: string
  is_active: boolean
}

export interface TimeOff {
  id: string
  starts_at: string
  ends_at: string
  reason: string | null
}

export interface Booking {
  id: string
  service_id: string
  starts_at: string
  ends_at: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  notes: string | null
  status: BookingStatus
  deposit_amount: number
  hold_expires_at: string | null
  mp_payment_id: string | null
  gcal_event_id: string | null
  manage_token: string
  created_at: string
  updated_at: string
  service?: Service
}

export interface Slot {
  slot_start: string
  slot_end: string
}

export interface Promotion {
  id: string
  title: string
  description: string | null
  image_url: string | null
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  sort_order: number
}

export interface PortfolioItem {
  id: string
  title: string | null
  image_url: string
  style: string | null
  body_placement: string | null
  sort_order: number
}

export interface CancellationPolicy {
  refundable_hours_before: number
  reschedule_hours_before: number
  max_reschedules: number
}
