'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from '@/components/hero/Hero';
import Manifesto from '@/components/Manifesto';
import VipList from '@/components/VipList';
import ProductSection from '@/components/ProductSection';
// import Carousel from '@/components/Carousel'; // Lifestyle comentado por enquanto
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import LanguageToggle from '@/components/LanguageToggle';
import { translations, type Language } from '@/lib/i18n';
import { track } from '@/lib/analytics';

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
    track('nav_click', { target: id });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={heroPassed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!heroPassed}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-[12px] border-b border-[var(--ovr-line)] ${
          heroPassed ? '' : 'pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-7 py-3.5 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="OVRDRV — Voltar ao topo"
            className="flex items-center cursor-pointer"
          >

            <Image
              src="/logo/ovrdrv-barcode-white.png"
              alt="OVRDRV"
              width={140}
              height={26}
              priority
              className="h-[26px] w-auto"
            />
          </button>

          <div className="hidden md:flex items-center gap-7">
            <button
              type="button"
              onClick={() => scrollToSection('manifesto')}
              className="ovr-navlink cursor-pointer text-[12px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.nav.manifesto}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('products')}
              className="ovr-navlink cursor-pointer text-[12px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.nav.produtos}
            </button>
            {/* Lookbook comentado — seção Lifestyle desativada por enquanto
            <button
              type="button"
              onClick={() => scrollToSection('lookbook')}
              className="ovr-navlink cursor-pointer text-[12px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.nav.lookbook}
            </button>
            */}
            <button
              type="button"
              onClick={() => scrollToSection('lista-vip')}
              className="ovr-navlink cursor-pointer text-[12px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.nav.listaVip}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="ovr-navlink cursor-pointer text-[12px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.nav.contato}
            </button>
          </div>

          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
      </motion.nav>

      <main>
        <Hero t={t} />
        <Ticker variant="invert" />
        <Manifesto t={t} />
        <ProductSection t={t} language={language} />
        <VipList t={t} />
        {/* Lifestyle (Carousel) comentado por enquanto
        <Carousel t={t} />
        */}
        <Ticker variant="dark" />
        <Footer t={t} />
      </main>
    </div>
  );
}
