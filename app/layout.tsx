import './globals.css';
import type { Metadata, Viewport } from 'next';
import Analytics from '@/components/Analytics';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'OVRDRV — SEM LIMITE | Streetwear Automotivo',
  description:
    'Streetwear de luxo inspirado na cultura automotiva real. DROP 01 — Illegal Racing Club. Edição numerada, peças limitadas.',
  applicationName: 'OVRDRV',
  keywords: [
    'streetwear',
    'automotivo',
    'ovrdrv',
    'overdrive wear',
    'drop 01',
    'illegal racing club',
    'tuning',
    'carspotting',
    'camiseta oversized',
  ],
  authors: [{ name: 'OVRDRV' }],
  creator: 'OVRDRV',
  publisher: 'OVRDRV',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo/favicon-white.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/logo/favicon-black.ico', media: '(prefers-color-scheme: light)' },
    ],
  },
  openGraph: {
    title: 'OVRDRV — SEM LIMITE',
    description:
      'Streetwear de luxo inspirado na cultura automotiva real. DROP 01 — Illegal Racing Club.',
    url: SITE_URL,
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    siteName: 'OVRDRV',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OVRDRV — SEM LIMITE · DROP 01 · Illegal Racing Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVRDRV — SEM LIMITE',
    description:
      'Streetwear de luxo inspirado na cultura automotiva real. DROP 01 — Illegal Racing Club.',
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OVRDRV',
  url: SITE_URL,
  logo: `${SITE_URL}/logo/ovrdrv-logo-white.png`,
  description:
    'Streetwear de luxo inspirado na cultura automotiva real. Edição numerada, peças limitadas.',
  email: 'contato@ovrdrv.com',
  sameAs: ['https://instagram.com/ovrdrv'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressCountry: 'BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Poster do hero — melhora o LCP (aparece antes do vídeo carregar) */}
        <link rel="preload" as="image" href="/videos/hero-poster.jpg" />
        <link
          rel="preload"
          as="font"
          href="/fonts/Oxanium-VariableFont_wght.ttf"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      {/* suppressHydrationWarning: extensões de navegador (ex: ColorZilla injeta
          cz-shortcut-listen) alteram o <body> antes da hidratação — isso evita
          o falso alerta de mismatch, sem afetar o resto da árvore. */}
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
