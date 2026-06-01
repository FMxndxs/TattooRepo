import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #431370 0%, #6a2ba8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
            }}
          >
            I
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#b683ff',
              letterSpacing: 1,
              lineHeight: 1,
              marginTop: -4,
            }}
          >
            3D
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
