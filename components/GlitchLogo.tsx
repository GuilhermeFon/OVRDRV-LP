'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const SRC = '/logo/ovrdrv-glitch.png';

// Tamanho nativo do PNG. O palco é desenhado nessas medidas e escalado por CSS,
// o que mantém a proporção dos deslocamentos do glitch igual à animação original.
const BOX_W = 672;
const BOX_H = 371;

const STRIP = 4;
const NSTRIPS = Math.ceil(BOX_H / STRIP);

// Defaults autorais (TWEAK_DEFAULTS da composição original).
const INTENSITY = 1.25;
const SLICE_COUNT = 32;
const FRINGE: [string, string] = ['#ff0033', '#00e5ff'];

// A amplitude decai até virar só o micro-pulso residual; depois disso não vale
// mais gastar rAF, então congelamos o último frame.
const SETTLE_AT = 2;

function hash(a: number, b: number) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const easeOutQuart = (t: number) => 1 - (t - 1) ** 4;

const MOTION = {
  ramp: (T: number, t0: number, t1: number) =>
    easeOutQuart(clamp((T - t0) / (t1 - t0), 0, 1)),
  burst: (T: number, at: number, w: number) =>
    Math.max(0, 1 - Math.abs(T - at) / w),
  breathe: (T: number, hz: number) => 0.5 + 0.5 * Math.sin(T * hz),
};

// Curva autoral: impacto → rajadas de datamosh → assentamento → respiro.
function amplitude(T: number) {
  const open = clamp(T / 0.06, 0, 1);
  const decay = 1 - MOTION.ramp(T, 0.06, 1.4);
  const hits = Math.max(
    MOTION.burst(T, 0.02, 0.1),
    MOTION.burst(T, 0.3, 0.09),
    MOTION.burst(T, 0.62, 0.08),
    MOTION.burst(T, 0.95, 0.07),
  );
  const residual = T > 1.25 ? 0.05 * MOTION.breathe(T, 34) : 0;
  return clamp(
    (open * decay * 0.65 + hits * decay * 0.9 + residual) * INTENSITY,
    0,
    1.4,
  );
}

interface GlitchLogoProps {
  /** Largura CSS do logo. O palco nativo (672px) é escalado até ela. */
  className?: string;
  /** Segundos de espera antes de disparar a entrada. */
  delay?: number;
}

/**
 * Logo da OVRDRV com entrada em glitch: separação RGB, fatias horizontais que
 * escorregam (datamosh) e uma banda de ruído VHS. Porte do componente autoral
 * `glitch-logo.jsx`, com duas diferenças: roda uma vez e assenta (em vez de dar
 * loop infinito) e escala por CSS a partir do tamanho nativo do PNG.
 */
export default function GlitchLogo({ className = '', delay = 0 }: GlitchLogoProps) {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [T, setT] = useState(0);

  // Escala o palco nativo para a largura real que o container recebeu.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const parent = stage.parentElement;
    if (!parent) return;

    const measure = () => setScale(parent.clientWidth / BOX_W);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  // O impacto tem que rodar com os strips já pintados, senão a entrada acontece
  // com o logo invisível.
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    const img = new window.Image();
    img.src = SRC;
    const done = () => {
      if (!cancelled) setLoaded(true);
    };
    if (img.complete) done();
    else {
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !loaded) return;
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000 - delay;
      if (elapsed >= SETTLE_AT) {
        setT(SETTLE_AT);
        return; // assentou: sem mais repaint
      }
      setT(Math.max(0, elapsed));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, loaded, delay]);

  if (reducedMotion) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={SRC}
        alt="OVRDRV · Illegal Racing Club · Sem Limite"
        width={BOX_W}
        height={BOX_H}
        className={`h-auto w-full ${className}`}
      />
    );
  }

  const amp = amplitude(T);
  const g = Math.floor(T * 30);

  const dx = (2 + 16 * amp) * (0.35 + 0.65 * (hash(0, g) * 2 - 1));
  const jx = (hash(1, g) * 2 - 1) * 12 * amp;
  const jy = (hash(2, g) * 2 - 1) * 6 * amp;
  const flicker = 1 - (hash(3, g) > 0.72 ? 0.14 * amp : 0);

  // No máximo uma banda de ruído VHS por frame.
  const tearOn = hash(41, g) < 0.3 * (0.35 + amp);
  const tearTop = Math.floor(hash(42, g) * NSTRIPS);
  const tearLen = 1 + Math.floor(hash(43, g) * 3);

  const strips = [];
  for (let i = 0; i < NSTRIPS; i += 1) {
    const grp = Math.floor((i * SLICE_COUNT) / NSTRIPS);
    const big = hash(grp, g) > 0.58;
    const off = (hash(grp, g + 7) * 2 - 1) * (big ? 190 : 14) * amp;
    const inTear = tearOn && i >= tearTop && i < tearTop + tearLen;
    const bright = inTear ? 2.8 : i % 2 === 1 ? 0.52 : 1;
    strips.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          top: i * STRIP,
          width: '100%',
          height: STRIP + 0.4,
          backgroundImage: `url(${SRC})`,
          backgroundSize: `${BOX_W}px ${BOX_H}px`,
          backgroundPosition: `0px ${-i * STRIP}px`,
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(${
            off + (inTear ? (hash(44, g) * 2 - 1) * 120 * amp : 0)
          }px,0,0)`,
          filter: bright === 1 ? 'none' : `brightness(${bright})`,
          opacity: hash(grp, g + 5) > 0.94 ? 1 - 0.45 * amp : 1,
        }}
      />,
    );
  }

  return (
    <div
      role="img"
      aria-label="OVRDRV · Illegal Racing Club · Sem Limite"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${BOX_W} / ${BOX_H}`,
      }}
    >
      <div
        ref={stageRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BOX_W,
          height: BOX_H,
          transformOrigin: 'top left',
          transform: `scale(${scale}) translate3d(${jx}px, ${jy}px, 0)`,
          opacity: loaded && scale > 0 ? flicker : 0,
          filter: `drop-shadow(${dx}px 0 0 ${FRINGE[0]}) drop-shadow(${-dx}px 0 0 ${FRINGE[1]})`,
        }}
      >
        {strips}
      </div>
    </div>
  );
}
