'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Translations } from '@/lib/i18n';

interface ManifestoProps {
  t: Translations;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const MONO = { fontFamily: 'var(--font-mono)' } as const;

/* Frames técnicos nos cantos (HUD de painel) — acendem no hover do card. */
function CornerBrackets() {
  const base =
    'absolute w-4 h-4 border-[var(--ovr-purple-500)] opacity-40 transition-opacity duration-500 group-hover:opacity-100';
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <span className={`${base} top-2 left-2 border-t border-l`} />
      <span className={`${base} top-2 right-2 border-t border-r`} />
      <span className={`${base} bottom-2 left-2 border-b border-l`} />
      <span className={`${base} bottom-2 right-2 border-b border-r`} />
    </div>
  );
}

const RAIL_SHOTS = [
  {
    src: '/images/products/product-illegal-racing-club-back-black.jpg',
    alt: 'OVRDRV — camiseta Illegal Racing Club preta · Drop 01',
    index: '02',
    /* O mockup tem muita margem preta: aproxima pra estampa preencher o tile. */
    zoom: 'scale-[1.55] group-hover:scale-[1.64]',
  },
  {
    src: '/images/grid/post-2.jpg',
    alt: 'OVRDRV — pôster da marca',
    index: '03',
  },
  {
    src: '/images/grid/post-3.jpg',
    alt: 'OVRDRV — marcas de pneu · Illegal Racing Club',
    index: '04',
  },
] as const;

/* Miniatura do rail lateral — funciona como contact sheet ao lado da foto. */
function RailShot({
  src,
  alt,
  index,
  zoom = '',
}: {
  src: string;
  alt: string;
  index: string;
  zoom?: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-[var(--ovr-bg-soft)] border border-[var(--ovr-line)] transition-colors duration-300 hover:border-[var(--ovr-purple-500)] aspect-square lg:aspect-auto lg:h-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 33vw, 190px"
        className={`object-cover opacity-75 saturate-[0.85] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:saturate-100 ${zoom || 'group-hover:scale-[1.06]'}`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7), transparent 55%)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-1.5 right-2 text-[9px] font-bold tracking-[0.18em] text-white/55 transition-colors duration-300 group-hover:text-[var(--ovr-purple-300)]"
        style={MONO}
      >
        {index}
      </span>
    </div>
  );
}

export default function Manifesto({ t }: ManifestoProps) {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    /* overflow-x-clip contém o glow que vaza pela esquerda sem criar um
       contexto de scroll, que é o que anularia o sticky da coluna visual. */
    <section
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="relative overflow-x-clip"
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

      <div className="relative max-w-[1280px] mx-auto grid gap-10 lg:gap-16 items-start grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
        {/* Editorial: retrato dominante + contact sheet lateral */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          {/* Cabeçalho do lookbook */}
          <div
            className="flex items-center gap-3 mb-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase"
            style={MONO}
          >
            <span className="whitespace-nowrap text-[var(--ovr-purple-300)]">
              {t.manifesto.lookbook.index}
            </span>
            <span
              aria-hidden="true"
              className="flex-1 h-px bg-[var(--ovr-line)]"
            />
            <span className="hidden sm:block whitespace-nowrap text-[var(--ovr-fg-dim)]">
              {t.manifesto.lookbook.spec}
            </span>
          </div>

          <div className="grid gap-2 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_23%] lg:h-[clamp(560px,72vh,760px)]">
            {/* Foto principal */}
            <figure className="group relative m-0 overflow-hidden bg-[var(--ovr-bg-soft)] border border-[var(--ovr-line)] transition-colors duration-500 hover:border-[var(--ovr-purple-600)] aspect-[3/4] lg:aspect-auto lg:h-full">
              <Image
                src="/images/lookbook/model-fuck-the-eletrics.jpg"
                alt={t.manifesto.lookbook.shotAlt}
                fill
                sizes="(max-width: 1024px) 92vw, 480px"
                className="object-cover object-[50%_26%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />

              {/* Scrim inferior — a foto dissolve no preto da seção */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.6) 15%, transparent 40%)',
                }}
              />
              {/* Luz roxa lateral, mesma do glow da seção */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(120% 80% at 0% 100%, rgba(153,0,255,0.22), transparent 60%)',
                }}
              />

              <CornerBrackets />

              {/* Tag de drop */}
              <span
                className="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-[0.22em] uppercase text-white bg-[var(--ovr-purple-500)] px-2 py-[4px]"
                style={MONO}
              >
                {t.manifesto.lookbook.tag}
              </span>

              {/* Serial vertical na lateral direita */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 z-10 hidden sm:block text-[9px] font-semibold tracking-[0.32em] uppercase text-white/45 [writing-mode:vertical-rl]"
                style={MONO}
              >
                {t.manifesto.lookbook.serial}
              </span>

              {/* Legenda */}
              <figcaption className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
                <div
                  aria-hidden="true"
                  className="h-px w-10 bg-[var(--ovr-purple-500)] mb-2.5 transition-all duration-500 group-hover:w-20"
                />
                <p
                  className="text-[clamp(1.05rem,2.4vw,1.5rem)] font-bold uppercase leading-[1] tracking-[-0.01em] text-white m-0"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t.manifesto.lookbook.shotTitle}
                </p>
                <p
                  className="mt-1.5 text-[10px] font-semibold tracking-[0.24em] uppercase text-[var(--ovr-fg-mute)] m-0"
                  style={MONO}
                >
                  {t.manifesto.lookbook.shotCaption}
                </p>
              </figcaption>
            </figure>

            {/* Contact sheet lateral (embaixo no mobile) */}
            <div className="grid gap-2 grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 lg:h-full">
              {RAIL_SHOTS.map((shot) => (
                <RailShot key={shot.src} {...shot} />
              ))}
            </div>
          </div>

          {/* Rodapé do lookbook */}
          <div
            className="hidden lg:flex items-center justify-between mt-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-[var(--ovr-fg-dim)]"
            style={MONO}
          >
            <span>{t.manifesto.lookbook.origin}</span>
            <span className="text-[var(--ovr-fg-faint)]">04 / 04</span>
          </div>
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

          <div className="max-w-[62ch] space-y-4 mb-10">
            {t.manifesto.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`leading-[1.6] ${
                  i === 0
                    ? 'text-base md:text-lg text-white/90'
                    : 'text-base text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="grid grid-cols-3 gap-4 pt-8 mb-10 border-t border-[var(--ovr-line)] list-none m-0 p-0 pl-0">
            {t.manifesto.pillars.map((pillar) => (
              <li key={pillar.label} className="group flex flex-col gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-px w-6 bg-[var(--ovr-purple-500)] mb-1 transition-all duration-500 group-hover:w-full"
                />
                <span
                  className="text-2xl md:text-[28px] font-bold tracking-[-0.02em] uppercase text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {pillar.value}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
                  style={MONO}
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
