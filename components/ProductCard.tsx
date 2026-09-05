'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PRODUCT_FRONT, type Colorway } from '@/lib/i18n';
import { useCanHover } from '@/hooks/useCanHover';
import { track } from '@/lib/analytics';

interface ProductCardProps {
  name: string;
  meta: string;
  back: Record<Colorway, string>;
  buttonText: string;
  colorLabels: Record<Colorway, string>;
  viewLabels: { back: string; front: string };
  index: number;
}

const COLORWAYS: Colorway[] = ['black', 'white'];
const SWIPE_THRESHOLD = 40;

export default function ProductCard({
  name,
  meta,
  back,
  buttonText,
  colorLabels,
  viewLabels,
  index,
}: ProductCardProps) {
  const canHover = useCanHover();
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [color, setColor] = useState<Colorway>('black');

  // Em touch o hover é emulado e trava; lá a vista é 100% controlada por toque.
  const showFront = canHover ? hover || flipped : flipped;
  const backSrc = back[color];
  const frontSrc = PRODUCT_FRONT[color];

  // Swipe horizontal alterna a vista no mobile. O clique é suprimido quando o
  // gesto virou swipe, senão o toque contaria duas vezes.
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    swiped.current = true;
    setFlipped(dx < 0);
  };

  const handleViewToggle = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setFlipped((f) => !f);
  };

  // Drop em pré-save: em vez de checkout, leva ao formulário da Lista VIP.
  const handlePreSave = () => {
    track('select_item', {
      item_name: name,
      item_id: name,
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
      onMouseEnter={() => canHover && setHover(true)}
      onMouseLeave={() => canHover && setHover(false)}
      className="flex flex-col gap-3.5 group"
    >
      <button
        type="button"
        onClick={handleViewToggle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`${name} — ${showFront ? viewLabels.front : viewLabels.back}`}
        className="relative aspect-square bg-[var(--ovr-bg-soft)] overflow-hidden cursor-pointer block w-full touch-pan-y select-none"
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
        {/* Frente (hover no desktop / toque no mobile) — crossfade por cima */}
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

        {/* Indicador de vista — no touch quem mostra o estado é o seletor */}
        {canHover && (
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
        )}

        <div
          aria-hidden="true"
          className="absolute inset-2 border-2 border-white pointer-events-none transition-opacity duration-200 z-10"
          style={{ opacity: hover ? 0.25 : 0 }}
        />
      </button>

      {/* Seletor de vista — só em touch, onde hover não existe */}
      {!canHover && (
        <div
          className="grid grid-cols-2 border border-[var(--ovr-line)]"
          role="tablist"
          aria-label={name}
        >
          {([false, true] as const).map((front) => {
            const selected = showFront === front;
            const label = front ? viewLabels.front : viewLabels.back;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFlipped(front)}
                className="py-2.5 text-[10px] font-bold tracking-[0.24em] uppercase transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: selected ? 'var(--ovr-purple-500)' : 'transparent',
                  color: selected ? '#fff' : 'var(--ovr-fg-dim)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

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
