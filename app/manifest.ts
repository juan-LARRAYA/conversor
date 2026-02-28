import { MetadataRoute } from 'next'

type ExtendedManifest = MetadataRoute.Manifest & {
  screenshots?: Array<{
    src: string
    sizes: string
    type: string
    form_factor?: 'narrow' | 'wide'
  }>
  prefer_related_applications?: boolean
  related_applications?: Array<{
    platform: string
    url?: string
    id?: string
  }>
}

export default function manifest(): ExtendedManifest {
  return {
    id: '/binexa-converter-app',
    name: 'Binexa - Conversor de Números',
    short_name: 'Binexa',
    description: 'Conversor rápido y eficiente entre sistemas numéricos: Binario, Decimal y Hexadecimal. Incluye historial, exportación a Excel/CSV y estadísticas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e1e',
    theme_color: '#007acc',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es',
    dir: 'ltr',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['utilities', 'productivity'],
    prefer_related_applications: false,
    screenshots: [
      {
        src: '/screenshots/screenshot-1.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshots/screenshot-2.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide'
      }
    ]
  }
}
