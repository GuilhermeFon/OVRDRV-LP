'use client';

import { type RefObject, useEffect } from 'react';
import { type MotionValue } from 'framer-motion';

/**
 * Sincroniza o `currentTime` de um <video> com um MotionValue de progresso.
 * O vídeo NÃO deve ter `autoPlay` — quem move a playhead é o scroll.
 *
 * `requestAnimationFrame` cancela o frame anterior antes de aplicar o novo,
 * evitando bursts de seek quando o usuário rola muito rápido.
 */
export function useScrollVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  scrollYProgress: MotionValue<number>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let rafId: number | null = null;
    let unsubscribe: (() => void) | null = null;

    const startSync = () => {
      unsubscribe = scrollYProgress.on('change', (progress) => {
        if (!video.duration || isNaN(video.duration)) return;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          video.currentTime = video.duration * progress;
        });
      });
    };

    // readyState >= 1 (HAVE_METADATA) significa que `duration` já é confiável.
    if (video.readyState >= 1) {
      startSync();
    } else {
      video.addEventListener('loadedmetadata', startSync, { once: true });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (unsubscribe) unsubscribe();
      video.removeEventListener('loadedmetadata', startSync);
    };
  }, [videoRef, scrollYProgress, enabled]);
}
