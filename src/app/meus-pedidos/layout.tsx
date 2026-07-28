import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus Pedidos',
  description: 'Acompanhe o histórico e status dos seus pedidos na Imagination 3D.',
  robots: { index: false, follow: false },
}

export default function MeusPedidosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
