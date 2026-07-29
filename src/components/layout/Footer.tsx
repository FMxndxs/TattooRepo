import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo-kadu.png"
                alt="Kadu Freitas Tattoo"
                width={28}
                height={28}
              />
              <span className="font-bold text-white">
                Kadu Freitas <span className="text-brand-300">Tattoo</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Tatuagens customizadas e flashes exclusivas em São Paulo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { href: '/portfolio', label: 'Portfólio' },
                { href: '/cuidados', label: 'Cuidados' },
                { href: '/custom-order', label: 'Personalizado' },
                { href: '/agendar', label: 'Agendar' },
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.123 1.522 5.858L.057 23.943l6.204-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.884 9.884 0 01-5.031-1.378l-.361-.214-3.732.897.933-3.618-.235-.374A9.862 9.862 0 012.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://instagram.com/kadufreitastattoo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-pink-400 text-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Kadu Freitas Tattoo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
