'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { useAuth } from '@/lib/context/AuthContext'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: ForgotPasswordFormData) {
    await resetPassword(data.email)
    // Always show success — never reveal if email exists
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center py-4 space-y-3">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
        <p className="text-foreground font-semibold">Link enviado!</p>
        <p className="text-foreground-muted text-sm">
          Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-brand-300 hover:text-brand-200 text-sm transition-colors flex items-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <p className="text-foreground-muted text-sm mb-4">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
        <label htmlFor="forgot-email" className="block text-foreground text-sm font-medium mb-1.5">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
          <input
            id="forgot-email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register('email')}
            className="w-full bg-surface-elevated border border-border-strong text-foreground placeholder:text-foreground-subtle rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Enviando...' : 'Enviar link'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground text-xs transition-colors flex items-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para login
        </button>
      </div>
    </form>
  )
}
