'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Translations } from '@/lib/i18n';

interface CarouselProps {
  t: Translations;
}

const images = [
  '/images/lookbook/site-model-irc.png',
  '/images/lookbook/post-001.png',
  '/images/lookbook/post-002.png',
  '/images/lookbook/post-003.png',
];

export default function Carousel({ t }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="lookbook"
      className="py-24 px-4 sm:px-6"
      style={{ background: 'var(--ovr-bg-soft)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="ovr-eyebrow text-[12px] tracking-[0.4em] mb-3 text-center"
        >
          {t.carousel.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.04em] leading-[0.9] uppercase text-white text-center m-0 mb-14"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.carousel.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-video overflow-hidden bg-black"
        >
          {images.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transform: index === currentIndex ? 'scale(1)' : 'scale(1.08)',
                transition:
                  'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 7000ms linear',
              }}
            >
              <Image
                src={image}
                alt={`OVRDRV Lookbook ${index + 1}`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          ))}

          <div
            className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-white/70 px-2 py-1"
            style={{
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            REC · {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(images.length).padStart(2, '0')}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Slide ${index + 1}`}
                className="h-1 transition-all duration-300"
                style={{
                  width: index === currentIndex ? 28 : 8,
                  background:
                    index === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
