import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OVRDRV — SEM LIMITE | Streetwear Automotivo',
  description:
    'Streetwear de luxo inspirado na cultura automotiva real. DROP 01 — Illegal Racing Club. Edição numerada, peças limitadas.',
  keywords: [
    'streetwear',
    'automotivo',
    'ovrdrv',
    'overdrive wear',
    'drop 01',
    'illegal racing club',
    'tuning',
    'carspotting',
  ],
  authors: [{ name: 'OVRDRV' }],
  icons: {
    icon: [
      { url: '/logo/favicon-white.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/logo/favicon-black.ico', media: '(prefers-color-scheme: light)' },
    ],
  },
  openGraph: {
    title: 'OVRDRV — SEM LIMITE',
    description: 'Luxury streetwear inspired by Brazilian street-car culture.',
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    siteName: 'OVRDRV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVRDRV — SEM LIMITE',
    description: 'Luxury streetwear inspired by Brazilian street-car culture.',
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
        <link
          rel="preload"
          as="video"
          href="/videos/hero-garage.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/Oxanium-VariableFont_wght.ttf"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
