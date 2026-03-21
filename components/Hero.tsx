'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Translations } from '@/lib/i18n';

interface HeroProps {
  t: Translations;
}

export default function Hero({ t }: HeroProps) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black dark:bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-50" />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <motion.h1
            className="text-8xl md:text-[12rem] lg:text-[16rem] font-black tracking-tighter text-white mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            OVRDRV
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-wider text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {t.hero.slogan}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.button
            onClick={scrollToProducts}
            className="mt-8 px-8 py-4 bg-white text-black font-bold text-lg tracking-wider hover:bg-neutral-200 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.cta}
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.4,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.2,
        }}
      >
        <ChevronDown className="w-8 h-8 text-white" />
      </motion.div>
    </section>
  );
}
