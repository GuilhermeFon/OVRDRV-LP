'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollVideo } from '@/hooks/useScrollVideo';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';
import HeroFallback from './HeroFallback';

interface HeroProps {
  t: Translations;
}

const POSTER = '/images/hero-poster.jpg';
const VIDEO_MP4 = '/videos/hero-garage.mp4';
const VIDEO_WEBM = '/videos/hero-garage.webm';

// Network Information API é experimental — só Chromium expõe.
// Em outros browsers, ignoramos a checagem (sem regressão de UX).
function detectSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
}

// useSyncExternalStore com subscribe no-op é o padrão canônico em React 19
// para hydration check: snapshot retorna `false` no servidor e `true` depois
// que o componente monta no cliente. Substitui o antigo `useState(false)` +
// `useEffect(() => setMounted(true), [])`, que viola a regra
// react-hooks/set-state-in-effect.
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribeNoop, () => true, () => false);

/**
 * Wrapper que decide o modo de renderização. NÃO chama useScroll aqui —
 * se chamarmos, o ref que ele recebe ficaria pendurado em uma <section>
 * que ainda não foi renderizada (porque retornamos HeroFallback antes),
 * e o framer-motion lança "Target ref is defined but not hydrated".
 *
 * A solução é montar HeroParallax como componente próprio, garantindo que
 * useScroll só roda quando a <section> com o ref existe no DOM.
 */
export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const reducedMotion = useReducedMotion();
  // detectSlowConnection toca em `navigator` — só chamar depois da hidratação.
  const slowConnection = isClient && detectSlowConnection();

  if (!isClient || reducedMotion || slowConnection) {
    return <HeroFallback t={t} />;
  }

  return <HeroParallax t={t} />;
}

/**
 * Hero "completa" com vídeo. Quando este componente renderiza, a <section>
 * com `wrapperRef` é parte do JSX retornado, então o ref já está anexado
 * antes do useEffect interno do framer-motion rodar.
 */
function HeroParallax({ t }: HeroProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const isMobile = useIsMobile();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useScroll com offset ['start start', 'end start'] devolve scrollYProgress
  // 0→1 conforme o topo do wrapper passa pelo topo da viewport até o fim
  // do wrapper alcançar o topo. Como o wrapper tem 250vh de altura, isso
  // dá 150vh "de margem" extra para mover a playhead.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  // Parallax leve para o modo mobile (vídeo em loop): pequeno deslocamento Y.
  const mobileVideoY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // Em mobile, scroll-controlled performa mal (seeks constantes em codecs
  // de delivery). Usamos loop autoplay; o hook respeita `enabled=false`.
  const useScrollControl = !isMobile;
  useScrollVideo(videoRef, scrollYProgress, useScrollControl);

  return (
    <section
      ref={wrapperRef}
      aria-label="OVRDRV — SEM LIMITE, garagem industrial revelando carro tunado"
      // 250vh dá ~150vh de "espaço de scroll" extra (além do 100vh sticky)
      // para o useScroll mover scrollYProgress de 0 a 1.
      className="relative h-[250vh]"
    >
      {/*
        sticky + h-screen: prende o conteúdo do vídeo enquanto o usuário
        rola pelos 250vh do wrapper externo. Quando o wrapper sai do
        viewport (em 100% do progress), o sticky se solta naturalmente.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {useScrollControl ? (
          // ATENÇÃO: NÃO usar `autoPlay` — `currentTime` é manipulado
          // manualmente pelo useScrollVideo (proporcional ao scroll).
          (<video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={POSTER}
            aria-hidden="true"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setIsVideoReady(true)}
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>)
        ) : (
          <motion.video
            ref={videoRef}
            style={{ y: mobileVideoY }}
            className="absolute inset-0 w-full h-[115%] object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={POSTER}
            aria-hidden="true"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setIsVideoReady(true)}
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </motion.video>
        )}

        {/* Loading state: o poster cobre a área até o vídeo bufferizar
            (evita flash preto enquanto o MP4 baixa). */}
        {!isVideoReady && (
          <div className="absolute inset-0 z-20 bg-black">
            <Image
              src={POSTER}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Overlay para garantir contraste do texto sobre o vídeo (WCAG AA). */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        <HeroContent t={t} scrollYProgress={scrollYProgress} />
        <ScrollIndicator scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
