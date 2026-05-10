'use client';

import Image from 'next/image';
import type { Translations } from '@/lib/i18n';

interface HeroFallbackProps {
  t: Translations;
}

/**
 * Versão estática da hero — usada durante SSR/pre-mount, com
 * `prefers-reduced-motion: reduce` ou em conexões 2g/slow-2g/saveData.
 * Sem vídeo, sem framer-motion, sem scroll trickery.
 */
export default function HeroFallback({ t }: HeroFallbackProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof document !== 'undefined') {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="OVRDRV — SEM LIMITE"
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <Image
        src="/images/hero-fallback.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-[clamp(4rem,12vw,12rem)] font-black tracking-tighter leading-none text-white">
          OVRDRV
        </h1>
        <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] mt-4 text-white">
          {t.hero.slogan}
        </h2>
        <p className="mt-6 max-w-md text-base md:text-lg text-white/80">
          {t.hero.subtitle}
        </p>
        <a
          href="#products"
          onClick={handleClick}
          className="mt-10 inline-block px-8 py-4 border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          {t.hero.cta}
        </a>
      </div>
    </section>
  );
}
