'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Loader2, CheckCircle, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'

const inputClass =
  'w-full bg-surface-elevated border border-border-strong text-foreground placeholder:text-foreground-subtle rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-brand-500 transition-colors'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) {
      setServerError('Não foi possível redefinir a senha. O link pode ter expirado.')
      return
    }
    setDone(true)
    setTimeout(() => router.push('/'), 2500)
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-sm">
          <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
          <h1 className="text-foreground font-bold text-xl">Senha redefinida!</h1>
          <p className="text-foreground-muted text-sm">
            Sua senha foi atualizada com sucesso. Redirecionando...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {/* Top scan line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 mb-3">
                <Layers className="w-5 h-5 text-brand-300" />
              </div>
              <h1 className="text-foreground font-bold text-xl">Nova senha</h1>
              <p className="text-foreground-muted text-sm mt-1">Defina sua nova senha de acesso</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Nova senha */}
              <div>
                <label htmlFor="new-password" className="block text-foreground text-sm font-medium mb-1.5">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    {...register('password')}
                    className={inputClass}
                  />
                </div>
                {errors.password && (
                  <p role="alert" className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar senha */}
              <div>
                <label htmlFor="confirm-password" className="block text-foreground text-sm font-medium mb-1.5">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register('password_confirm')}
                    className={inputClass}
                  />
                </div>
                {errors.password_confirm && (
                  <p role="alert" className="text-red-400 text-xs mt-1">{errors.password_confirm.message}</p>
                )}
              </div>

              {serverError && (
                <p role="alert" className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 px-3">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full overflow-hidden flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors text-sm cta-sheen mt-2"
              >
                <span className="cta-sheen-fill opacity-75" aria-hidden />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
