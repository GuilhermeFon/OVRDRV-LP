'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Translations } from '@/lib/i18n';

interface ProductSectionProps {
  t: Translations;
}

const products = [
  {
    name: 'Midnight Turbo',
    price: 'R$ 149,90',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Velocity Black',
    price: 'R$ 149,90',
    image: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Carbon Drift',
    price: 'R$ 149,90',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Overdrive GT',
    price: 'R$ 149,90',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ProductSection({ t }: ProductSectionProps) {
  return (
    <section id="products" className="py-24 px-4 bg-black dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            className="text-sm tracking-[0.3em] text-neutral-400 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.products.subtitle}
          </motion.p>
          <motion.h2
            className="text-6xl md:text-8xl font-black tracking-tighter text-white dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t.products.title}
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              name={product.name}
              price={product.price}
              image={product.image}
              buttonText={t.products.button}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
