import {
  haversineKm,
  quoteFreight,
  HQ_COORDS,
  DELIVERY_RADIUS_KM,
  FREIGHT_PER_KM,
} from '@/lib/utils/freight'

describe('haversineKm', () => {
  it('retorna 0 para o mesmo ponto', () => {
    expect(haversineKm(HQ_COORDS, HQ_COORDS)).toBeCloseTo(0, 5)
  })

  it('calcula distância conhecida corretamente (~4 km)', () => {
    // 0.036° de latitude ≈ 4 km
    const nearby = { lat: HQ_COORDS.lat - 0.036, lng: HQ_COORDS.lng }
    expect(haversineKm(HQ_COORDS, nearby)).toBeCloseTo(4, 0)
  })

  it('é simétrico (a→b == b→a)', () => {
    const other = { lat: -23.55, lng: -46.63 }
    expect(haversineKm(HQ_COORDS, other)).toBeCloseTo(haversineKm(other, HQ_COORDS), 5)
  })
})

describe('quoteFreight', () => {
  it('retorna modo "unknown" quando coords são null', () => {
    const q = quoteFreight(null)
    expect(q.mode).toBe('unknown')
    expect(q.freight).toBeNull()
    expect(q.distanceKm).toBeNull()
    expect(q.withinRadius).toBe(false)
  })

  it('retorna modo "delivery" e frete correto dentro do raio (3 km)', () => {
    // ponto ~3 km ao sul da sede
    const nearby = { lat: HQ_COORDS.lat - 0.027, lng: HQ_COORDS.lng }
    const dist = haversineKm(HQ_COORDS, nearby)
    const q = quoteFreight(nearby)

    expect(q.mode).toBe('delivery')
    expect(q.withinRadius).toBe(true)
    expect(q.distanceKm).toBeCloseTo(dist, 3)
    // frete = dist × R$ 2,50, arredondado
    expect(q.freight).toBeCloseTo(Math.round(dist * FREIGHT_PER_KM * 100) / 100, 2)
  })

  it('retorna modo "delivery" exatamente no limite do raio (8 km)', () => {
    // 1° de latitude ≈ 111,32 km → 8 km ≈ 0,0719°
    const boundary = { lat: HQ_COORDS.lat + DELIVERY_RADIUS_KM / 111.32, lng: HQ_COORDS.lng }
    const dist = haversineKm(HQ_COORDS, boundary)
    // A distância calculada deve estar dentro de 1 km do limite
    expect(dist).toBeCloseTo(DELIVERY_RADIUS_KM, 0)

    const q = quoteFreight(boundary)
    expect(q.withinRadius).toBe(true)
    expect(q.mode).toBe('delivery')
    expect(q.freight).not.toBeNull()
  })

  it('retorna modo "pickup_or_courier" além do raio (30 km)', () => {
    const far = { lat: HQ_COORDS.lat - 0.27, lng: HQ_COORDS.lng }
    const q = quoteFreight(far)

    expect(q.mode).toBe('pickup_or_courier')
    expect(q.freight).toBeNull()
    expect(q.withinRadius).toBe(false)
    expect(q.distanceKm).toBeGreaterThan(DELIVERY_RADIUS_KM)
  })

  it('inclui endereço no resultado quando fornecido', () => {
    const addr = {
      cep: '06502000',
      street: 'Rua Teste',
      neighborhood: 'Centro',
      city: 'Santana de Parnaíba',
      state: 'SP',
    }
    const q = quoteFreight(HQ_COORDS, addr)
    expect(q.address).toEqual(addr)
  })

  it('frete nunca é negativo', () => {
    // ponto imediatamente sobre a sede
    const q = quoteFreight({ lat: HQ_COORDS.lat + 0.0001, lng: HQ_COORDS.lng + 0.0001 })
    expect((q.freight ?? 0)).toBeGreaterThanOrEqual(0)
  })
})
