'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Lightbulb, PenTool, Play, Cpu, Eye, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const STUDIO_SEQUENCE = [
  {
    step: '01',
    title: 'IDEA',
    icon: Lightbulb,
    desc: 'Uncompromising concept discovery. We deconstruct competitive dynamics, tournament lore, and spectator psychology to isolate the core spark.',
  },
  {
    step: '02',
    title: 'DESIGN',
    icon: PenTool,
    desc: 'Bespoke design systems, dark burgundy spatial geometry, warm beige radiation lines, and precision typography constructed for maximum legibility.',
  },
  {
    step: '03',
    title: 'MOTION',
    icon: Play,
    desc: 'Kinetic 3D simulations, octane lighting rigs, and real-time lower-third score engines tested to operate with zero dropped frames.',
  },
  {
    step: '04',
    title: 'PRODUCTION',
    icon: Cpu,
    desc: 'Arena stage fabrication, physical LED integration, Vizrt / Unreal Engine pipeline deployment, and on-site engineering coordination.',
  },
  {
    step: '05',
    title: 'EXPERIENCE',
    icon: Eye,
    desc: 'The live spectacle: 40,000 screaming stadium spectators, multi-million concurrent global broadcasts, and an unforgettable shared cultural memory.',
  },
];

export default function StudioPage() {
  const { openSqueeze } = useAuth();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" /> Inside The Workshop
            </div>
            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.9]">
              THE CREATIVE STUDIO
            </h1>
            <p className="text-base sm:text-lg text-[#7DD3FC] leading-relaxed max-w-2xl font-light">
              Enter the world of NatureStudios. We are an interdisciplinary laboratory uniting stage architects, broadcast directors, realtime 3D engineers, and brand strategists.
            </p>
          </motion.div>

          {/* Sequence: IDEA -> DESIGN -> MOTION -> PRODUCTION -> EXPERIENCE */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#172554] pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
                PRODUCTION SEQUENCE PIPELINE
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">STAGES 01 — 05</span>
            </div>

            <div className="space-y-6">
              {STUDIO_SEQUENCE.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="p-8 sm:p-10 rounded-2xl bg-[#050B17] border border-[#1E3A8A] hover:border-[#38BDF8] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-6">
                      <span className="text-2xl sm:text-4xl font-black font-mono text-[#38BDF8] shrink-0">
                        {item.step}
                      </span>
                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC] flex items-center gap-3">
                          {item.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0F1D38] border border-[#1E3A8A] text-[#38BDF8] shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Studio Culture & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-3xl bg-[#0B132B] border border-[#1E3A8A]">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-widest block">
                CULTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC]">
                Live-First Engineering
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-light">
                Our studio culture rejects complacency. Because our productions run in front of packed stadiums and millions of live streams, every team member shares an obsession with zero-latency execution, visual elegance, and uncompromising narrative clarity.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-widest block">
                CAPABILITIES
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F8FAFC]">
                Global Deployment
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-light">
                Whether deploying Unreal Engine virtual stages in Tokyo, coordinating broadcast trucks in London, or designing digital tournament platforms in North America, NatureStudios provides end-to-end creative command.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-gradient-warm">
              Collaborate With Our Directors
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy">
                <span>Start A Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => openSqueeze('register')}
                className="btn-secondary text-xs py-3 px-6"
              >
                <span>Client Command Center</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
