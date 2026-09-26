'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TICKER_ITEMS } from '@/data/site';

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="w-full border-y border-[#172554] bg-[#050B17] py-3.5 overflow-hidden whitespace-nowrap relative z-10 select-none"
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="inline-flex items-center gap-8 will-change-transform"
      >
        {items.map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-8 shrink-0">
            <span className="text-xs font-mono tracking-[0.25em] text-[#38BDF8] hover:text-[#F8FAFC] transition-colors uppercase font-bold">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
