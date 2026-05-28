'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useAuth } from '@/lib/context/AuthContext'

interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

const inputClass =
  'w-full bg-surface-elevated border border-border-strong text-foreground placeholder:text-foreground-subtle rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-brand-500 transition-colors'

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const { signIn } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const { error } = await signIn(data.email, data.password)
    if (error) {
      setServerError('E-mail ou senha incorretos. Verifique seus dados.')
      return
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* E-mail */}
      <div>
        <label htmlFor="login-email" className="block text-foreground text-sm font-medium mb-1.5">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="login-email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register('email')}
            className={inputClass}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="login-password" className="block text-foreground text-sm font-medium mb-1.5">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            className={inputClass}
          />
        </div>
        {errors.password && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <p role="alert" className="text-red-400 text-xs text-center bg-red-400/10 rounded-lg py-2 px-3">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full overflow-hidden flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors text-sm print-cta-sheen mt-2"
      >
        <span className="print-cta-filament opacity-75" aria-hidden />
        <span className="relative z-10 flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </span>
      </button>

      {/* Forgot password */}
      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-brand-300 hover:text-brand-200 text-xs transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>
    </form>
  )
}
