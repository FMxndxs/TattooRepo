import type { DeliveryQuote } from '@/types'

interface Coords {
  lat: number
  lng: number
}

// Centro histórico de Santana de Parnaíba — Largo da Matriz / Igreja Matriz de Sant'Ana
export const HQ_COORDS: Coords = { lat: -23.4442, lng: -46.9178 }
export const DELIVERY_RADIUS_KM = 8
export const FREIGHT_PER_KM = 2.5

/** Distância em km entre dois pontos geográficos (linha reta). */
export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(x))
}

/**
 * Calcula a cotação de frete com base na distância da sede.
 * - ≤ 8 km → entrega própria a R$ 2,50/km
 * - > 8 km → retirada na sede ou Uber Flash/99 (a combinar)
 * - sem coords → frete a combinar
 */
export function quoteFreight(
  clientCoords: Coords | null,
  address?: DeliveryQuote['address'],
): DeliveryQuote {
  if (!clientCoords) {
    return { distanceKm: null, withinRadius: false, freight: null, mode: 'unknown', address }
  }

  const distanceKm = haversineKm(HQ_COORDS, clientCoords)
  const withinRadius = distanceKm <= DELIVERY_RADIUS_KM

  if (withinRadius) {
    // Arredonda para 2 casas decimais
    const freight = Math.round(distanceKm * FREIGHT_PER_KM * 100) / 100
    return { distanceKm, withinRadius: true, freight, mode: 'delivery', address }
  }

  return { distanceKm, withinRadius: false, freight: null, mode: 'pickup_or_courier', address }
}
