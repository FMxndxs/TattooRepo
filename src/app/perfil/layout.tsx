import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meu Perfil',
  description: 'Gerencie seus dados e preferências de conta.',
  robots: { index: false, follow: false },
}

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
