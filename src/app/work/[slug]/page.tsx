'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { PROJECTS } from '@/data/site';

interface Props {
  params: { slug: string };
}

export default function WorkSlugPage({ params }: Props) {
  const project = PROJECTS.find((p) => p.slug === params.slug || p.id === params.slug);
  if (!project) notFound();

  const related = PROJECTS.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-24 pb-24">
        {/* 1. Hero */}
        <div className="relative h-[65vh] lg:h-[75vh] w-full overflow-hidden bg-[#1C0507]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover object-center brightness-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150304] via-[#150304]/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-12 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8]">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-[#B89B8D]">CASE STUDY #{project.number}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-gradient-warm">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg text-[#E8C5A5] max-w-2xl font-light">
                {project.description}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 space-y-20">
          {/* Back Navigation */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FED7B8] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Projects
          </Link>

          {/* Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-[#3D0D13] font-mono">
            <div>
              <div className="text-[10px] uppercase text-[#B89B8D] tracking-widest">Client</div>
              <div className="text-sm font-bold text-[#FED7B8] mt-1">{project.client || 'Confidential'}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-[#B89B8D] tracking-widest">Year</div>
              <div className="text-sm font-bold text-[#FFF5ED] mt-1">{project.year}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-[#B89B8D] tracking-widest">Category</div>
              <div className="text-sm font-bold text-[#FED7B8] mt-1">{project.category}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-[#B89B8D] tracking-widest">Studio Direction</div>
              <div className="text-sm font-bold text-[#FFF5ED] mt-1">NatureStudios</div>
            </div>
          </div>

          {/* 2. Overview & 3. Challenge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-[#FED7B8]">
                01 // CHALLENGE
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">The Arena Mandate</h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base sm:text-lg text-[#E8C5A5] leading-relaxed font-light">
                {project.challenge ||
                  'The core challenge was translating the fierce intensity of esports competition into an organic, living stadium visual architecture that captivates both in-person arena audiences and millions of simultaneous online viewers.'}
              </p>
            </div>
          </div>

          {/* 4. Strategy & 5. Creative Direction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#3D0D13] pt-16">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-[#FED7B8]">
                02 // STRATEGY & DIRECTION
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Creative Synthesis</h2>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="text-base text-[#E8C5A5] leading-relaxed">
                {project.strategy ||
                  'We deployed an adaptive visual system built with deep burgundy shadows and warm beige radiation lines, evoking both the digital wild and the discipline of championship play.'}
              </p>
              {project.creativeDirection && (
                <div className="p-6 rounded-xl bg-[#240709] border-l-4 border-[#FED7B8] text-sm text-[#FFF5ED]">
                  <span className="text-xs font-mono text-[#FED7B8] uppercase block mb-1">Creative Direction:</span>
                  {project.creativeDirection}
                </div>
              )}
            </div>
          </div>

          {/* 6. Visual Gallery */}
          <div className="space-y-6">
            <span className="text-xs font-mono tracking-widest uppercase text-[#FED7B8] block">
              03 // GALLERY & ASSETS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden border border-[#52141A] bg-[#1C0507]">
                <Image
                  src={project.image}
                  alt={`${project.title} Detail 1`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-[16/10] relative rounded-2xl overflow-hidden border border-[#52141A] bg-[#1C0507]">
                <Image
                  src="/media/hero-lightfield.jpg"
                  alt={`${project.title} Detail 2`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* 7. Results & Outcome */}
          <div className="p-10 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#FED7B8] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#18A957]" /> 04 // RESULTS & VERIFICATION
            </span>
            <h3 className="text-2xl font-bold uppercase text-[#FFF5ED]">Tournament Delivery Impact</h3>
            <p className="text-sm sm:text-base text-[#E8C5A5] leading-relaxed">
              {project.results ||
                'Delivered complete broadcast telemetry, responsive stage graphics, and arena overlays on schedule with flawless transmission performance.'}
            </p>
            <div className="text-[11px] font-mono text-[#7A6158]">
              Verified Studio Case Study (NatureStudios Creative Archive)
            </div>
          </div>

          {/* 8. Related Work */}
          {related.length > 0 && (
            <div className="space-y-8 pt-8 border-t border-[#3D0D13]">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase text-[#FFF5ED]">Related Productions</h3>
                <Link href="/work" className="text-xs font-mono uppercase text-[#FED7B8] hover:underline">
                  View All Projects →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/work/${rel.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-[#52141A] bg-[#1C0507] hover:border-[#FED7B8] transition-all p-6"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#150304]">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-xs font-mono text-[#FED7B8] uppercase">{rel.category}</div>
                    <h4 className="text-xl font-bold uppercase text-[#FFF5ED] mt-1 group-hover:text-[#FED7B8] transition-colors">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 9. Final CTA */}
          <div className="p-12 rounded-3xl bg-gradient-to-r from-[#240709] via-[#3A0E11] to-[#240709] border border-[#52141A] text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-gradient-warm">
              Ready to Command The Arena?
            </h2>
            <p className="text-sm sm:text-base text-[#E8C5A5] max-w-lg mx-auto font-light">
              Collaborate directly with NatureStudios directors to produce your next tournament broadcast, arena visual identity, or bespoke digital platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/contact" className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy">
                <span>Start A Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolio" className="btn-beige text-xs py-3 px-6 shadow-glow-beige">
                <span>Build Your Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
