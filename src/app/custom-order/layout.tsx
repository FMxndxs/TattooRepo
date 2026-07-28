import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/seo/schema'

export const metadata: Metadata = {
  title: 'Projeto Personalizado',
  description:
    'Traga sua ideia e a imprimimos para você. Envie referências e receba um orçamento via WhatsApp em minutos.',
  alternates: { canonical: `${getSiteUrl()}/custom-order` },
  openGraph: { type: 'website' },
}

export default function CustomOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
