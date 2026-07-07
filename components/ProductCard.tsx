'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PRODUCT_FRONT, type Colorway } from '@/lib/i18n';
import { track } from '@/lib/analytics';

interface ProductCardProps {
  name: string;
  meta: string;
  serial: string;
  back: Record<Colorway, string>;
  buttonText: string;
  colorLabels: Record<Colorway, string>;
  viewLabels: { back: string; front: string };
  index: number;
}

const COLORWAYS: Colorway[] = ['black', 'white'];

export default function ProductCard({
  name,
  meta,
  serial,
  back,
  buttonText,
  colorLabels,
  viewLabels,
  index,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false); // toque (mobile) alterna vista
  const [color, setColor] = useState<Colorway>('black');

  const showFront = hover || flipped;
  const backSrc = back[color];
  const frontSrc = PRODUCT_FRONT[color];

  // Drop em pré-save: em vez de checkout, leva ao formulário da Lista VIP.
  const handlePreSave = () => {
    track('select_item', {
      item_name: name,
      item_id: serial,
      item_category: 'Drop 01',
      item_variant: color,
      source: 'product_card',
    });
    document.getElementById('lista-vip')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col gap-3.5 group"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${name} — ${showFront ? viewLabels.front : viewLabels.back}`}
        className="relative aspect-square bg-[var(--ovr-bg-soft)] overflow-hidden cursor-pointer block w-full"
      >
        {/* Costas (padrão) */}
        <Image
          src={backSrc}
          alt={`${name} — ${viewLabels.back} (${colorLabels[color]})`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700"
          style={{
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        {/* Frente (hover / toque) — crossfade por cima */}
        <Image
          src={frontSrc}
          alt={`${name} — ${viewLabels.front} (${colorLabels[color]})`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500"
          style={{
            opacity: showFront ? 1 : 0,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        <span
          className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-[0.22em] uppercase text-white bg-[var(--ovr-purple-500)] px-2 py-[3px]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          DROP #001
        </span>

        <span
          className="absolute top-3 right-3 z-10 text-[10px] font-bold tracking-[0.15em] text-white px-1.5 py-[3px] backdrop-blur-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            border: '1px solid rgba(255,255,255,0.45)',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          {serial}
        </span>

        {/* Indicador de vista (Costas / Frente) */}
        <span
          className="absolute bottom-3 left-3 z-10 text-[9px] font-bold tracking-[0.24em] uppercase text-white/90 px-2 py-[3px] backdrop-blur-sm transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-mono)',
            background: showFront
              ? 'rgba(153,0,255,0.55)'
              : 'rgba(0,0,0,0.45)',
          }}
        >
          {showFront ? viewLabels.front : viewLabels.back}
        </span>

        <div
          aria-hidden="true"
          className="absolute inset-2 border-2 border-white pointer-events-none transition-opacity duration-200 z-10"
          style={{ opacity: hover ? 0.25 : 0 }}
        />
      </button>

      <div className="flex flex-col gap-2.5">
        <span
          className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {meta}
        </span>
        <h3
          className="text-xl font-semibold uppercase text-white m-0"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {name}
        </h3>

        <div className="flex items-center justify-between">
          {/* Swatches de cor */}
          <div className="flex items-center gap-2" role="radiogroup" aria-label={name}>
            {COLORWAYS.map((c) => {
              const selected = color === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={colorLabels[c]}
                  title={colorLabels[c]}
                  onClick={() => setColor(c)}
                  className={`h-5 w-5 rounded-full cursor-pointer transition-transform duration-200 ${
                    selected ? 'scale-110' : 'hover:scale-105'
                  }`}
                  style={{
                    background: c === 'black' ? '#0a0a0a' : '#f5f5f5',
                    border: selected
                      ? '2px solid var(--ovr-purple-500)'
                      : '1px solid var(--ovr-line-strong)',
                    boxShadow: selected ? 'var(--glow-purple-sm)' : 'none',
                  }}
                />
              );
            })}
          </div>

          <span
            className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[var(--ovr-purple-300)] ovr-glow-purple"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            EM BREVE
          </span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handlePreSave}
        whileTap={{ scale: 0.97 }}
        className="w-full cursor-pointer py-3.5 text-[12px] font-bold tracking-[0.28em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          fontFamily: 'var(--font-body)',
          background: hover ? 'var(--ovr-purple-500)' : '#fff',
          color: hover ? '#fff' : '#000',
          boxShadow: hover ? '0 0 20px rgba(153,0,255,0.5)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {buttonText}
        <span
          className="inline-block transition-transform"
          style={{
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
            transitionDuration: '220ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          →
        </span>
      </motion.button>
    </motion.div>
  );
}
