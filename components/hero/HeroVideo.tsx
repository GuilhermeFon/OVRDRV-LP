'use client';

import { useEffect, useRef } from 'react';
import type { Translations } from '@/lib/i18n';
import HeroContent from './HeroContent';

interface HeroVideoProps {
  t: Translations;
  onReady: () => void;
  onProgress: (pct: number) => void;
}

const HERO_POSTER = '/videos/hero-poster.jpg';

const HERO_GRADIENT =
  'linear-gradient(to top, #000 0%, rgba(0,0,0,0.4) 50%, transparent 100%), radial-gradient(circle at 50% 80%, rgba(153,0,255,0.18), transparent 60%)';

// Rede travou? Não prende o usuário no loader além disso.
const READY_SAFETY_TIMEOUT = 6000;

export default function HeroVideo({ t, onReady, onProgress }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      video.play().catch(() => {});
      if (readyRef.current) return;
      readyRef.current = true;
      onProgress(100);
      onReady();
    };

    // Progresso de buffer pro loader. Antes do primeiro `progress` não há o que
    // medir, então a barra sobe sozinha até 85%.
    const reportBuffer = () => {
      if (readyRef.current || !video.duration || !video.buffered.length) return;
      onProgress(
        Math.min(
          99,
          (video.buffered.end(video.buffered.length - 1) / video.duration) * 100,
        ),
      );
    };

    // Listeners nativos em vez dos sintéticos do React: eventos de mídia não
    // borbulham e podem já ter passado quando o React anexa os handlers.
    video.addEventListener('canplay', markReady);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('error', markReady);
    video.addEventListener('progress', reportBuffer);

    // Vídeo em cache já passou do `canplay` antes deste efeito rodar.
    if (video.readyState >= 3) markReady();

    // Safari no iOS ignora o atributo autoPlay em alguns casos, mas aceita a
    // chamada imperativa quando o vídeo está mudo.
    video.play().catch(() => {});

    const timeout = window.setTimeout(markReady, READY_SAFETY_TIMEOUT);
    let fake = 0;
    const creep = window.setInterval(() => {
      if (readyRef.current) return;
      fake = Math.min(85, fake + 7);
      onProgress(fake);
    }, 220);

    return () => {
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('error', markReady);
      video.removeEventListener('progress', reportBuffer);
      window.clearTimeout(timeout);
      window.clearInterval(creep);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-label="OVRDRV — SEM LIMITE"
      className="relative h-screen min-h-[560px] w-full overflow-hidden bg-black"
      style={{
        backgroundImage: `url('${HERO_POSTER}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={HERO_POSTER}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

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
    </section>
  );
}
