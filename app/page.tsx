'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/hero/Hero';
import ProductSection from '@/components/ProductSection';
import Carousel from '@/components/Carousel';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import LanguageToggle from '@/components/LanguageToggle';
import { translations, type Language } from '@/lib/i18n';

const subscribeScrollResize = (callback: () => void) => {
  window.addEventListener('scroll', callback, { passive: true });
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('scroll', callback);
    window.removeEventListener('resize', callback);
  };
};

const getHeroPassed = () => {
  const hero = document.querySelector<HTMLElement>('section[aria-label*="OVRDRV"]');
  if (!hero) return false;
  return hero.getBoundingClientRect().bottom <= 0;
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('pt');
  const heroPassed = useSyncExternalStore(
    subscribeScrollResize,
    getHeroPassed,
    () => false,
  );
  const t = translations[language];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black dark:bg-black text-white min-h-screen">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={
          heroPassed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!heroPassed}
        className={`fixed top-0 left-0 right-0 z-50 bg-black/80 dark:bg-black/80 backdrop-blur-lg border-b border-neutral-800 ${
          heroPassed ? '' : 'pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="text-2xl font-black tracking-tighter cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            OVRDRV
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <motion.button
              onClick={() => scrollToSection('products')}
              className="text-sm font-semibold tracking-wider hover:text-neutral-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {t.nav.produtos}
            </motion.button>
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold tracking-wider hover:text-neutral-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {t.nav.contato}
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </motion.nav>

      <main>
        <Hero t={t} />
        <Ticker />
        <ProductSection t={t} />
        <Carousel t={t} />
        <Ticker />
        <Footer t={t} />
      </main>
    </div>
  );
}
