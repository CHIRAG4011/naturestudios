'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC] selection:bg-[#2563EB] selection:text-[#38BDF8]">
      <Navbar />

      <main id="main" className="flex-1 flex items-center justify-center px-6 py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-6 max-w-xl"
        >
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E63946]" /> 404 // MAP BOUNDARY EXCEEDED
          </div>

          <div className="relative select-none my-2">
            <span
              className="text-[9rem] sm:text-[13rem] font-black font-mono leading-none text-[#0B132B]"
              aria-hidden="true"
            >
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-[9rem] sm:text-[13rem] font-black font-mono leading-none text-[#38BDF8]/25 translate-x-1 translate-y-1">
              404
            </span>
          </div>

          <div className="space-y-3 -mt-6">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gradient-warm">
              LOST IN THE ARENA
            </h1>
            <p className="text-sm sm:text-base text-[#7DD3FC] leading-relaxed max-w-md mx-auto font-light">
              Looks like you&apos;ve wandered outside the map. The broadcast coordinates you requested do not exist in the NatureStudios realm.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy inline-flex items-center gap-2">
              <span>RETURN HOME →</span>
            </Link>
            <Link href="/work" className="btn-secondary text-xs py-3 px-6">
              <span>Explore Work</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
