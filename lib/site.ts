/**
 * URL canônica do site — usada em metadata (OG/Twitter), robots e sitemap.
 * Configurável por env pra bater com o domínio real em produção/preview.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ovrdrv.com'
).replace(/\/$/, '');
