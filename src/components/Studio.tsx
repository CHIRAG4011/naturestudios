'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Leaf, Trophy, Zap } from 'lucide-react';

const PILLARS = [
  {
    icon: Leaf,
    title: 'Organic Worldbuilding',
    copy: 'Biological instincts, living natural lighting, and organic spatial forms.',
  },
  {
    icon: Trophy,
    title: 'Competitive Adrenaline',
    copy: 'High-impact broadcast graphics built for esports speed and stadium energy.',
  },
  {
    icon: Cpu,
    title: 'Real-time Tech',
    copy: 'Interactive Unreal Engine 5 virtual stages and WebGL tournament platforms.',
  },
  {
    icon: Zap,
    title: 'Broadcast Fidelity',
    copy: 'Zero-latency match data HUD packages, live telemetry, and instant lower-thirds.',
  },
];

export function Studio() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const plateY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const plateScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-24 text-[#F8FAFC]"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Studio Visual Plate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="group relative overflow-hidden rounded-3xl border border-[#1E3A8A] shadow-2xl lg:col-span-6 bg-[#050B17]"
        >
          <div className="relative h-96 w-full overflow-hidden sm:h-[480px]">
            <motion.div style={{ y: plateY, scale: plateScale }} className="absolute inset-0">
              <Image
                src="/media/studio-plate.jpg"
                alt="Inside the NatureStudios creative workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover brightness-95"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#0B132B]/40 to-transparent" />
          </div>

          <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-[#1E3A8A] bg-[#0B132B]/90 p-5 backdrop-blur-md">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8]">
              STUDIO PHILOSOPHY
            </span>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#7DD3FC] font-light">
              An interdisciplinary creative laboratory fusing generative biological simulation, Unreal Engine 5 broadcast pipelines, and arena stage architecture.
            </p>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6 lg:col-span-6"
        >
          <div className="space-y-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8]">
              ABOUT NATURESTUDIOS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
              Where organic life meets pure competition
            </h2>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-[#94A3B8] font-light">
            We started from a conviction that esports spectacle does not have to feel cold and industrial. NatureStudios merges deep burgundy spatial architecture, warm beige ambient illumination, and hyper-kinetic motion systems. We design worlds that breathe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-xl border border-[#172554] bg-[#0B132B] hover:border-[#38BDF8] transition-all space-y-2.5"
                >
                  <div className="p-2 w-fit rounded-lg bg-[#0F1D38] border border-[#1E3A8A] text-[#38BDF8]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase text-[#F8FAFC]">{pillar.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{pillar.copy}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
