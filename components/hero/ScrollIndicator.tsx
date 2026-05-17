'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface ScrollIndicatorProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScrollIndicator({ scrollYProgress }: ScrollIndicatorProps) {
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div
      style={{ opacity, fontFamily: 'var(--font-mono)' }}
      className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 z-20 pointer-events-none uppercase"
    >
      <span className="text-[10px] tracking-[0.4em] font-semibold">SCROLL</span>
      <motion.div
        animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        className="w-px h-9 origin-top"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
        }}
      />
    </motion.div>
  );
}
