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
      'Impressão 3D de alta qualidade com Bambu Lab. Produtos únicos, cores variadas e projetos personalizados.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+55-11-98952-5014',
      availableLanguage: 'Portuguese',
    },
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function localBusinessSchema() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Imagination 3D',
    url,
    logo: `${url}/logo.png`,
    image: `${url}/logo.png`,
    description:
      'Impressão 3D de alta qualidade com Bambu Lab. Produtos únicos, cores variadas e projetos personalizados entregues em São Paulo.',
    telephone: '+55-11-98952-5014',
    priceRange: 'R$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    areaServed: {
      '@type': 'City',
      name: 'São Paulo',
    },
    sameAs: [
      `https://wa.me/5511989525014`,
    ],
  }
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
