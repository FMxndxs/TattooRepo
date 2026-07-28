interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Server Component — injeta dados estruturados JSON-LD no <head> da página.
 * Não usa 'use client' intencionalmente: roda apenas no servidor.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
