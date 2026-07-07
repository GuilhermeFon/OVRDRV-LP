'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useScroll } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';

interface HeroProps {
  t: Translations;
}

const VIDEO_MP4 = '/videos/hero-garage.mp4';
const HERO_POSTER = '/videos/hero-poster.jpg';
// Densidade de scroll do scrubbing (px de rolagem por segundo de vídeo).
// Menor no mobile pra a seção não ficar "presa" por telas demais.
const SCRUB_PX_PER_SECOND_DESKTOP = 600;
const SCRUB_PX_PER_SECOND_MOBILE = 300;
const FALLBACK_DURATION = 12;
const SEEK_EPSILON = 1 / 30;

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

/**
 * DESKTOP — scroll scrubbing: o scroll controla o tempo do vídeo.
 * Isolado em componente próprio para o `useScroll` só existir quando o
 * `wrapperRef` está de fato montado (evita "target ref not hydrated").
 */
function HeroScrub({
  t,
  pxPerSecond,
}: HeroProps & { pxPerSecond: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Altura do wrapper = duração do vídeo × densidade de pixels + 1 viewport.
  // O filho `sticky top-0 h-screen` fica pinado por todo o intervalo, então
  // scrollYProgress 0→1 mapeia exatamente o tempo do vídeo.
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
      wrapper.style.height = `${duration * pxPerSecond + viewport}px`;
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
  }, [pxPerSecond]);

  // Pipeline de seek: cada mudança de scroll dispara `seek`. Se um seek
  // anterior ainda não pintou, enfileira no máximo um follow-up.
  // requestVideoFrameCallback encadeia o próximo só depois da frame anterior
  // ser apresentada — evita seeks cancelados sob scroll rápido.
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
        <ScrollIndicator scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}

export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  // Antes da hidratação (SSR/first paint) mostramos só o poster — assim o
  // celular nunca começa a baixar o vídeo desktop de 32MB. O vídeo certo
  // (mobile leve ou scrub desktop) só monta depois que sabemos o dispositivo.
  if (!isClient) {
    return (
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
  }

  // Movimento reduzido ou conexão lenta → hero estático (sem vídeo).
  if (reducedMotion || detectSlowConnection()) {
    return (
      <section
        aria-label="OVRDRV — SEM LIMITE"
        className="relative min-h-screen w-full overflow-hidden bg-black"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/products/banner-1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.55,
            filter: 'saturate(1.05) contrast(1.1)',
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
  }

  // Scrubbing no mobile e no desktop — no mobile com densidade menor pra a
  // seção pinada não se estender por telas demais.
  return (
    <HeroScrub
      t={t}
      pxPerSecond={
        isMobile ? SCRUB_PX_PER_SECOND_MOBILE : SCRUB_PX_PER_SECOND_DESKTOP
      }
    />
  );
}
