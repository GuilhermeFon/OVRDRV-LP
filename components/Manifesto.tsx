'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Translations } from '@/lib/i18n';

interface ManifestoProps {
  t: Translations;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface MosaicTileProps {
  src: string;
  alt: string;
  className?: string;
  tag?: string;
}

// Tile do mosaico (estilo grid do GTA) — hover com zoom + borda roxa.
function MosaicTile({ src, alt, className = '', tag }: MosaicTileProps) {
  return (
    <div
      className={`group relative overflow-hidden bg-[var(--ovr-bg-soft)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none border border-transparent transition-colors duration-300 group-hover:border-[var(--ovr-purple-500)]"
      />
      {tag && (
        <span
          className="absolute top-2.5 left-2.5 text-[9px] font-bold tracking-[0.22em] uppercase text-white bg-[var(--ovr-purple-500)] px-1.5 py-[3px]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

export default function Manifesto({ t }: ManifestoProps) {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden"
      style={{ background: '#000', padding: 'clamp(72px, 10vw, 120px) 24px' }}
    >
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '-12%',
          top: '20%',
          width: 720,
          height: 720,
          background:
            'radial-gradient(circle, rgba(153,0,255,0.14), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none mix-blend-screen"
        style={{
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto grid gap-10 lg:gap-16 items-center grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Mosaico de imagens conceito (estilo grid do GTA) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid grid-cols-2 grid-rows-4 gap-2 h-[clamp(480px,62vw,640px)] m-0"
        >
          <MosaicTile
            src="/images/grid/model.jpg"
            alt="OVRDRV — Illegal Racing Club · lookbook"
            className="row-span-2"
            tag="IRC"
          />
          <MosaicTile
            src="/images/grid/banner-1.jpg"
            alt="OVRDRV — Drop 01 · Illegal Racing Club"
            tag="DROP 01"
          />
          <MosaicTile
            src="/images/grid/post-2.jpg"
            alt="OVRDRV — conceito de marca"
            tag="OVRDRV"
          />
          <MosaicTile
            src="/images/grid/banner-2.jpg"
            alt="OVRDRV — Best car & wear"
            className="col-span-2"
          />
          <MosaicTile
            src="/images/grid/post-1.jpg"
            alt="OVRDRV — coming soon"
          />
          <MosaicTile
            src="/images/grid/post-3.jpg"
            alt="OVRDRV — conceito de marca"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="ovr-eyebrow text-[12px] tracking-[0.4em] mb-4 text-[var(--ovr-purple-300)] ovr-glow-purple">
            {t.manifesto.eyebrow}
          </p>

          <h2
            id="manifesto-title"
            className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold tracking-[-0.04em] leading-[0.92] uppercase text-white m-0 mb-8 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.manifesto.title}
          </h2>

          <p
            className="text-base md:text-lg text-white/85 leading-[1.55] mb-5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.manifesto.lead}
          </p>
          <p
            className="text-base text-[var(--ovr-fg-mute)] leading-[1.55] mb-10"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.manifesto.body}
          </p>

          <ul className="grid grid-cols-3 gap-4 pt-8 mb-10 border-t border-[var(--ovr-line)] list-none m-0 p-0 pl-0">
            {t.manifesto.pillars.map((pillar) => (
              <li key={pillar.label} className="flex flex-col gap-1.5">
                <span
                  className="text-2xl md:text-[28px] font-bold tracking-[-0.02em] uppercase text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pillar.value}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {pillar.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.a
              href="#products"
              onClick={handleCtaClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 cursor-pointer px-8 py-3.5 border-2 border-white text-white text-[12px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-white hover:text-black"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.manifesto.cta}
              <span aria-hidden="true">→</span>
            </motion.a>

            <span
              aria-hidden="true"
              className="ovr-script inline-block text-[32px] md:text-[40px]"
              style={{
                transform: 'rotate(-4deg)',
                fontFamily: 'var(--font-script)',
              }}
            >
              {t.manifesto.signature}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
