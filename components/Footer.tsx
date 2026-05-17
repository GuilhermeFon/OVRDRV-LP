'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import type { Translations } from '@/lib/i18n';

function Instagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface FooterProps {
  t: Translations;
}

export default function Footer({ t }: FooterProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('ok');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 2400);
  };

  const fieldClass =
    'w-full px-[18px] py-3.5 bg-[var(--ovr-bg-soft)] border border-[var(--ovr-line)] text-white placeholder:text-[var(--ovr-fg-dim)] text-sm focus:outline-none focus:border-[var(--ovr-purple-500)] transition-colors duration-200';

  return (
    <footer
      id="contact"
      className="relative overflow-hidden text-white"
      style={{ background: '#000', padding: '96px 24px 32px' }}
    >
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: '-10%',
          bottom: '-30%',
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(153,0,255,0.18), transparent 60%)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto grid gap-16 grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[0.9] uppercase m-0 mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.footer.title}
          </h2>
          <p
            className="text-[var(--ovr-fg-mute)] text-base mb-9"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.footer.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <input
              type="text"
              placeholder={t.footer.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={fieldClass}
            />
            <input
              type="email"
              placeholder={t.footer.email}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={fieldClass}
            />
            <textarea
              placeholder={t.footer.message}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className={`${fieldClass} resize-none`}
            />
            <motion.button
              type="submit"
              disabled={status !== 'idle'}
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: status === 'idle' ? 0.97 : 1 }}
              className="py-4 cursor-pointer text-[13px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-colors duration-300 disabled:cursor-default"
              style={{
                fontFamily: 'var(--font-body)',
                background: status === 'ok' ? 'var(--ovr-purple-500)' : '#fff',
                color: status === 'ok' ? '#fff' : '#000',
              }}
            >
              {status === 'sending' ? (
                t.footer.sending
              ) : status === 'ok' ? (
                t.footer.sent
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center gap-9"
        >
          <Image
            src="/logo/ovrdrv-barcode-white.png"
            alt="OVRDRV"
            width={220}
            height={42}
            className="w-[220px] h-auto self-start"
          />

          <div className="flex flex-col gap-5">
            <motion.a
              href="mailto:contato@ovrdrv.com"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3.5 text-white group"
            >
              <Mail className="w-[22px] h-[22px] text-[var(--ovr-fg-mute)] group-hover:text-white transition-colors" />
              <div>
                <div
                  className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-dim)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {t.footer.emailLabel}
                </div>
                <div className="text-[17px]">contato@ovrdrv.com</div>
              </div>
            </motion.a>

            <motion.a
              href="https://instagram.com/ovrdrv"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3.5 text-white group"
            >
              <Instagram className="w-[22px] h-[22px] text-[var(--ovr-fg-mute)] group-hover:text-white transition-colors" />
              <div>
                <div
                  className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-dim)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {t.footer.instagramLabel}
                </div>
                <div className="text-[17px]">@ovrdrv</div>
              </div>
            </motion.a>

            <div
              aria-hidden="true"
              className="ovr-script mt-2 text-[36px]"
              style={{
                transform: 'rotate(-4deg)',
                fontFamily: 'var(--font-script)',
              }}
            >
              {t.footer.signature}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative max-w-[1280px] mx-auto mt-[72px] pt-6 border-t border-[var(--ovr-line)] flex flex-wrap justify-between items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-[var(--ovr-fg-dim)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        <span>{t.footer.rights}</span>
        <span>{t.footer.cnpj}</span>
        <span>{t.footer.location}</span>
      </motion.div>
    </footer>
  );
}
