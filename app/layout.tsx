import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OVRDRV - SEM LIMITE | Luxury Automotive Streetwear',
  description: 'Streetwear de luxo inspirado na cultura automotiva de alta performance. Coleção exclusiva Drop 01.',
  keywords: ['streetwear', 'luxury', 'automotive', 'fashion', 'performance', 'exclusive'],
  authors: [{ name: 'OVRDRV' }],
  openGraph: {
    title: 'OVRDRV - SEM LIMITE',
    description: 'Luxury streetwear inspired by high-performance automotive culture',
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    siteName: 'OVRDRV',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        width: 1200,
        height: 630,
        alt: 'OVRDRV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVRDRV - SEM LIMITE',
    description: 'Luxury streetwear inspired by high-performance automotive culture',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
