'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  buttonText: string;
  index: number;
}

export default function ProductCard({ name, price, image, buttonText, index }: ProductCardProps) {
  const handlePurchase = () => {
    window.open('https://checkout.cartpanda.com/example-product', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <motion.div
        className="relative overflow-hidden bg-neutral-900 dark:bg-neutral-800 aspect-3/4"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        <motion.div
          className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 z-20"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <div className="mt-4 space-y-3">
        <h3 className="text-xl font-bold tracking-wider text-white dark:text-white">
          {name}
        </h3>
        <p className="text-2xl font-black text-white dark:text-white">{price}</p>

        <motion.button
          onClick={handlePurchase}
          className="w-full py-4 bg-white text-black dark:bg-white dark:text-black font-bold text-sm tracking-widest hover:bg-neutral-200 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group/button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
}
