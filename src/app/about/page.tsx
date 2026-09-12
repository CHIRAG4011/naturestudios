'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ArrowRight, Shield, Globe, Trophy } from 'lucide-react';
import Link from 'next/link';

const VISUAL_SEQUENCE = [
  { step: '01', title: 'NATURE', desc: 'The organic foundation: natural lighting, biological instincts, and untamed inspiration.' },
  { step: '02', title: 'INSTINCT', desc: 'Raw creative impulses that bypass generic templates to discover the unexpected.' },
  { step: '03', title: 'IDEA', desc: 'Synthesizing competitive tension into a clear, unified stadium concept.' },
  { step: '04', title: 'DESIGN', desc: 'Architectural precision, kinetic typography, and deep burgundy atmosphere.' },
  { step: '05', title: 'MOTION', desc: 'Realtime 3D telemetry, broadcast lower-thirds, and arena LED choreography.' },
  { step: '06', title: 'COMPETITION', desc: 'The crucible of live esports: zero latency, zero frame drops, maximum adrenaline.' },
  { step: '07', title: 'CULTURE', desc: 'Transforming momentary wins into lasting folklore embraced by global fan communities.' },
  { step: '08', title: 'IMPACT', desc: 'Leaving an indelible impression that echoes long after the arena lights dim.' },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
            <Sparkles className="w-3.5 h-3.5" /> Studio Manifesto
          </div>
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.88] text-gradient-warm">
            WE BUILD CULTURE, <br />
            NOT JUST CONTENT.
          </h1>
          <p className="text-base sm:text-xl text-[#E8C5A5] leading-relaxed max-w-2xl font-light">
            NatureStudios is an international creative technology studio. We engineer arena stages, broadcast identities, and digital realms that millions tune in to experience.
          </p>
        </motion.div>

        {/* Visual Sequence: NATURE -> INSTINCT -> IDEA -> DESIGN -> MOTION -> COMPETITION -> CULTURE -> IMPACT */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#3D0D13] pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              STUDIO EVOLUTION SEQUENCE
            </span>
            <span className="text-xs font-mono text-[#B89B8D]">01 — 08</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISUAL_SEQUENCE.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group p-8 rounded-2xl bg-[#1C0507] border border-[#52141A] hover:border-[#FED7B8] transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#FED7B8] font-bold">
                      {item.step}
                    </span>
                    <ArrowDown className="w-4 h-4 text-[#FED7B8]/40 group-hover:text-[#FED7B8] transition-colors" />
                  </div>
                  <h2 className="text-2xl font-black uppercase text-[#FFF5ED] mb-3 group-hover:text-[#FED7B8] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#B89B8D] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Studio Philosophy Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-10 sm:p-16 rounded-3xl bg-[#240709] border border-[#52141A]">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#FED7B8]">
              PHILOSOPHY
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-[#FFF5ED]">
              The Digital Wild
            </h3>
          </div>
          <div className="lg:col-span-7 space-y-6 text-[#E8C5A5] text-sm sm:text-base leading-relaxed font-light">
            <p>
              Traditional esports aesthetics have long been trapped in cold brutalism and neon noise. NatureStudios fundamentally changes the paradigm: we fuse organic biology with stadium architecture.
            </p>
            <p>
              Deep burgundy environments, warm beige radiant lighting, subtle living foliage, and ruthless engineering reliability under live broadcast pressure.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 pt-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-gradient-warm">
            Enter The World of NatureStudios
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy">
              <span>Start A Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/portfolio" className="btn-beige text-xs py-3 px-6 shadow-glow-beige">
              <span>Build Your Portfolio</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
