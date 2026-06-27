import { ImageResponse } from 'next/og'
import { getProductBySlug } from '@/lib/supabase/queries'
import { formatBRL } from '@/lib/utils/formatters'

export const runtime = 'nodejs'
export const alt = 'Produto — Imagination 3D'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)

  const name = product?.name ?? 'Imagination 3D'
  const price = product ? formatBRL(product.price) : null
  const primaryImage =
    product?.images?.find((i) => i.is_primary) ??
    product?.images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0]

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #431370 0%, #1a0a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 70px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: 40,
        }}
      >
        {/* Text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: 18,
              color: '#b683ff',
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Imagination 3D
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: name.length > 30 ? 42 : 52,
              color: 'white',
              fontWeight: 800,
              lineHeight: 1.1,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {name}
          </div>

          {/* Price */}
          {price && (
            <div
              style={{
                fontSize: 38,
                color: '#b683ff',
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {price}
            </div>
          )}

          {/* Subline */}
          <div
            style={{
              fontSize: 18,
              color: '#a1a1aa',
              marginTop: 8,
            }}
          >
            Impressão 3D com Bambu Lab
          </div>
        </div>

        {/* Product photo */}
        {primaryImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.url}
            width={280}
            height={280}
            alt={primaryImage.alt ?? name}
            style={{
              objectFit: 'cover',
              borderRadius: 20,
              flexShrink: 0,
              border: '2px solid rgba(182,131,255,0.3)',
            }}
          />
        )}
      </div>
    ),
    { ...size },
  )
}
