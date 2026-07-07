'use client';

import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';

/**
 * Google Analytics 4 — carrega o gtag só quando NEXT_PUBLIC_GA_ID está
 * definido. Sem ID (ex: dev/local sem config), não injeta nada.
 */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
