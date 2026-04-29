import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Weight } from 'lucide-react'
import { getProductBySlug } from '@/lib/supabase/queries'
import { formatBRL } from '@/lib/utils/formatters'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produto não encontrado' }
  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagem */}
        <div className="aspect-square relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

          {product.description && (
            <p className="text-zinc-400 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Specs */}
          <div className="flex gap-4 mb-6">
            {product.print_time_minutes && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-zinc-300 text-sm">{Math.round(product.print_time_minutes / 60)}h de impressão</span>
              </div>
            )}
            {product.filament_grams && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                <Weight className="w-4 h-4 text-orange-400" />
                <span className="text-zinc-300 text-sm">{product.filament_grams}g de filamento</span>
              </div>
            )}
          </div>

          {/* Cores */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-white font-semibold text-sm mb-3">Cores disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color.id} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex_code }} />
                    <span className="text-zinc-300 text-xs">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preco e CTA */}
          <div className="mt-auto">
            <div className="text-3xl font-black text-orange-400 mb-6">{formatBRL(product.price)}</div>
            <a
              href={`https://wa.me/5511989525014?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (${formatBRL(product.price)})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-full transition-colors text-lg"
            >
              Pedir via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
