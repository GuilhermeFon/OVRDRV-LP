'use client';

import { motion } from 'framer-motion';
import type { Translations } from '@/lib/i18n';

interface HeroContentProps {
  t: Translations;
}

export default function HeroContent({ t }: HeroContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-[clamp(4rem,12vw,12rem)] font-black tracking-tighter leading-none text-white"
      >
        OVRDRV
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl md:text-4xl font-black tracking-[0.3em] mt-4 text-white"
      >
        {t.hero.slogan}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-6 max-w-md text-base md:text-lg text-white/80"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.a
        href="#products"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 inline-block px-8 py-4 border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
      >
        {t.hero.cta}
      </motion.a>
    </div>
  );
}
