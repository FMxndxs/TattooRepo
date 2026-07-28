import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, localBusinessSchema, getSiteUrl } from '@/lib/seo/schema'

export const metadata: Metadata = {
  title: {
    absolute: 'Kadu Freitas Tattoo — Estúdio de tatuagem em São Paulo',
  },
  description:
    'Tatuagens customizadas com estilo único. Conheça nosso portfólio, agende sua sessão online e transforme suas ideias em arte permanente.',
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
      <JsonLd data={localBusinessSchema()} />
      <HomeClient />
    </>
  )
}
