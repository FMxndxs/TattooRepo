'use client'

/**
 * Root error.tsx — captura erros não tratados em toda a rota raiz.
 * Deve ser 'use client' (obrigatório pelo Next.js para Error Boundaries).
 */

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log no console para depuração (sem expor ao usuário)
    console.error('[RootError]', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-14 h-14 bg-red-950/60 border border-red-700/40 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-2">Algo deu errado</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Ocorreu um erro inesperado. Tente novamente ou volte ao catálogo.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-500 text-white font-semibold text-sm rounded-full transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/catalog"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm rounded-full transition-colors"
          >
            Ver catálogo
          </a>
        </div>
      </div>
    </div>
  )
}
