import type { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/supabase/queries'
import { getSiteUrl } from '@/lib/seo/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/nossa-historia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/custom-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Entradas por categoria (/catalog?categoria=slug)
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategories()
    categoryRoutes = categories.map((cat) => ({
      url: `${siteUrl}/catalog?categoria=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // não bloqueia o sitemap se falhar
  }

  // Entradas por produto (/product/slug)
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts()
    productRoutes = products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // não bloqueia o sitemap se falhar
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
