'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image src="/logo.png" alt="Imagination 3D" width={40} height={40} />
          <span className="font-bold text-white text-xl">
            Imagination <span className="text-brand-300">3D</span>
          </span>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <h1 className="text-white font-bold text-xl mb-6 text-center">Painel Admin</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-zinc-300 text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@exemplo.com"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-300 text-sm font-medium mb-1.5">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-700 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-3 rounded-full transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
