'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

export function Testimonial() {
  return (
    <section className="py-24 bg-[#050B17] border-b border-[#172554] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-10 sm:p-16 rounded-3xl bg-[#0B132B] border border-[#1E3A8A] relative shadow-2xl space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0F1D38] border border-[#1E3A8A] flex items-center justify-center mx-auto text-[#38BDF8]">
            <Quote className="w-6 h-6" />
          </div>

          <blockquote className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#F8FAFC] leading-snug max-w-3xl mx-auto">
            &ldquo;NatureStudios transformed our stadium finals from a standard competitive stream into an atmospheric cultural phenomenon.&rdquo;
          </blockquote>

          <div className="pt-4 border-t border-[#172554]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#38BDF8] font-bold">
              Tournament Broadcast Director
            </div>
            <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
              Arena Championship Series <span className="text-[#38BDF8] font-bold">[SAMPLE DEMO TESTIMONIAL]</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
