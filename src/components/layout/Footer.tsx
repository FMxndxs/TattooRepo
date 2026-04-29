import Link from 'next/link'
import { Package, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Imagination <span className="text-orange-500">3D</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Impressão 3D de alta qualidade com Bambu Lab A1. Produtos únicos, cores variadas e projetos personalizados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { href: '/catalog', label: 'Catálogo' },
                { href: '/custom-order', label: 'Pedido Personalizado' },
                { href: '/cart', label: 'Carrinho' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contato</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5511989525014"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-green-400 text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-pink-400 text-sm transition-colors"
              >
                <span className="w-4 h-4 text-center text-xs">📷</span>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Imagination 3D. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
