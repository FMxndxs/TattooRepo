import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho',
  description: 'Revise seus produtos selecionados e finalize seu pedido via WhatsApp.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
