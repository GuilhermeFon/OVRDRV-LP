'use client';

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroContent from './HeroContent';
import HeroLoader from './HeroLoader';
import HeroVideo from './HeroVideo';

interface HeroProps {
  t: Translations;
}

const HERO_POSTER = '/videos/hero-poster.jpg';

const HERO_GRADIENT =
  'linear-gradient(to top, #000 0%, rgba(0,0,0,0.4) 50%, transparent 100%), radial-gradient(circle at 50% 80%, rgba(153,0,255,0.18), transparent 60%)';

const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribeNoop, () => true, () => false);

function detectSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
}

export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const reducedMotion = useReducedMotion();

  const [videoReady, setVideoReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modo estático (sem vídeo): movimento reduzido ou conexão lenta.
  const staticMode = isClient && (reducedMotion || detectSlowConnection());

  const handleReady = useCallback(() => setVideoReady(true), []);

  // Pronto = vídeo carregado OU modo estático (nada pra esperar).
  const ready = videoReady || staticMode;

  // Trava o scroll de verdade enquanto o loader está na tela. overflow:hidden
  // sozinho não segura o touch no mobile, então também cancelamos wheel /
  // touchmove / teclas de rolagem. Vale desde o primeiro paint.
  useEffect(() => {
    if (ready) return;
    window.scrollTo(0, 0);

    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const prevent = (e: Event) => e.preventDefault();
    const scrollKeys = new Set([
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' ',
      'Spacebar',
    ]);
    const preventKeys = (e: KeyboardEvent) => {
      if (scrollKeys.has(e.key)) e.preventDefault();
    };

    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    window.addEventListener('keydown', preventKeys, { passive: false });

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
      window.removeEventListener('keydown', preventKeys);
    };
  }, [ready]);

  let hero: ReactNode;
  if (!isClient || staticMode) {
    // Poster (pré-hidratação) e modo estático compartilham o mesmo visual.
    hero = (
      <section
        aria-label="OVRDRV — SEM LIMITE"
        className="relative h-screen min-h-[560px] w-full overflow-hidden bg-black"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${HERO_POSTER}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...(staticMode
              ? { opacity: 0.55, filter: 'saturate(1.05) contrast(1.1)' }
              : null),
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: HERO_GRADIENT }}
        />
        <HeroContent t={t} />
      </section>
    );
  } else {
    hero = <HeroVideo t={t} onReady={handleReady} onProgress={setProgress} />;
  }

  return (
    <>
      {hero}
      <AnimatePresence>
        {!ready && <HeroLoader key="hero-loader" progress={progress} />}
      </AnimatePresence>
    </>
  );
}
