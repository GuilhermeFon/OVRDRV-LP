'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  price: string;
  meta: string;
  serial: string;
  image: string;
  buttonText: string;
  index: number;
}

export default function ProductCard({
  name,
  price,
  meta,
  serial,
  image,
  buttonText,
  index,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);

  const handlePurchase = () => {
    window.open('https://checkout.cartpanda.com/example-product', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col gap-3.5 group"
    >
      <div className="relative aspect-3/4 bg-[var(--ovr-bg-soft)] overflow-hidden cursor-pointer">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700"
          style={{
            transform: hover ? 'scale(1.08)' : 'scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)',
            opacity: hover ? 1 : 0,
          }}
        />

        <span
          className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.22em] uppercase text-white bg-[var(--ovr-purple-500)] px-2 py-[3px]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          DROP #001
        </span>

        <span
          className="absolute top-3 right-3 text-[10px] font-bold tracking-[0.15em] text-white px-1.5 py-[3px] backdrop-blur-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            border: '1px solid rgba(255,255,255,0.45)',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          {serial}
        </span>

        <div
          aria-hidden="true"
          className="absolute inset-2 border-2 border-white pointer-events-none transition-opacity duration-200"
          style={{ opacity: hover ? 0.25 : 0 }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {meta}
        </span>
        <h3
          className="text-xl font-semibold uppercase text-white m-0"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {name}
        </h3>
        <div
          className="text-2xl font-bold tracking-[-0.02em] text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-[13px] text-[var(--ovr-fg-mute)] mr-1 font-normal">
            R$
          </span>
          {price}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handlePurchase}
        whileTap={{ scale: 0.97 }}
        className="w-full cursor-pointer py-3.5 text-[12px] font-bold tracking-[0.28em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          fontFamily: 'var(--font-body)',
          background: hover ? 'var(--ovr-purple-500)' : '#fff',
          color: hover ? '#fff' : '#000',
          boxShadow: hover ? '0 0 20px rgba(153,0,255,0.5)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {buttonText}
        <span
          className="inline-block transition-transform"
          style={{
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
            transitionDuration: '220ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          →
        </span>
      </motion.button>
    </motion.div>
  );
}
