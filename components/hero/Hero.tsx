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

const HERO_POSTER = '/videos/hero-poster.jpg';
const FRAME_COUNT = 73;
const framePath = (i: number) =>
  `/hero-frames/frame-${String(i).padStart(3, '0')}.webp`;
// Rede travou? Não prende o usuário além disso, mesmo sem carregar tudo.
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

// Desenha a imagem cobrindo o canvas (object-fit: cover), centralizada.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;
  if (cr > ir) {
    dw = cw;
    dh = cw / ir;
    dx = 0;
    dy = (ch - dh) / 2;
  } else {
    dh = ch;
    dw = ch * ir;
    dx = (cw - dw) / 2;
    dy = 0;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

interface HeroScrubProps extends HeroProps {
  tallClass: string;
  onProgress: (pct: number) => void;
  onReady: () => void;
}

/**
 * Scroll scrubbing via SEQUÊNCIA DE FRAMES num <canvas> — o mesmo método de
 * sites tipo GTA VI / Apple. Funciona igual no mobile e no desktop porque só
 * desenha imagens (não depende do navegador repintar um <video> pausado, que
 * é o que falha e deixa preto no mobile). Espera todos os frames carregarem
 * antes de liberar o scroll (o Hero cuida do loader e da trava).
 */
function HeroScrub({ t, tallClass, onProgress, onReady }: HeroScrubProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const drawRef = useRef<() => void>(() => {});

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // Pré-carrega todos os frames, reportando progresso. Só fica pronto quando
  // tudo carregou (qualquer frame do scroll precisa estar disponível).
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(i);
      const done = () => {
        if (cancelled) return;
        loaded += 1;
        onProgress(Math.min(100, (loaded / FRAME_COUNT) * 100));
        drawRef.current(); // pinta o frame atual conforme os frames chegam
        if (loaded >= FRAME_COUNT) onReady();
      };
      img.onload = done;
      img.onerror = done;
      imgs.push(img);
    }
    imagesRef.current = imgs;

    const timeout = window.setTimeout(onReady, LOAD_SAFETY_TIMEOUT);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      imgs.forEach((im) => {
        im.onload = null;
        im.onerror = null;
      });
    };
  }, [onProgress, onReady]);

  // Canvas: dimensiona pra tela (retina) e desenha o frame do progresso do
  // scroll. rAF coalesce os eventos de scroll pra um draw por frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const imgs = imagesRef.current;
      if (!imgs.length) return;
      const p = Math.min(1, Math.max(0, scrollYProgress.get()));
      const idx = Math.min(imgs.length - 1, Math.round(p * (imgs.length - 1)));
      const img = imgs[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      drawCover(ctx, img, canvas.width, canvas.height);
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      draw();
    };
    resize();

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };
    const unsubscribe = scrollYProgress.on('change', onScroll);
    window.addEventListener('resize', resize);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={wrapperRef}
      aria-label="OVRDRV — SEM LIMITE, garagem industrial revelando carro tunado"
      className={`relative ${tallClass}`}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{
          backgroundImage: `url('${HERO_POSTER}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
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

  // Modo estático (sem scrub): movimento reduzido ou conexão lenta.
  const staticMode = isClient && (reducedMotion || detectSlowConnection());

  const handleReady = useCallback(() => setVideoReady(true), []);

  // Pronto = frames carregados OU modo estático (nada pra esperar).
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
  } else {
    hero = (
      <HeroScrub
        t={t}
        tallClass={isMobile ? 'h-[220vh]' : 'h-[320vh]'}
        onProgress={setProgress}
        onReady={handleReady}
      />
    );
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
