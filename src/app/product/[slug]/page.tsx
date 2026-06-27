import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/supabase/queries'
import { ProductDetail } from './ProductDetail'
import { JsonLd } from '@/components/seo/JsonLd'
import { productSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo/schema'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produto não encontrado' }

  const siteUrl = getSiteUrl()
  const primaryImage =
    product.images?.find((i) => i.is_primary) ??
    product.images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0]

  return {
    title: product.name,
    description: product.description ?? `${product.name} — impressão 3D de alta qualidade com Bambu Lab.`,
    alternates: {
      canonical: `${siteUrl}/product/${slug}`,
    },
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.description ?? undefined,
      images: primaryImage
        ? [{ url: primaryImage.url, alt: primaryImage.alt ?? product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description ?? undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const siteUrl = getSiteUrl()

  const breadcrumbItems = [
    { name: 'Início', url: siteUrl },
    { name: 'Catálogo', url: `${siteUrl}/catalog` },
    ...(product.category
      ? [{ name: product.category.name, url: `${siteUrl}/catalog?categoria=${product.category.slug}` }]
      : []),
    { name: product.name, url: `${siteUrl}/product/${slug}` },
  ]

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <ProductDetail product={product} />
    </>
  )
}
