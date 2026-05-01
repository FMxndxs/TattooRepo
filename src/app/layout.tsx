import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Imagination 3D', template: '%s | Imagination 3D' },
  description: 'Impressão 3D de alta qualidade com Bambu Lab A1. Produtos únicos, cores variadas e projetos personalizados.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    siteName: 'Imagination 3D',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Imagination 3D' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white print-buildplate-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
