'use client';

import { motion } from 'framer-motion';

const tickerText = 'OVRDRV — SEM LIMITE — PERFORMANCE — LUXURY — DROP 01 — ';

export default function Ticker() {
  return (
    <div className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 py-6 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white px-8"
          >
            {tickerText}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
