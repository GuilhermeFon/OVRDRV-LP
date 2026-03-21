'use client';

import { motion } from 'framer-motion';
import { Mail, Instagram, Send } from 'lucide-react';
import { useState } from 'react';
import type { Translations } from '@/lib/i18n';

interface FooterProps {
  t: Translations;
}

export default function Footer({ t }: FooterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  return (
    <footer id="contact" className="bg-black dark:bg-black text-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              {t.footer.title}
            </h2>
            <p className="text-neutral-400 text-lg mb-12">{t.footer.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={t.footer.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t.footer.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <textarea
                  placeholder={t.footer.message}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-6 py-4 bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-bold text-sm tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  'ENVIANDO...'
                ) : submitStatus === 'success' ? (
                  '✓ ENVIADO!'
                ) : (
                  <>
                    {t.footer.send}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black tracking-tighter mb-8">OVRDRV</h3>

              <div className="space-y-6">
                <motion.a
                  href="mailto:contato@ovrdrv.com"
                  className="flex items-center gap-4 text-lg group"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-sm text-neutral-500">{t.footer.emailLabel}</p>
                    <p className="text-white">contato@ovrdrv.com</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://instagram.com/ovrdrv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-lg group"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Instagram className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-sm text-neutral-500">{t.footer.instagramLabel}</p>
                    <p className="text-white">@ovrdrv</p>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm"
        >
          <p>{t.footer.rights}</p>
        </motion.div>
      </div>
    </footer>
  );
}
