export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function organizationSchema() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kadu Freitas Tattoo',
    url,
    logo: `${url}/logo.png`,
    description:
      'Estúdio de tatuagem em São Paulo. Tatuagens customizadas, flashes exclusivas e orçamento personalizado.',
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
    name: 'Kadu Freitas Tattoo',
    url,
    logo: `${url}/logo.png`,
    image: `${url}/logo.png`,
    description:
      'Estúdio de tatuagem em São Paulo. Sessões agendadas online com sinal via Pix, portfólio de trabalhos e orçamento personalizado.',
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

export interface FAQItem {
  question: string
  answer: string
}

export function faqPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
