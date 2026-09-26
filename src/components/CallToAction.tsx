'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Magnetic } from '@/components/motion/Magnetic';

export function CallToAction() {
  const { user, openSqueeze } = useAuth();

  return (
    <section className="relative py-28 bg-[#030712] border-t border-[#172554] overflow-hidden text-[#F8FAFC]">
      {/* Dynamic Burgundy & Cyan Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full bg-radial from-[#2563EB]/40 via-[#1E40AF]/20 to-transparent blur-[130px] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[#1E3A8A] bg-[#0F1D38] px-4 py-1.5 shadow-glow-burgundy"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#38BDF8] uppercase font-bold">
            READY TO PLAY BIGGER?
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-gradient-warm tracking-tight leading-[0.92]"
        >
          STEP INTO THE DIGITAL WILD.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-lg text-[#7DD3FC] max-w-xl mx-auto leading-relaxed font-light"
        >
          Partner with NatureStudios to produce world-class arena tournaments, or launch your creator portfolio on your personalized subdomain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <Link href="/contact" className="btn-primary text-xs py-3.5 px-6 shadow-glow-burgundy group flex items-center gap-2">
              <span>Start A Project</span>
              <ArrowRight className="h-4 w-4 text-[#38BDF8] group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </Magnetic>

          <Magnetic>
            <Link href="/portfolio" className="btn-beige text-xs py-3.5 px-6 shadow-glow-beige group flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#1E40AF] group-hover:rotate-12 transition-transform" />
              <span>Create Portfolio</span>
            </Link>
          </Magnetic>

          {user ? (
            <Magnetic>
              <Link href="/dashboard" className="btn-secondary text-xs py-3.5 px-6 group">
                <span>Command Center</span>
              </Link>
            </Magnetic>
          ) : (
            <Magnetic>
              <button
                type="button"
                onClick={() => openSqueeze('register')}
                className="btn-secondary text-xs py-3.5 px-6 cursor-pointer group"
              >
                <span>Sign In</span>
              </button>
            </Magnetic>
          )}
        </motion.div>
      </div>
    </section>
  );
}
