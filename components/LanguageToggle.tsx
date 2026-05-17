'use client';

import { motion } from 'framer-motion';
import type { Language } from '@/lib/i18n';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  const langs: Language[] = ['pt', 'en'];
  return (
    <div className="flex items-center gap-1 bg-[var(--ovr-bg-elev)] rounded-full p-[3px]">
      {langs.map((l) => (
        <motion.button
          key={l}
          type="button"
          onClick={() => setLanguage(l)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={language === l}
          className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase transition-colors ${
            language === l
              ? 'bg-white text-black'
              : 'text-[var(--ovr-fg-mute)] hover:text-white'
          }`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {l}
        </motion.button>
      ))}
    </div>
  );
}
