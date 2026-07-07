'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { products, type Language, type Translations } from '@/lib/i18n';

interface ProductSectionProps {
  t: Translations;
  language: Language;
}

export default function ProductSection({ t, language }: ProductSectionProps) {
  return (
    <section
      id="products"
      className="py-24 px-4 sm:px-6 bg-black"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="ovr-eyebrow text-[12px] tracking-[0.4em] mb-3"
          >
            {t.products.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.04em] leading-[0.9] uppercase text-white m-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.products.title}
          </motion.h2>
        </motion.div>

        <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              name={product.name}
              meta={product.meta[language]}
              serial={product.serial}
              back={product.back}
              buttonText={t.products.button}
              colorLabels={t.products.colors}
              viewLabels={t.products.view}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
