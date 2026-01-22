'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center items-center text-center py-32 md:py-48">
      
      <motion.span
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="mb-6 text-sm font-medium tracking-widest text-teal-400 uppercase"
      >
        New Collection 2024
      </motion.span>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white max-w-4xl"
      >
        The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Tech</span> is Here.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
      >
        Discover our premium selection of cutting-edge devices and accessories. 
        Designed for performance, built for you.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/products" className="group px-8 py-4 bg-white text-black font-bold rounded-full transition-all hover:bg-gray-200">
          <span className="flex items-center">
            Shop Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        <Link href="/products" className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors">
          View Collections
        </Link>
      </motion.div>

    </div>
  );
}
