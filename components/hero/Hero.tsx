'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroContent from './HeroContent';
import HeroLoader from './HeroLoader';

interface HeroProps {
  t: Translations;
}

const VIDEO_MP4 = '/videos/hero-garage.mp4';
const HERO_POSTER = '/videos/hero-poster.jpg';
// Densidade de scroll do scrubbing (px de rolagem por segundo de vídeo).
const SCRUB_PX_PER_SECOND = 600;
const FALLBACK_DURATION = 12;
const SEEK_EPSILON = 1 / 30;
// Rede travou? Não prende o usuário além disso, mesmo sem buffer completo.
const LOAD_SAFETY_TIMEOUT = 20000;

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

type VideoWithRVFC = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

interface HeroVideoProps extends HeroProps {
  onProgress: (pct: number) => void;
  onReady: () => void;
}

/**
 * MOBILE — vídeo em loop de fundo e scroll normal. Não usa scrubbing porque
 * navegadores mobile não repintam a frame ao setar currentTime num vídeo
 * pausado (fica preto). Libera o loader assim que o vídeo pode tocar.
 */
function HeroLoop({ t, onProgress, onReady }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      onProgress(100);
      onReady();
    };
    const update = () => {
      const { duration, buffered } = video;
      if (duration && !Number.isNaN(duration) && buffered.length) {
        onProgress(
          Math.min(100, (buffered.end(buffered.length - 1) / duration) * 100),
        );
      }
    };

    if (video.readyState >= 3) {
      markReady();
      return;
    }

    video.addEventListener('progress', update);
    video.addEventListener('canplay', markReady);
    video.addEventListener('playing', markReady);
    const timeout = window.setTimeout(markReady, LOAD_SAFETY_TIMEOUT);

    return () => {
      video.removeEventListener('progress', update);
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('playing', markReady);
      window.clearTimeout(timeout);
    };
  }, [onProgress, onReady]);

  return (
    <section
      aria-label="OVRDRV — SEM LIMITE"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={VIDEO_MP4}
        poster={HERO_POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        disableRemotePlayback
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: HERO_GRADIENT }}
      />
      <HeroContent t={t} />
    </section>
  );
}

/**
 * DESKTOP — scroll scrubbing: o scroll controla o tempo do vídeo. Espera o
 * vídeo carregar por inteiro antes de liberar o scroll (via Hero), pra o
 * scrubbing nunca engasgar.
 */
function HeroScrub({ t, onProgress, onReady }: HeroVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isFullyBuffered = () => {
      const { duration, buffered } = video;
      if (!duration || Number.isNaN(duration) || !buffered.length) return false;
      return buffered.end(buffered.length - 1) >= duration - 0.25;
    };
    const markReady = () => {
      onProgress(100);
      onReady();
    };
    const update = () => {
      const { duration, buffered } = video;
      if (duration && !Number.isNaN(duration) && buffered.length) {
        onProgress(
          Math.min(100, (buffered.end(buffered.length - 1) / duration) * 100),
        );
      }
      if (isFullyBuffered()) markReady();
    };

    if (isFullyBuffered() || video.readyState >= 4) {
      markReady();
      return;
    }

    video.addEventListener('progress', update);
    video.addEventListener('loadeddata', update);
    // canplaythrough: navegador garante reprodução até o fim sem travar.
    video.addEventListener('canplaythrough', markReady);
    const timeout = window.setTimeout(markReady, LOAD_SAFETY_TIMEOUT);

    return () => {
      video.removeEventListener('progress', update);
      video.removeEventListener('loadeddata', update);
      video.removeEventListener('canplaythrough', markReady);
      window.clearTimeout(timeout);
    };
  }, [onProgress, onReady]);

  // Altura do wrapper = duração do vídeo × densidade de pixels + 1 viewport.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const updateHeight = () => {
      const viewport = window.innerHeight || 0;
      const duration =
        video.duration && !Number.isNaN(video.duration)
          ? video.duration
          : FALLBACK_DURATION;
      wrapper.style.height = `${duration * SCRUB_PX_PER_SECOND + viewport}px`;
    };

    updateHeight();
    if (video.readyState < 1) {
      video.addEventListener('loadedmetadata', updateHeight, { once: true });
    }
    window.addEventListener('resize', updateHeight);
    return () => {
      video.removeEventListener('loadedmetadata', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Pipeline de seek: cada mudança de scroll dispara `seek`.
  useEffect(() => {
    const video = videoRef.current as VideoWithRVFC | null;
    if (!video) return;

    let pending = false;
    let queued = false;
    let cancelled = false;
    let rvfcHandle: number | null = null;
    const supportsRVFC = typeof video.requestVideoFrameCallback === 'function';

    const seek = () => {
      if (cancelled) return;
      if (pending) {
        queued = true;
        return;
      }
      const { duration } = video;
      if (!duration || Number.isNaN(duration)) return;
      const target = duration * Math.min(1, Math.max(0, scrollYProgress.get()));
      if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return;

      pending = true;
      video.currentTime = target;

      const onDone = () => {
        pending = false;
        rvfcHandle = null;
        if (cancelled) return;
        if (queued) {
          queued = false;
          seek();
        }
      };

      if (supportsRVFC && video.requestVideoFrameCallback) {
        rvfcHandle = video.requestVideoFrameCallback(onDone);
      } else {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          onDone();
        };
        video.addEventListener('seeked', onSeeked);
      }
    };

    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, { once: true });

    const unsubscribe = scrollYProgress.on('change', seek);

    return () => {
      cancelled = true;
      unsubscribe();
      video.removeEventListener('loadedmetadata', seek);
      if (rvfcHandle != null && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(rvfcHandle);
      }
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={wrapperRef}
      aria-label="OVRDRV — SEM LIMITE, garagem industrial revelando carro tunado"
      className="relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={VIDEO_MP4}
          poster={HERO_POSTER}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          disableRemotePlayback
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: HERO_GRADIENT }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
          style={{
            opacity: 0.08,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
          }}
        />

        <HeroContent t={t} />
      </div>
    </section>
  );
}

export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
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
  // touchmove / teclas de rolagem. Vale desde o primeiro paint (fica no topo
  // do Hero, antes do vídeo montar).
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
            backgroundImage: `url('${staticMode ? '/images/products/banner-1.png' : HERO_POSTER}')`,
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
  } else if (isMobile) {
    hero = <HeroLoop t={t} onProgress={setProgress} onReady={handleReady} />;
  } else {
    hero = <HeroScrub t={t} onProgress={setProgress} onReady={handleReady} />;
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
