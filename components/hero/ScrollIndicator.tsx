'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface ScrollIndicatorProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScrollIndicator({ scrollYProgress }: ScrollIndicatorProps) {
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-20 pointer-events-none"
    >
      <span className="text-xs tracking-widest">SCROLL</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="w-px h-8 bg-white/60"
      />
    </motion.div>
  );
}
