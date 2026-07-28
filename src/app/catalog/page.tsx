import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/supabase/queries'
import { getSiteUrl } from '@/lib/seo/schema'
import { CatalogClient } from './CatalogClient'

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { categoria } = await searchParams
  const siteUrl = getSiteUrl()

  if (categoria) {
    const categories = await getCategories()
    const cat = categories.find((c) => c.slug === categoria)
    if (cat) {
      return {
        title: cat.name,
        description:
          cat.description ??
          `Produtos de ${cat.name} impressos em 3D com Bambu Lab. Alta qualidade, cores variadas.`,
        alternates: { canonical: `${siteUrl}/catalog?categoria=${categoria}` },
        openGraph: { type: 'website' },
      }
    }
  }

  return {
    title: 'Catálogo',
    description:
      'Explore todos os nossos produtos impressos em 3D. Decoração, utilitários, games, bonecos e muito mais.',
    alternates: { canonical: `${siteUrl}/catalog` },
    openGraph: { type: 'website' },
  }
}

export default async function CatalogPage({ searchParams }: Props) {
  const { categoria } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(categoria ?? null),
    getCategories(),
  ])

  return (
    <CatalogClient
      products={products}
      categories={categories}
      selected={categoria ?? null}
    />
  )
}
