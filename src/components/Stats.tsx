'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { STATS } from '@/data/site';

export function Stats() {
  return (
    <section id="stats" className="py-20 border-y border-[#172554] bg-[#030712] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="text-center md:text-left space-y-1.5"
            >
              <div className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-[#38BDF8] tabular-nums">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#94A3B8]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
