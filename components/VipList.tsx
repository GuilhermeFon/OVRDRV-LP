'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Translations } from '@/lib/i18n';

interface VipListProps {
  t: Translations;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Endpoint do Google Apps Script (Web App). Configurável via env para trocar
// a planilha sem editar código; cai no valor já publicado como fallback.
const SHEET_ENDPOINT =
  process.env.NEXT_PUBLIC_SHEET_ENDPOINT ??
  'https://script.google.com/macros/s/AKfycbwHicLZi94QlGYPttolWY-O6LAGbs5F0-MSbCpyUchMVsTztKGEsivXBTJqezs2OaqN/exec';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SIZES = ['PP', 'P', 'M', 'G', 'GG'] as const;
type Size = (typeof SIZES)[number];

// Máscara de WhatsApp BR: (11) 99999-9999
function maskWhatsapp(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, '($1) $2').trim();
  return v;
}

type Status = 'idle' | 'sending' | 'success';

export default function VipList({ t }: VipListProps) {
  const v = t.vipList;
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [size, setSize] = useState<Size | ''>('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  // Posição / contador visual (só efeito — número real vem do servidor).
  // Sorteado uma vez; os nós que o exibem usam suppressHydrationWarning
  // porque o valor difere entre server e client de propósito.
  const [position] = useState(() =>
    String(Math.floor(37 + Math.random() * 40)).padStart(3, '0'),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nome = form.nome.trim();
    const email = form.email.trim();
    const whatsapp = form.whatsapp.trim();
    const waDigits = whatsapp.replace(/\D/g, '');

    if (nome.length < 2) return setError(v.errors.name);
    if (!EMAIL_RE.test(email)) return setError(v.errors.email);
    if (waDigits.length < 10) return setError(v.errors.whatsapp);
    if (!size) return setError(v.errors.size);

    if (!SHEET_ENDPOINT || SHEET_ENDPOINT.includes('COLE_AQUI')) {
      return setError(v.errors.notConfigured);
    }

    setStatus('sending');

    try {
      // Apps Script devolve redirect 302 pra outra origem — usamos no-cors
      // (fire-and-forget): não lemos a resposta, mas os dados chegam na planilha.
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          whatsapp_digits: waDigits,
          tamanho: size,
          origem: 'landing-ovrdrv',
          user_agent:
            typeof navigator !== 'undefined' ? navigator.userAgent : '',
          timestamp: new Date().toISOString(),
        }),
      });
      setForm({ nome: '', email: '', whatsapp: '' });
      setSize('');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      setError(v.errors.generic);
    }
  };

  const fieldClass =
    'w-full bg-[var(--ovr-bg-soft)] border border-[var(--ovr-line)] text-white text-[15px] tracking-[0.02em] px-4 pt-[18px] pb-4 outline-none placeholder:text-[var(--ovr-fg-dim)] transition-[border-color,box-shadow] duration-200 focus:border-[var(--ovr-purple-500)] focus:shadow-[0_0_0_3px_rgba(153,0,255,0.15)]';

  return (
    <section
      id="lista-vip"
      aria-labelledby="vip-title"
      className="relative overflow-hidden"
      style={{ background: '#000', padding: 'clamp(72px, 10vw, 120px) 24px' }}
    >
      {/* glows + dot texture, iguais às demais seções */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          right: '-12%',
          top: '10%',
          width: 720,
          height: 720,
          background:
            'radial-gradient(circle, rgba(153,0,255,0.14), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none mix-blend-screen"
        style={{
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto grid gap-12 lg:gap-20 items-center grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* ── Coluna esquerda: copy + stats ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="ovr-eyebrow text-[12px] tracking-[0.4em] mb-4 text-[var(--ovr-purple-300)] ovr-glow-purple">
            {v.eyebrow}
          </p>

          <h2
            id="vip-title"
            className="text-[clamp(3rem,9vw,7rem)] font-extrabold tracking-[-0.04em] leading-[0.85] uppercase text-white m-0 mb-6 whitespace-pre-line"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {v.title}
          </h2>

          <p
            className="max-w-[520px] text-base text-white/85 leading-[1.6] mb-9 [&_strong]:text-white [&_strong]:font-semibold"
            style={{ fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: v.lead }}
          />

          <ul className="grid grid-cols-2 gap-4 pt-7 border-t border-[var(--ovr-line)] list-none m-0 p-0 max-w-[420px]">
            {v.stats.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-1.5">
                <span
                  className="text-2xl md:text-[28px] font-extrabold tracking-[-0.02em] uppercase text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Coluna direita: card do formulário ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative border border-[var(--ovr-line)] px-7 py-9 sm:px-10 sm:py-11 backdrop-blur-[6px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,10,30,0.6) 0%, rgba(0,0,0,0.75) 100%)',
          }}
        >
          {/* moldura interna decorativa */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ inset: 10, border: '1px solid rgba(255,255,255,0.06)' }}
          />

          {/* tags do topo do card */}
          <span
            className="absolute top-0 left-6 -translate-y-1/2 bg-[var(--ovr-purple-500)] text-white text-[10px] font-bold tracking-[0.22em] uppercase px-2.5 py-1.5"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {v.cardTag}
          </span>
          <span
            className="absolute top-0 right-6 -translate-y-1/2 bg-black text-white text-[10px] font-bold tracking-[0.15em] px-2.5 py-1.5"
            style={{
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(255,255,255,0.45)',
            }}
            suppressHydrationWarning
          >
            {position}/100
          </span>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative flex flex-col items-center text-center py-5 px-2"
            >
              <div
                className="text-[11px] font-bold tracking-[0.28em] uppercase text-[var(--ovr-purple-300)] mb-3.5 ovr-glow-purple"
                style={{ fontFamily: 'var(--font-mono)' }}
                suppressHydrationWarning
              >
                — {v.success.position} {position}/100 —
              </div>
              <h3
                className="text-[clamp(2rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] leading-[0.95] uppercase text-white mb-2.5 whitespace-pre-line"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {v.success.title}
              </h3>
              <p
                className="max-w-[340px] text-sm text-[var(--ovr-fg-mute)] leading-[1.6]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {v.success.body}
              </p>
              <div
                aria-hidden="true"
                className="ovr-script mt-6 text-[32px]"
                style={{
                  transform: 'rotate(-4deg)',
                  fontFamily: 'var(--font-script)',
                }}
              >
                {v.success.signature}
              </div>
            </motion.div>
          ) : (
            <div className="relative">
              <h3
                className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[0.95] uppercase text-white mb-2 whitespace-pre-line"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {v.cardTitle}
              </h3>
              <p
                className="text-sm text-[var(--ovr-fg-mute)] leading-[1.55] mb-7"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {v.cardSubtitle}
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
                {(['nome', 'email', 'whatsapp'] as const).map((key) => {
                  const labelMap = {
                    nome: v.fields.name,
                    email: v.fields.email,
                    whatsapp: v.fields.whatsapp,
                  };
                  return (
                    <div key={key} className="relative">
                      <label
                        htmlFor={`vip-${key}`}
                        className="absolute -top-2 left-3 z-10 bg-black px-1.5 text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {labelMap[key]}
                      </label>
                      <input
                        id={`vip-${key}`}
                        name={key}
                        type={key === 'email' ? 'email' : key === 'whatsapp' ? 'tel' : 'text'}
                        inputMode={key === 'whatsapp' ? 'tel' : undefined}
                        autoComplete={
                          key === 'nome' ? 'name' : key === 'email' ? 'email' : 'tel'
                        }
                        placeholder={v.placeholders[key === 'nome' ? 'name' : key]}
                        value={form[key]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            [key]:
                              key === 'whatsapp'
                                ? maskWhatsapp(e.target.value)
                                : e.target.value,
                          }))
                        }
                        className={fieldClass}
                      />
                    </div>
                  );
                })}

                {/* Seletor de tamanho — radios estilizados no padrão OVRDRV */}
                <fieldset className="m-0 mt-1 p-0 border-0">
                  <legend
                    className="mb-2 p-0 text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--ovr-fg-mute)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {v.sizeLabel}
                  </legend>
                  <div className="grid grid-cols-5 gap-2">
                    {SIZES.map((sz) => {
                      const selected = size === sz;
                      return (
                        <label key={sz} className="cursor-pointer">
                          <input
                            type="radio"
                            name="tamanho"
                            value={sz}
                            checked={selected}
                            onChange={() => setSize(sz)}
                            className="sr-only peer"
                          />
                          <span
                            className={`flex items-center justify-center py-3 text-[13px] font-bold tracking-[0.08em] uppercase border transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ovr-purple-400)] ${
                              selected
                                ? 'border-[var(--ovr-purple-500)] bg-[var(--ovr-purple-500)] text-white shadow-[var(--glow-purple-sm)]'
                                : 'border-[var(--ovr-line)] bg-[var(--ovr-bg-soft)] text-[var(--ovr-fg-mute)] hover:border-[var(--ovr-line-strong)] hover:text-white'
                            }`}
                            style={{ fontFamily: 'var(--font-mono)' }}
                          >
                            {sz}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                  whileTap={{ scale: status === 'sending' ? 1 : 0.97 }}
                  className="group mt-2 flex items-center justify-center gap-3 border-2 border-white bg-white text-black text-[13px] font-extrabold tracking-[0.3em] uppercase py-[18px] px-5 cursor-pointer transition-colors duration-200 hover:bg-transparent hover:text-white disabled:opacity-55 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {status === 'sending' ? v.sending : v.submit}
                  {status !== 'sending' && (
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </motion.button>

                {error && (
                  <p
                    role="alert"
                    className="mt-1 px-4 py-3.5 text-[12px] tracking-[0.14em] uppercase text-[#ff7a94] border border-[rgba(255,120,150,0.4)] bg-[rgba(255,0,60,0.06)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {error}
                  </p>
                )}

                <p
                  className="mt-2 text-[10px] tracking-[0.18em] uppercase text-[var(--ovr-fg-dim)] leading-[1.6]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {v.fine}
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
