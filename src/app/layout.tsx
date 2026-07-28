import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/context/AuthContext'
import { AuthModalProvider } from '@/components/auth/AuthModalProvider'
import { ToastProvider } from '@/lib/context/ToastContext'
import { ToastContainer } from '@/components/ui/ToastContainer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Kadu Freitas Tattoo', template: '%s | Kadu Freitas Tattoo' },
  description: 'Estúdio de tatuagem em São Paulo. Flashes exclusivas, design personalizado, higiene garantida. Agende sua tatuagem com Kadu Freitas.',
  icons: {
    icon: '/favicon.ico',
    // apple-icon.tsx é detectado automaticamente pelo Next.js na convenção de arquivo
  },
  openGraph: {
    siteName: 'Kadu Freitas Tattoo',
    locale: 'pt_BR',
    type: 'website',
    // opengraph-image.tsx é detectado automaticamente pelo Next.js
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kadufreitas.tattoo',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <ToastProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModalProvider />
          </AuthProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
