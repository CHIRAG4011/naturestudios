'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { PROJECTS } from '@/data/site';

const CATEGORIES = ['ALL', 'BRANDING', 'ESPORTS', 'DIGITAL', 'CONTENT', 'PRODUCTION'] as const;

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredProjects =
    activeCategory === 'ALL'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));

  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8] mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Studio Portfolio Reel
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-gradient-warm leading-[0.9]">
                  THE ARCHIVE
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mt-3 leading-relaxed">
                  Championship tournament broadcasts, arena stage architectures, and interactive digital realms engineered for competitive impact.
                </p>
              </div>
            </div>
          </div>

          {/* Animated Functional Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-12" role="group" aria-label="Filter projects by category">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8] shadow-glow-burgundy'
                      : 'bg-[#0B132B] border border-[#172554] text-[#94A3B8] hover:border-[#1E3A8A] hover:text-[#F8FAFC]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Project Reel Cards */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((proj, idx) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/work/${proj.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-[#1E3A8A] bg-[#050B17] hover:border-[#38BDF8] transition-all duration-300 shadow-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#030712]">
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        priority={idx < 2}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#030712]/80 border border-[#1E3A8A] text-[#38BDF8] backdrop-blur-md">
                          {proj.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-10 text-xs font-mono text-[#38BDF8]">
                        #{proj.number}
                      </div>
                    </div>

                    <div className="p-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                          {proj.title}
                          <ArrowUpRight className="w-4 h-4 text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h2>
                        <span className="text-xs font-mono text-[#94A3B8]">{proj.year}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                        {proj.description}
                      </p>
                      {proj.client && (
                        <div className="text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#172554]">
                          {proj.client}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
