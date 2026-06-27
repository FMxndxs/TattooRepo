import { ImageResponse } from 'next/og'

export const alt = 'Imagination 3D — Impressão 3D de alta qualidade'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #431370 0%, #1a0a2e 60%, #09090b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '20px',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: 80,
            height: 4,
            background: 'linear-gradient(90deg, #6a2ba8, #b683ff)',
            borderRadius: 2,
            marginBottom: 4,
          }}
        />

        {/* Brand label */}
        <div
          style={{
            fontSize: 22,
            color: '#b683ff',
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Imagination 3D
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <span>Impressão 3D que</span>
          <span style={{ color: '#b683ff' }}>transforma ideias</span>
          <span>em realidade</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#a1a1aa',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Bambu Lab · Alta qualidade · Personalizado para você
        </div>
      </div>
    ),
    { ...size },
  )
}
