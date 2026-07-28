'use client'

/**
 * admin/(dashboard)/error.tsx — captura erros nas rotas do painel admin.
 */

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div className="flex items-center justify-center h-[60vh] px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-12 h-12 bg-red-950/60 border border-red-700/40 rounded-xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Erro no painel</h2>
          <p className="text-zinc-400 text-sm">Ocorreu um erro inesperado. Tente recarregar.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-brand-700 hover:bg-brand-500 text-white font-semibold text-sm rounded-full transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/admin"
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm rounded-full transition-colors"
          >
            Visão geral
          </Link>
        </div>
      </div>
    </div>
  )
}
