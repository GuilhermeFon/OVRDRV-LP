'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { track } from '@/lib/analytics';

interface HeroContentProps {
  t: Translations;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroContent({ t }: HeroContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track('cta_click', { location: 'hero', label: t.hero.cta });
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="ovr-eyebrow text-[var(--ovr-purple-300)] mb-3 ovr-glow-purple"
      >
        {t.hero.eyebrow}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ fontFamily: 'var(--font-display)' }}
        className="text-[clamp(4rem,14vw,13rem)] font-bold tracking-[-0.04em] leading-[0.85] uppercase text-white"
      >
        OVRDRV
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        style={{ fontFamily: 'var(--font-supporting)' }}
        className="text-2xl md:text-4xl font-normal tracking-[0.35em] mt-3 uppercase text-white"
      >
        {t.hero.slogan}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        className="mt-5 max-w-md text-base md:text-lg text-white/80 leading-[1.55]"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.a
        href="#products"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 inline-block px-9 py-4 border-2 border-white text-white text-[13px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-white hover:text-black"
      >
        {t.hero.cta}
      </motion.a>

      <motion.div
        initial={{ opacity: 0, rotate: -8 }}
        animate={{ opacity: 0.95, rotate: -8 }}
        transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
        aria-hidden="true"
        className="ovr-script pointer-events-none absolute hidden sm:block"
        style={{
          right: 'clamp(20px, 8vw, 100px)',
          top: 'clamp(80px, 18vh, 200px)',
          fontSize: 'clamp(48px, 7vw, 96px)',
          textShadow: 'var(--glow-purple)',
        }}
      >
        {t.hero.ignite}
      </motion.div>
    </div>
  );
}
