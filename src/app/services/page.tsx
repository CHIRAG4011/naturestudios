'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { SERVICES } from '@/data/site';
import Link from 'next/link';
import { ArrowRight, Sparkles, Radio, Shapes, Clapperboard, MonitorPlay, Trophy, Compass } from 'lucide-react';

export default function ServicesPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <Sparkles className="w-3.5 h-3.5" /> Capabilities Sequence
            </div>
            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.9]">
              STUDIO SERVICES
            </h1>
            <p className="text-sm sm:text-base text-[#E8C5A5] leading-relaxed max-w-2xl font-light">
              We design and execute the complete spectrum of competitive visual production: stadium architecture, arena broadcasts, kinetic motion packages, and interactive digital portfolio ecosystems.
            </p>
          </div>

          {/* Cinematic Vertical Sequence */}
          <div className="space-y-6">
            {SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              const isSelected = activeIdx === idx;
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  onClick={() => setActiveIdx(idx)}
                  className={`group p-8 sm:p-10 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#240709] border-[#FED7B8] shadow-glow-burgundy scale-[1.01]'
                      : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <span className="text-2xl sm:text-4xl font-black font-mono text-[#FED7B8] shrink-0">
                        {srv.index}
                      </span>
                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors">
                          {srv.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#B89B8D] max-w-2xl leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="p-3 rounded-xl bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8] group-hover:border-[#FED7B8] transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Footer */}
          <div className="p-10 rounded-2xl bg-[#240709] border border-[#52141A] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold uppercase text-[#FFF5ED]">Have a specific brief?</h3>
              <p className="text-xs text-[#B89B8D] mt-1">Our producers are ready to scope your tournament timeline.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy">
                <span>Start A Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
