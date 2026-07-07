/**
 * Camada fina de analytics sobre o GA4 (gtag).
 * `track()` é seguro no server (no-op) e quando o GA não está configurado,
 * então pode ser chamado de qualquer lugar sem guardas.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: EventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}
