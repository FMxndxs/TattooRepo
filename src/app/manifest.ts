import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Imagination 3D',
    short_name: 'Imagination 3D',
    description:
      'Impressão 3D de alta qualidade com Bambu Lab. Produtos únicos, cores variadas e projetos personalizados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#431370',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
