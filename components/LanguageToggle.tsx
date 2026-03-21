'use client';

import { motion } from 'framer-motion';
import type { Language } from '@/lib/i18n';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-neutral-900 dark:bg-neutral-800 rounded-full p-1">
      <motion.button
        onClick={() => setLanguage('pt')}
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
          language === 'pt'
            ? 'bg-white text-black dark:bg-white dark:text-black'
            : 'text-white dark:text-neutral-400 hover:text-neutral-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        PT
      </motion.button>
      <motion.button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
          language === 'en'
            ? 'bg-white text-black dark:bg-white dark:text-black'
            : 'text-white dark:text-neutral-400 hover:text-neutral-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
    </div>
  );
}
