'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

export function Testimonial() {
  return (
    <section className="py-24 bg-[#1C0507] border-b border-[#3D0D13] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-10 sm:p-16 rounded-3xl bg-[#240709] border border-[#52141A] relative shadow-2xl space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#2D0A0E] border border-[#52141A] flex items-center justify-center mx-auto text-[#FED7B8]">
            <Quote className="w-6 h-6" />
          </div>

          <blockquote className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#FFF5ED] leading-snug max-w-3xl mx-auto">
            &ldquo;NatureStudios transformed our stadium finals from a standard competitive stream into an atmospheric cultural phenomenon.&rdquo;
          </blockquote>

          <div className="pt-4 border-t border-[#3D0D13]">
            <div className="font-mono text-xs uppercase tracking-widest text-[#FED7B8] font-bold">
              Tournament Broadcast Director
            </div>
            <div className="text-[11px] font-mono text-[#B89B8D] mt-0.5">
              Arena Championship Series <span className="text-[#FED7B8] font-bold">[SAMPLE DEMO TESTIMONIAL]</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
