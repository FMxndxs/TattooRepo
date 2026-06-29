'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/browser'
import type { UserProfile } from '@/types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (params: SignUpParams) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
}

interface SignUpParams {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as UserProfile)
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) fetchProfile(user.id)
      setLoading(false)
    })

    // Listen for auth changes
    // IMPORTANT: callback must NOT be async and must NOT await any Supabase call.
    // onAuthStateChange holds a Navigator Lock; awaiting supabase.* inside it
    // would request the same lock → deadlock. Kick off fetchProfile with void
    // so it runs outside the lock after the callback returns.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          void fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[Auth] signIn error:', error.message)
      return { error: error.message }
    }
    return { error: null }
  }, [supabase])

  const signUp = useCallback(async ({ email, password, first_name, last_name, phone }: SignUpParams) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // phone included so handle_new_user() trigger can persist it atomically
        data: { first_name, last_name, phone },
      },
    })
    if (error) {
      console.error('[Auth] signUp error:', error.message)
      return { error: error.message }
    }

    // Guard: if email confirmation is required, session will be null.
    // Return a sentinel so the form can show a "check your email" message
    // instead of silently closing.
    if (!data.session) {
      return { error: 'EMAIL_NOT_CONFIRMED' }
    }

    // Defensive update: trigger already set first_name/last_name/phone,
    // but sync again in case of race or future schema changes.
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ phone, first_name, last_name })
        .eq('id', data.user.id)
      if (profileError) {
        console.error('[Auth] profile update error:', profileError.message)
      }
    }

    return { error: null }
  }, [supabase])

  const signOut = useCallback(async () => {
    // scope: 'local' clears the local session immediately without a network
    // round-trip, avoiding UI freezes on slow connections or expired tokens.
    await supabase.auth.signOut({ scope: 'local' })
  }, [supabase])

  const resetPassword = useCallback(async (email: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!profile?.is_admin,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
