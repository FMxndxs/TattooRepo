import Link from 'next/link'
import { ShoppingCart, Sparkles, Package } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-400 transition-colors">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Imagination <span className="text-orange-500">3D</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/catalog"
              aria-label="catálogo"
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/custom-order"
              aria-label="pedido personalizado"
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Personalizado
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              aria-label="carrinho"
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link
              href="/custom-order"
              className="hidden md:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Pedir agora
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
