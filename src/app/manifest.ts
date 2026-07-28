import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kadu Freitas Tattoo',
    short_name: 'Kadu Freitas',
    description:
      'Estúdio de tatuagem em São Paulo. Portfólio exclusivo, agendamento online e tatuagens customizadas com estilo único.',
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
