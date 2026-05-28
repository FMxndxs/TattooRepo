'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, MapPin, Building, Layers, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { useAuth } from '@/lib/context/AuthContext'
import { profileEditSchema, type ProfileEditFormData } from '@/lib/validations/profile'
import { formatPhoneBR } from '@/lib/utils/phoneMask'
import { LayerReveal } from '@/components/ui/MotionPrimitives'

export default function ProfilePage() {
  const { user, profile, loading, isAuthenticated, refreshProfile, resetPassword } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [phoneValue, setPhoneValue] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormData>({ resolver: zodResolver(profileEditSchema) })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, router])

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      const phone = profile.phone ?? ''
      const formatted = formatPhoneBR(phone)
      setPhoneValue(formatted)
      reset({
        phone: formatted,
        neighborhood: profile.neighborhood ?? '',
        city: profile.city ?? '',
      })
    }
  }, [profile, reset])

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneBR(e.target.value)
    setPhoneValue(formatted)
    setValue('phone', formatted, { shouldValidate: true })
  }

  async function onSubmit(data: ProfileEditFormData) {
    setSaveError(null)
    setSaved(false)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user!.id,
        phone: data.phone,
        neighborhood: data.neighborhood,
        city: data.city,
      })

    if (error) {
      setSaveError('Não foi possível salvar. Tente novamente.')
      return
    }

    await refreshProfile()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleResetPassword() {
    if (!user?.email) return
    await resetPassword(user.email)
    setResetSent(true)
    setTimeout(() => setResetSent(false), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-300 animate-spin" />
      </div>
    )
  }

  const inputClass =
    'w-full bg-surface-elevated border border-border-strong text-foreground placeholder:text-foreground-subtle rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-brand-500 transition-colors'
  const readonlyClass =
    'w-full bg-surface-elevated/50 border border-border text-foreground-muted rounded-xl px-4 py-3 pl-11 text-sm cursor-not-allowed'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <LayerReveal>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-700/20 ring-1 ring-brand-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
              <p className="text-foreground-muted text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Card de dados */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
            <div className="p-6">
              <h2 className="text-foreground font-semibold text-base mb-5">Informações pessoais</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Nome (readonly) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-foreground-muted text-sm font-medium mb-1.5">Nome</label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                      <input
                        readOnly
                        value={profile?.first_name ?? ''}
                        className={readonlyClass}
                        aria-label="Nome (não editável)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-foreground-muted text-sm font-medium mb-1.5">Sobrenome</label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                      <input
                        readOnly
                        value={profile?.last_name ?? ''}
                        className={readonlyClass}
                        aria-label="Sobrenome (não editável)"
                      />
                    </div>
                  </div>
                </div>

                {/* E-mail (readonly) */}
                <div>
                  <label className="block text-foreground-muted text-sm font-medium mb-1.5">E-mail</label>
                  <input
                    readOnly
                    value={user?.email ?? ''}
                    className="w-full bg-surface-elevated/50 border border-border text-foreground-muted rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                    aria-label="E-mail (não editável)"
                  />
                </div>

                {/* Telefone (editável) */}
                <div>
                  <label htmlFor="profile-phone" className="block text-white text-sm font-medium mb-1.5">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                    <input
                      id="profile-phone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className={inputClass}
                    />
                    <input type="hidden" {...register('phone')} />
                  </div>
                  {errors.phone && (
                    <p role="alert" className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Bairro (editável) */}
                <div>
                  <label htmlFor="profile-neighborhood" className="block text-white text-sm font-medium mb-1.5">
                    Bairro
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                    <input
                      id="profile-neighborhood"
                      placeholder="Seu bairro"
                      {...register('neighborhood')}
                      className={inputClass}
                    />
                  </div>
                  {errors.neighborhood && (
                    <p role="alert" className="text-red-400 text-xs mt-1">{errors.neighborhood.message}</p>
                  )}
                </div>

                {/* Cidade (editável) */}
                <div>
                  <label htmlFor="profile-city" className="block text-white text-sm font-medium mb-1.5">
                    Cidade
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                    <input
                      id="profile-city"
                      placeholder="Sua cidade"
                      {...register('city')}
                      className={inputClass}
                    />
                  </div>
                  {errors.city && (
                    <p role="alert" className="text-red-400 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                {saveError && (
                  <p role="alert" className="text-red-400 text-xs bg-red-400/10 rounded-lg py-2 px-3">
                    {saveError}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-brand-700 hover:bg-brand-500 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                  {saved && (
                    <span className="flex items-center gap-1.5 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Salvo!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-foreground font-semibold text-base mb-3">Segurança</h2>
            <p className="text-foreground-muted text-sm mb-4">
              Receba um link no seu e-mail para redefinir a senha.
            </p>
            {resetSent ? (
              <p className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Link enviado para {user?.email}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-brand-300 hover:text-brand-200 text-sm font-medium transition-colors border border-brand-700/40 hover:border-brand-500/60 px-4 py-2 rounded-lg"
              >
                Alterar senha
              </button>
            )}
          </div>
        </div>
      </LayerReveal>
    </div>
  )
}
