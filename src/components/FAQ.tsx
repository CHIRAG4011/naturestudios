'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'STUDIO & MISSION',
    question: 'What is Nature Studios?',
    answer:
      'Nature Studios (NatureStudios) is an elite creative studio and live production powerhouse. We merge biophilic organic architecture with high-performance competitive technology to engineer stage architectures, tournament broadcasts, motion graphics, and interactive platforms for the world’s leading esports properties and entertainment brands.',
  },
  {
    category: 'PRODUCTION SERVICES',
    question: 'What services does Nature Studios provide for esports tournaments?',
    answer:
      'Our team delivers end-to-end creative and technical solutions: arena stage architectural design, physical LED setups, live tournament broadcast graphic packages (HUDs, lower-thirds, telemetry), 3D opening cinematic trailers, tournament brand identity systems, and custom real-time spectator web apps.',
  },
  {
    category: 'COMMISSIONING & BOOKING',
    question: 'How do I commission Nature Studios for a tournament or broadcast package?',
    answer:
      'You can reach our team via our Contact page or by submitting a Project Request through our client portal. Our creative directors and technical leads will review your tournament mandate, timeline, and deliverables to provide a tailored creative treatment and production estimate.',
  },
  {
    category: 'REAL-TIME 3D & TECHNOLOGY',
    question: 'Does Nature Studios work with real-time 3D engines like Unreal Engine?',
    answer:
      'Yes. We specialize in real-time Unreal Engine 5 virtual production, camera tracking, and reactive visualizers. Our broadcast telemetry packages integrate directly into match servers and production switchers (Vizrt, vMix, Ross Video) for zero-latency live data visualization.',
  },
  {
    category: 'GLOBAL OPERATIONS',
    question: 'Where is Nature Studios located and do you handle international projects?',
    answer:
      'Nature Studios is based in India and operates globally. We have delivered physical stage designs, broadcast graphics, and interactive systems for premier esports events, championship tours, and publishers across North America, Europe, Asia, and the Middle East.',
  },
  {
    category: 'JERSEY & APPAREL',
    question: 'Does Nature Studios design custom esports jerseys and apparel?',
    answer:
      'Yes! Nature Studios engineers bespoke esports jersey designs, pro team kits, sublimation vectors, and merchandise branding with realistic 3D apparel mockups ready for international apparel manufacturing.',
  },
  {
    category: 'CLIPPING & VFX',
    question: 'What is the Nature Studios creator clipping and VFX suite?',
    answer:
      'Our clipping and VFX powerhouse produces high-velocity gaming highlights, viral YouTube shorts, and cinematic tournament montages for elite creators including Elvish Yadav, Scout, and Kashvi.',
  },
  {
    category: 'DIRECT CONTACT',
    question: 'How can I directly contact or chat with Nature Studios?',
    answer:
      'You can connect directly via WhatsApp at +91 7480 066 539, join our official Discord community (discord.gg/PTVReHZp4n), DM us on Instagram @naturestudio.in, or email naturestudio05@gmail.com.',
  },
  {
    category: 'CREATOR HUB',
    question: 'Can esports creators and designers build portfolios on Nature Studios?',
    answer:
      'Yes! Nature Studios offers a dedicated Creator Hub where designers, broadcast engineers, and 3D artists can build, showcase, and customize their esports portfolios with live themes, project reels, and verified creator badges.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative py-28 bg-[#030712] border-t border-[#172554] text-[#F8FAFC] overflow-hidden"
      aria-label="Frequently Asked Questions"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563EB]/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F1D38] border border-[#1E3A8A] text-xs font-mono uppercase tracking-widest text-[#38BDF8]">
            <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
            Knowledge & Inquiries
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gradient-warm leading-[1.05]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Everything you need to know about partnering with Nature Studios for championship esports production, broadcast identity, and stage architecture.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#38BDF8]/60 bg-[#0B132B] shadow-lg shadow-[#2563EB]/20'
                    : 'border-[#172554] bg-[#050B17] hover:border-[#1E3A8A]'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#38BDF8]/70 block">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#F8FAFC]">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#2563EB] border-[#38BDF8] text-[#38BDF8] rotate-180'
                        : 'bg-[#0F1D38] border-[#1E3A8A] text-[#94A3B8]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 sm:px-8 pb-6 text-xs sm:text-sm text-[#7DD3FC] leading-relaxed border-t border-[#172554]/60 pt-4 font-light">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom helper card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#320C10] to-[#0B132B] border border-[#1E3A8A] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold uppercase text-[#F8FAFC] flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" /> Have a custom mandate or inquiry?
            </h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Our executive production team responds within 24 hours with project scoping and availability.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-primary text-xs py-3 px-6 shrink-0 shadow-glow-burgundy"
          >
            <span>Get In Touch →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
