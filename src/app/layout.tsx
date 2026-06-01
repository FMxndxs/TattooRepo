import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/context/AuthContext'
import { AuthModalProvider } from '@/components/auth/AuthModalProvider'
import { NozzleFab } from '@/components/chatbot/NozzleFab'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Imagination 3D', template: '%s | Imagination 3D' },
  description: 'Impressão 3D de alta qualidade com Bambu Lab A1. Produtos únicos, cores variadas e projetos personalizados.',
  icons: {
    icon: '/favicon.ico',
    // apple-icon.tsx é detectado automaticamente pelo Next.js na convenção de arquivo
  },
  openGraph: {
    siteName: 'Imagination 3D',
    locale: 'pt_BR',
    type: 'website',
    // opengraph-image.tsx é detectado automaticamente pelo Next.js
  },
  twitter: {
    card: 'summary_large_image',
    site: '@imagination3d',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white print-buildplate-bg">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModalProvider />
          <NozzleFab />
        </AuthProvider>
      </body>
    </html>
  )
}
