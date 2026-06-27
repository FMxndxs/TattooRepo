import type { DeliveryQuote } from '@/types'

interface Coords {
  lat: number
  lng: number
}

// Centro histórico de Santana de Parnaíba — Largo da Matriz / Igreja Matriz de Sant'Ana
export const HQ_COORDS: Coords = { lat: -23.4442, lng: -46.9178 }
export const DELIVERY_RADIUS_KM = 8
export const FREIGHT_PER_KM = 2.5

export interface FreightConfig {
  hqCoords: Coords
  perKm: number
  radiusKm: number
}

export const DEFAULT_FREIGHT_CONFIG: FreightConfig = {
  hqCoords: HQ_COORDS,
  perKm: FREIGHT_PER_KM,
  radiusKm: DELIVERY_RADIUS_KM,
}

/** Distância em km entre dois pontos geográficos (linha reta). */
export function haversineKm(a: Coords, b: Coords): number {
  if (!isFinite(a.lat) || !isFinite(a.lng) || !isFinite(b.lat) || !isFinite(b.lng)) {
    throw new Error('haversineKm: coordenadas inválidas (NaN ou Infinity)')
  }
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
 * - ≤ radiusKm → entrega própria a perKm R$/km
 * - > radiusKm → retirada na sede ou Uber Flash/99 (a combinar)
 * - sem coords → frete a combinar
 *
 * O terceiro argumento `config` é opcional — omiti-lo usa DEFAULT_FREIGHT_CONFIG,
 * mantendo retrocompatibilidade com chamadas existentes e testes.
 */
export function quoteFreight(
  clientCoords: Coords | null,
  address?: DeliveryQuote['address'],
  config: FreightConfig = DEFAULT_FREIGHT_CONFIG,
): DeliveryQuote {
  const { hqCoords, perKm, radiusKm } = config

  if (!clientCoords || !isFinite(clientCoords.lat) || !isFinite(clientCoords.lng)) {
    return { distanceKm: null, withinRadius: false, freight: null, mode: 'unknown', perKm, radiusKm, address }
  }

  const distanceKm = haversineKm(hqCoords, clientCoords)
  const withinRadius = distanceKm <= radiusKm

  if (withinRadius) {
    // Arredonda para 2 casas decimais
    const freight = Math.round(distanceKm * perKm * 100) / 100
    return { distanceKm, withinRadius: true, freight, mode: 'delivery', perKm, radiusKm, address }
  }

  return { distanceKm, withinRadius: false, freight: null, mode: 'pickup_or_courier', perKm, radiusKm, address }
}
