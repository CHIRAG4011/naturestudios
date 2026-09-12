'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '@/data/site';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#1C0507] border-y border-[#3D0D13] scroll-mt-24 relative overflow-hidden text-[#FFF5ED]">
      {/* Subtle Atmospheric Light Orbs */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#59171B]/30 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-radial from-[#FED7B8]/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <Sparkles className="w-3.5 h-3.5" /> Capabilities
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-gradient-warm leading-[0.9]">
              STUDIO SERVICES
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-xs sm:text-sm text-[#B89B8D] max-w-sm leading-relaxed">
              Tier-1 tournament broadcasts, arena stage architectures, and interactive digital portfolio ecosystems.
            </p>
            <Link href="/services" className="btn-secondary text-xs py-2 px-4 shrink-0">
              View All 8 Services →
            </Link>
          </div>
        </div>

        {/* Vertical Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.slice(0, 4).map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="group rounded-2xl border border-[#52141A] bg-[#240709] p-7 flex flex-col justify-between hover:border-[#FED7B8] hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono tracking-widest text-[#FED7B8] font-bold">
                      {s.index}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8] group-hover:border-[#FED7B8] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold uppercase text-[#FFF5ED] mb-3 group-hover:text-[#FED7B8] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#B89B8D] leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
