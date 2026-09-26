'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '@/data/site';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { Magnetic } from '@/components/motion/Magnetic';
import { Tilt3DCard } from '@/components/motion/Tilt3DCard';
import { ImageReveal } from '@/components/motion/ImageReveal';

export function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentProject = PROJECTS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <section id="work" className="py-24 bg-[#030712] text-[#F8FAFC] overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Featured Production Reel
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase text-gradient-warm leading-[0.9]">
              CINEMATIC ARCHIVE
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Magnetic>
              <Link
                href="/work"
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 group"
              >
                <span>Explore All 6 Projects</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Magnetic>
            <div className="flex items-center gap-2">
              <Magnetic>
                <button
                  onClick={handlePrev}
                  aria-label="Previous Project"
                  className="p-3 rounded-full bg-[#0B132B] border border-[#1E3A8A] hover:border-[#38BDF8] hover:bg-[#1E40AF] transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#38BDF8] group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={handleNext}
                  aria-label="Next Project"
                  className="p-3 rounded-full bg-[#0B132B] border border-[#1E3A8A] hover:border-[#38BDF8] hover:bg-[#1E40AF] transition-all cursor-pointer group"
                >
                  <ChevronRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Cinematic Reel Showcase */}
        <Tilt3DCard maxTilt={3.5} glareOpacity={0.12} className="rounded-3xl">
          <div className="relative rounded-3xl overflow-hidden border border-[#1E3A8A] bg-[#050B17] shadow-2xl p-6 sm:p-10 lg:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Column: Metadata & Typography */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-xl font-black text-[#38BDF8]">
                      {currentProject.number} / {String(PROJECTS.length).padStart(2, '0')}
                    </span>
                    <span className="text-[#1E3A8A]">|</span>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded bg-[#0F1D38] border border-[#1E3A8A] text-[10px] uppercase text-[#38BDF8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F8FAFC] leading-[0.92] hover:translate-x-1.5 transition-transform duration-300">
                    {currentProject.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl font-light">
                    {currentProject.description}
                  </p>

                  {currentProject.client && (
                    <div className="text-xs font-mono text-[#38BDF8]/80">
                      <span className="text-[#64748B]">CLIENT:</span> {currentProject.client}
                    </div>
                  )}

                  <div className="pt-4 flex items-center gap-4">
                    <Magnetic>
                      <Link
                        href={`/work/${currentProject.slug}`}
                        className="btn-primary text-xs py-3.5 px-6 shadow-glow-burgundy group flex items-center gap-2"
                      >
                        <span>Inspect Case Study</span>
                        <ArrowUpRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </Magnetic>
                  </div>
                </div>

                {/* Right Column: Visual Reel Preview */}
                <div className="lg:col-span-6">
                  <Link
                    href={`/work/${currentProject.slug}`}
                    data-cursor="view"
                    className="block group"
                  >
                    <ImageReveal duration={0.8}>
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#1E3A8A] bg-[#030712]">
                        <Image
                          src={currentProject.image}
                          alt={currentProject.title}
                          fill
                          priority
                          className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="absolute bottom-4 right-4 bg-[#0B132B]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#1E3A8A] text-[11px] font-mono uppercase text-[#38BDF8] flex items-center gap-1.5 shadow-lg group-hover:border-[#38BDF8] transition-colors">
                          <span>View Case</span> <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </ImageReveal>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

          {/* Reel Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[#172554]">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to ${p.title}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-8 bg-[#38BDF8]' : 'w-2 bg-[#1E3A8A] hover:bg-[#38BDF8]/50'
                }`}
              />
            ))}
          </div>
        </div>
        </Tilt3DCard>
      </div>
    </section>
  );
}
