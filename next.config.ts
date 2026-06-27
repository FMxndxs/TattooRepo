import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Security headers ────────────────────────────────────────────────────────
  // Aplicados em todas as rotas. CSP detalhado fica pendente para a fase de deploy
  // (requer nonces para Next.js inline scripts).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Impede que o browser "adivinhe" o MIME type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Proíbe a página de ser embebida em iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Controla o Referer em requisições cross-origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Desativa APIs sensíveis que o app não usa
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Habilita prefetch de DNS para performance
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },

  // ─── Images ──────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'makerworld.bblmw.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
