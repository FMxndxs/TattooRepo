import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, getSiteUrl } from '@/lib/seo/schema'

export const metadata: Metadata = {
  title: {
    absolute: 'Imagination 3D — Impressão 3D de alta qualidade',
  },
  description:
    'Produtos únicos impressos com filamento de alta qualidade usando Bambu Lab. Decoração, utilitários, games, bonecos e projetos personalizados via WhatsApp.',
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <HomeClient />
    </>
  )
}
