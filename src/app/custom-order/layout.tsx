import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projeto Personalizado',
  description:
    'Traga sua ideia e a imprimimos para você. Envie referências e receba um orçamento via WhatsApp em minutos.',
}

export default function CustomOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
