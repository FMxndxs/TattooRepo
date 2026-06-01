import type { Product } from '@/types'

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function organizationSchema() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Imagination 3D',
    url,
    logo: `${url}/logo.png`,
    description:
      'Impressão 3D de alta qualidade com Bambu Lab A1. Produtos únicos, cores variadas e projetos personalizados.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+55-11-98952-5014',
      availableLanguage: 'Portuguese',
    },
  }
}

export function productSchema(product: Product) {
  const url = getSiteUrl()
  const primaryImage =
    product.images?.find((i) => i.is_primary) ??
    product.images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: primaryImage?.url ?? undefined,
    url: `${url}/product/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BRL',
      availability: product.is_available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${url}/product/${product.slug}`,
    },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
