'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { track } from '@/lib/analytics';
import GlitchLogo from '@/components/GlitchLogo';

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
      {/* O logo é uma imagem, então o H1 da página vive aqui só pro leitor de
          tela e pro buscador. */}
      <h1 className="sr-only">
        OVRDRV, {t.hero.eyebrow}, {t.hero.slogan}
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="w-[clamp(300px,78vw,660px)]"
      >
        <GlitchLogo />
      </motion.div>

      <motion.a
        href="#products"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 inline-block px-9 py-4 border-2 border-white text-white text-[13px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-white hover:text-black"
      >
        {t.hero.cta}
      </motion.a>
    </div>
  );
}
