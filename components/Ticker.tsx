'use client';

import { motion } from 'framer-motion';

type Variant = 'invert' | 'dark' | 'purple';

interface TickerProps {
  variant?: Variant;
  speed?: number;
  text?: string;
}

const DEFAULT_TEXT = 'OVRDRV — SEM LIMITE — PERFORMANCE — DROP 01 — ';

const styles: Record<Variant, { container: string; span: string; fontFamily: string }> = {
  invert: {
    container:
      'bg-white text-black border-y border-[var(--ovr-line)] py-[18px]',
    span: 'text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] px-7',
    fontFamily: 'var(--font-display)',
  },
  dark: {
    container:
      'bg-black text-white border-y border-[var(--ovr-line)] py-[14px]',
    span: 'text-[14px] font-bold tracking-[0.3em] uppercase px-7',
    fontFamily: 'var(--font-mono)',
  },
  purple: {
    container: 'bg-[var(--ovr-purple-500)] text-white py-[10px]',
    span: 'text-[13px] font-bold tracking-[0.3em] uppercase px-7',
    fontFamily: 'var(--font-mono)',
  },
};

export default function Ticker({
  variant = 'invert',
  speed = 24,
  text = DEFAULT_TEXT,
}: TickerProps) {
  const s = styles[variant];
  return (
    <div
      className={`${s.container} overflow-hidden whitespace-nowrap`}
      style={
        variant === 'purple'
          ? { boxShadow: '0 0 20px rgba(153,0,255,0.4)' }
          : undefined
      }
    >
      <motion.div
        className="flex"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={s.span}
            style={{ fontFamily: s.fontFamily }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
