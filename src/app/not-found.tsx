import Link from 'next/link'
import { Layers } from 'lucide-react'

/**
 * not-found.tsx — renderizado quando notFound() é chamado ou a rota não existe.
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 bg-brand-700/15 border border-brand-700/30 rounded-2xl flex items-center justify-center mx-auto">
          <Layers className="w-8 h-8 text-brand-300" />
        </div>

        <div>
          <p className="text-brand-300 text-sm font-semibold mb-2 tracking-widest uppercase">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Página não encontrada</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/catalog"
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-500 text-white font-semibold text-sm rounded-full transition-colors shadow-lg shadow-brand-glow"
          >
            Ver catálogo
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm rounded-full transition-colors"
          >
            Início
          </Link>
        </div>
      </div>
    </div>
  )
}
