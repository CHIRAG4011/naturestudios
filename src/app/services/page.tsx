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
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" /> Capabilities Sequence
            </div>
            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.9]">
              STUDIO SERVICES
            </h1>
            <p className="text-sm sm:text-base text-[#7DD3FC] leading-relaxed max-w-2xl font-light">
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
                      ? 'bg-[#0B132B] border-[#38BDF8] shadow-glow-burgundy scale-[1.01]'
                      : 'bg-[#050B17] border-[#172554] hover:border-[#1E3A8A]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-6">
                      <span className="text-2xl sm:text-4xl font-black font-mono text-[#38BDF8] shrink-0">
                        {srv.index}
                      </span>
                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                          {srv.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="p-3 rounded-xl bg-[#0F1D38] border border-[#1E3A8A] text-[#38BDF8] group-hover:border-[#38BDF8] transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Footer */}
          <div className="p-10 rounded-2xl bg-[#0B132B] border border-[#1E3A8A] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold uppercase text-[#F8FAFC]">Have a specific brief?</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Our producers are ready to scope your tournament timeline.</p>
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
