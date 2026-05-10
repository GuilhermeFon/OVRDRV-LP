'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { Translations } from '@/lib/i18n';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroContent from './HeroContent';
import ScrollIndicator from './ScrollIndicator';

interface HeroProps {
  t: Translations;
}

const VIDEO_MP4 = '/videos/hero-garage.mp4';

// Hydration-safe client check (canonical React 19 pattern).
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribeNoop, () => true, () => false);

// Network Information API (experimental, Chromium-only). Returns true for
// 2g/slow-2g/saveData; ignored elsewhere.
function detectSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
}

export default function Hero({ t }: HeroProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const slowConnection = isClient && detectSlowConnection();

  // Mode resolution. SSR + first client render before useSyncExternalStore
  // settles always produce `false` for both flags, so the initial HTML is
  // always the scroll-controlled variant — no hydration mismatch, no flash
  // of broken-image fallback.
  const isStatic = isClient && (reducedMotion || slowConnection);
  const isLoop = isClient && isMobile && !reducedMotion && !slowConnection;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  // Spring smoothing on scroll progress = Apple / GTA VI feel: scroll burst
  // becomes a smoothly-decaying playhead motion instead of frame-jumping.
  // mass < 1 keeps it responsive; stiffness/damping ratio tuned to ~0.7
  // critical damping (subtle overshoot, no oscillation).
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.6,
    restDelta: 0.0005,
  });

  // Subtle Y parallax for the mobile loop variant.
  const mobileVideoY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // Drive video.currentTime from the smoothed progress. Skipped in static /
  // loop modes (loop variant plays itself; static has no video).
  useEffect(() => {
    if (isStatic || isLoop) return;
    const video = videoRef.current;
    if (!video) return;

    // Manual playhead control — make sure the browser does NOT advance time
    // on its own. Without this, some browsers will "settle" currentTime
    // forward during decode, fighting our scroll-driven seeks.
    video.playbackRate = 0;

    let rafId: number | null = null;

    // 1 frame at 30fps ≈ 33ms. Skipping seeks below this avoids redundant
    // work when the spring is settling on a value within 1 frame's worth
    // of progress — those seeks would never actually change the rendered
    // frame anyway and just waste decoder cycles.
    const FRAME_EPSILON = 0.033;

    const seek = (target: number) => {
      if (Math.abs(video.currentTime - target) < FRAME_EPSILON) return;
      video.currentTime = target;
    };

    const onChange = (progress: number) => {
      if (!video.duration || isNaN(video.duration)) return;
      const target = video.duration * progress;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => seek(target));
    };

    const unsubscribe = smoothProgress.on('change', onChange);

    // Initial sync once metadata is available — without this, the playhead
    // sits at frame 0 even if the user already scrolled before the video
    // finished loading metadata.
    const initSync = () => onChange(smoothProgress.get());
    if (video.readyState >= 1) {
      initSync();
    } else {
      video.addEventListener('loadedmetadata', initSync, { once: true });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      unsubscribe();
      video.removeEventListener('loadedmetadata', initSync);
    };
  }, [isStatic, isLoop, smoothProgress]);

  // Reduced motion / slow connection: collapse to a still hero. No 250vh
  // wrapper, no video bytes, no animation. (This DOES cause a layout swap
  // post-hydration for these users, but they explicitly opt out of motion
  // and the swap is invisible since both states render at the top of the
  // page before any scroll.)
  if (isStatic) {
    return (
      <section
        aria-label="OVRDRV — SEM LIMITE"
        className="relative min-h-screen w-full overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-[clamp(4rem,12vw,12rem)] font-black tracking-tighter leading-none text-white">
            OVRDRV
          </h1>
          <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] mt-4 text-white">
            {t.hero.slogan}
          </h2>
          <p className="mt-6 max-w-md text-base md:text-lg text-white/80">
            {t.hero.subtitle}
          </p>
          <a
            href="#products"
            className="mt-10 inline-block px-8 py-4 border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            {t.hero.cta}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      aria-label="OVRDRV — SEM LIMITE, garagem industrial revelando carro tunado"
      // 250vh = 1.5 viewports of scroll budget for the playhead to scrub
      // from frame 0 to the last frame. Sticky child is pinned at 100vh
      // and stays imposing through the whole reveal.
      className="relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/*
          Same <motion.video> for both modes. No `poster` (we don't have
          a poster asset, and a missing one renders a broken-image icon).
          No <Image> loading overlay either — the browser shows black until
          the first frame decodes, which is cleaner than a broken icon.

          When `isLoop` is true (mobile post-mount), we add autoPlay/loop
          and the Y-transform parallax. Otherwise the playhead is driven
          by the smoothProgress effect above. The element itself never
          unmounts on the SSR→client transition, so the video doesn't
          re-fetch.
        */}
        <motion.video
          ref={videoRef}
          src={VIDEO_MP4}
          className={
            isLoop
              ? 'absolute inset-0 w-full h-[115%] object-cover'
              : 'absolute inset-0 w-full h-full object-cover'
          }
          style={isLoop ? { y: mobileVideoY } : undefined}
          autoPlay={isLoop}
          loop={isLoop}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          disableRemotePlayback
        />

        {/* Gradient overlay for WCAG AA contrast on the text. */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />

        <HeroContent t={t} scrollYProgress={scrollYProgress} />
        <ScrollIndicator scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
