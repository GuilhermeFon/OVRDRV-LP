'use client';

import { motion } from 'framer-motion';

interface HeroLoaderProps {
  progress: number; // 0–100
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Estilo comum às duas camadas de texto do SVG (contorno neon).
const TEXT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 132,
  letterSpacing: '-2px',
  textAnchor: 'middle',
  dominantBaseline: 'central',
};

/**
 * Intro/loader do hero — segura o usuário no topo enquanto o vídeo carrega.
 * O título OVRDRV é desenhado como contorno e uma luz neon roxa percorre o
 * traçado (estilo loading do GTA VI). Some com fade quando o vídeo fica pronto
 * (controlado por AnimatePresence no Hero).
 */
export default function HeroLoader({ progress }: HeroLoaderProps) {
  const pct = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      role="status"
      aria-label={`OVRDRV — ${pct}%`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6 pointer-events-none"
    >
      {/* glow + textura de pontos, no mesmo idioma visual do hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(153,0,255,0.20), transparent 62%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          opacity: 0.06,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Título OVRDRV com contorno + luz neon percorrendo */}
      <svg
        viewBox="0 0 680 220"
        role="img"
        aria-label="OVRDRV"
        className="relative w-[min(90vw,680px)] h-auto"
      >
        {/* Base — tubo neon apagado, sempre visível, com leve pulso */}
        <motion.text
          x="340"
          y="112"
          style={TEXT_STYLE}
          fill="none"
          stroke="var(--ovr-purple-500)"
          strokeWidth={2}
          strokeOpacity={0.28}
          animate={{ strokeOpacity: [0.2, 0.38, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          OVRDRV
        </motion.text>

        {/* Luz neon que percorre o contorno (dash viajando pelo traçado) */}
        <motion.text
          x="340"
          y="112"
          style={{
            ...TEXT_STYLE,
            filter:
              'drop-shadow(0 0 4px #b566ff) drop-shadow(0 0 12px rgba(153,0,255,0.8))',
          }}
          fill="none"
          stroke="#d9b3ff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="34 560"
          animate={{ strokeDashoffset: [0, -594] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }}
        >
          OVRDRV
        </motion.text>
      </svg>

      {/* Barra de progresso fina no rodapé — feedback discreto, sem texto */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent">
        <motion.div
          className="h-full"
          style={{
            background: 'var(--ovr-purple-500)',
            boxShadow: 'var(--glow-purple-sm)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.25, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
