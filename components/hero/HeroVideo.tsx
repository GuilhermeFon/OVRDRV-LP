'use client';

import { useEffect, useRef } from 'react';
import type { Translations } from '@/lib/i18n';
import HeroContent from './HeroContent';

interface HeroVideoProps {
  t: Translations;
  onReady: () => void;
}

// TESTE: vídeo de fundo do hero via embed do YouTube.
// "N O S T A L G I C 90's Drift Edit" — D.M.G Media
// https://www.youtube.com/watch?v=6NImgmZKLfo
const YT_ID = '6NImgmZKLfo';

// loop=1 só funciona junto de playlist=<id> — sem isso o vídeo para no fim.
// mute=1 é obrigatório: browser nenhum deixa autoplay com som.
const YT_PARAMS = new URLSearchParams({
  autoplay: '1',
  mute: '1',
  loop: '1',
  playlist: YT_ID,
  controls: '0',
  disablekb: '1',
  fs: '0',
  iv_load_policy: '3',
  modestbranding: '1',
  playsinline: '1',
  rel: '0',
}).toString();

const HERO_POSTER = '/videos/hero-poster.jpg';

const HERO_GRADIENT =
  'linear-gradient(to top, #000 0%, rgba(0,0,0,0.4) 50%, transparent 100%), radial-gradient(circle at 50% 80%, rgba(153,0,255,0.18), transparent 60%)';

// Rede travou? Não prende o usuário no loader além disso.
const READY_SAFETY_TIMEOUT = 3000;

export default function HeroVideo({ t, onReady }: HeroVideoProps) {
  const readyRef = useRef(false);

  const markReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReady();
  };

  useEffect(() => {
    const timeout = window.setTimeout(markReady, READY_SAFETY_TIMEOUT);
    return () => window.clearTimeout(timeout);
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
      {/* Cover num iframe 16:9: super-dimensiona pro maior lado e centraliza,
          o overflow:hidden do pai recorta o excedente. */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${YT_ID}?${YT_PARAMS}`}
        title="OVRDRV — hero"
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={markReady}
        className="absolute left-1/2 top-1/2 border-0 pointer-events-none"
        style={{
          width: 'max(100vw, 177.78vh)',
          height: 'max(100vh, 56.25vw)',
          transform: 'translate(-50%, -50%)',
        }}
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
    </section>
  );
}
