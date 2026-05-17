'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';

interface HeroProps {
  t: Translations;
}

const VIDEO_MP4 = '/videos/hero-garage.mp4';
const SCROLL_PX_PER_SECOND = 600;
const FALLBACK_DURATION = 12;
const SEEK_EPSILON = 1 / 30;

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

export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const slowConnection = isClient && detectSlowConnection();

  const isStatic = isClient && (reducedMotion || slowConnection);
  const isLoop = isClient && isMobile && !reducedMotion && !slowConnection;
  const isScrub = isClient && !isStatic && !isLoop;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const mobileVideoY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // Wrapper height = duração do vídeo × densidade de pixels + 1 viewport.
  // O filho `sticky top-0 h-screen` permanece pinado por todo esse intervalo,
  // então scrollYProgress 0→1 mapeia exatamente o tempo do vídeo.
  useEffect(() => {
    if (!isScrub) return;
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const updateHeight = () => {
      const viewport = window.innerHeight || 0;
      const duration =
        video.duration && !Number.isNaN(video.duration)
          ? video.duration
          : FALLBACK_DURATION;
      wrapper.style.height = `${duration * SCROLL_PX_PER_SECOND + viewport}px`;
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
  }, [isScrub]);

  // Pipeline de seek: cada mudança de scroll dispara `seek`. Se um seek
  // anterior ainda não pintou, enfileira no máximo um follow-up.
  // requestVideoFrameCallback encadeia o próximo só depois da frame anterior
  // ser apresentada — evita seeks cancelados sob scroll rápido.
  useEffect(() => {
    if (!isScrub) return;
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
  }, [isScrub, scrollYProgress]);

  if (isStatic) {
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
          style={{
            background:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.4) 50%, transparent 100%), radial-gradient(circle at 50% 80%, rgba(153,0,255,0.18), transparent 60%)',
          }}
        />
        <HeroContent t={t} />
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      aria-label="OVRDRV — SEM LIMITE, garagem industrial revelando carro tunado"
      className="relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {isLoop ? (
          <motion.div
            style={{ y: mobileVideoY }}
            className="absolute inset-0 w-full h-[115%]"
          >
            <video
              ref={videoRef}
              src={VIDEO_MP4}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              disablePictureInPicture
              disableRemotePlayback
            />
          </motion.div>
        ) : (
          <video
            ref={videoRef}
            src={VIDEO_MP4}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            disablePictureInPicture
            disableRemotePlayback
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.4) 50%, transparent 100%), radial-gradient(circle at 50% 80%, rgba(153,0,255,0.18), transparent 60%)',
          }}
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
