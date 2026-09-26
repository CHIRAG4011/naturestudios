'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Compass, PenTool, Layers, Hammer, Rocket } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Stage {
  index: string;
  key: string;
  title: string;
  lead: string;
  body: string;
  outputs: readonly string[];
  icon: React.ElementType;
  accent: 'forest' | 'ember';
}

const STAGES: readonly Stage[] = [
  {
    index: '01',
    key: 'discover',
    title: 'Discover',
    lead: 'Before anything is drawn, we listen.',
    body: 'Stakeholder interviews, competitive teardown, audience research, and a hard look at what the property already means to the people who follow it. We arrive at a shared definition of the problem rather than a brief full of adjectives.',
    outputs: ['Discovery workshop', 'Audience & format audit', 'Opportunity map'],
    icon: Compass,
    accent: 'forest',
  },
  {
    index: '02',
    key: 'define',
    title: 'Define',
    lead: 'A position sharp enough to design against.',
    body: 'We translate the research into a creative territory: the story the property tells, the emotional register it holds, and the measurable outcomes it needs to hit. Everything downstream is judged against this document.',
    outputs: ['Creative territory', 'Narrative platform', 'Success criteria'],
    icon: PenTool,
    accent: 'forest',
  },
  {
    index: '03',
    key: 'create',
    title: 'Create',
    lead: 'Design systems, not one-off artwork.',
    body: 'Art direction, typography, colour, motion language, and the rules that hold them together under live conditions. We prototype in-context early — on a broadcast frame, on an LED wall, on a phone — because that is where the work actually lives.',
    outputs: ['Design system', 'Motion language', 'In-context prototypes'],
    icon: Layers,
    accent: 'ember',
  },
  {
    index: '04',
    key: 'produce',
    title: 'Produce',
    lead: 'Where the render meets the arena.',
    body: 'Full production of the package: 3D worldbuilding, real-time engine scenes, broadcast graphics, stage fabrication drawings, and the technical handover files your crew will run on show day. Built to survive a live cut.',
    outputs: ['Broadcast package', 'Real-time scenes', 'Fabrication handover'],
    icon: Hammer,
    accent: 'ember',
  },
  {
    index: '05',
    key: 'launch',
    title: 'Launch',
    lead: 'On site, on air, and afterwards.',
    body: 'Rollout support through rehearsal and broadcast, on-the-night operator cover, then a structured handover so your internal team can run and extend the system long after we leave the building.',
    outputs: ['Rehearsal support', 'Live operator cover', 'System handover'],
    icon: Rocket,
    accent: 'forest',
  },
] as const;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  // The section is taller than the viewport; the inner panel pins while the
  // extra height is consumed, which is what turns scroll into stage progression.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(value * STAGES.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const glowX = useTransform(scrollYProgress, [0, 1], ['18%', '74%']);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.6, 0.35]);

  // ---------------------------------------------------------------- reduced
  // No pinning, no cross-fades — the same content as a plain readable stack.
  if (reduced) {
    return (
      <section id="process" className="section-padding section-gutter container-wide scroll-mt-24">
        <ProcessHeading />
        <ol className="mt-10 space-y-6">
          {STAGES.map((stage) => (
            <li
              key={stage.key}
              className="rounded-2xl border border-rim bg-surface-card/50 p-6"
            >
              <StageBody stage={stage} />
            </li>
          ))}
        </ol>
      </section>
    );
  }

  // ---------------------------------------------------------------- cinematic
  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative scroll-mt-24"
      // 290vh — the pin lasts exactly as long as the extra height, giving each
      // of the five stages roughly half a viewport of scroll to own.
      style={{ height: `${STAGES.length * 52 + 30}vh` }}
      aria-label="Our process"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Environment — one light source drifting across the whole sequence.
            The glow lives in a wrapper because `.orb-forest` runs its own
            `transform` keyframes, which would clobber any centring transform
            applied to the orb itself. */}
        <motion.div
          style={{ left: glowX, opacity: glowOpacity }}
          className="pointer-events-none absolute top-1/2 h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="orb-burgundy absolute inset-0" />
        </motion.div>
        <div className="hud-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="section-gutter container-wide relative w-full">
          <ProcessHeading />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-14">
            {/* -------------------------------------------------- stage rail */}
            <div className="lg:col-span-4">
              <div className="relative flex gap-5">
                {/* Track + fill */}
                <div className="relative w-px shrink-0 bg-[#172554]" aria-hidden="true">
                  <motion.div
                    style={{ scaleY: railScale }}
                    className="absolute inset-0 origin-top bg-gradient-to-b from-[#2563EB] via-[#38BDF8] to-[#1D4ED8] shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                  />
                </div>

                <ol className="flex-1 space-y-1">
                  {STAGES.map((stage, i) => {
                    const isActive = i === active;
                    const isPast = i < active;
                    return (
                      <li key={stage.key}>
                        <div
                          className="flex items-baseline gap-3 py-2 cursor-pointer transition-transform hover:translate-x-1"
                          onClick={() => setActive(i)}
                          aria-current={isActive ? 'step' : undefined}
                        >
                          <span
                            className={`font-mono text-label-sm tracking-[0.2em] transition-colors duration-500 ${
                              isActive
                                ? 'text-[#38BDF8] font-bold'
                                : isPast
                                  ? 'text-[#F8FAFC]'
                                  : 'text-[#94A3B8]/45'
                            }`}
                          >
                            {stage.index}
                          </span>
                          <span
                            className={`text-sm font-black uppercase tracking-[0.08em] transition-colors duration-500 ${
                              isActive
                                ? 'text-[#F8FAFC]'
                                : isPast
                                  ? 'text-[#BAE6FD]'
                                  : 'text-[#94A3B8]/50'
                            }`}
                          >
                            {stage.title}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* ------------------------------------------------ stage detail */}
            <div className="relative min-h-[340px] lg:col-span-8 lg:min-h-[380px]">
              {STAGES.map((stage, i) => (
                <motion.div
                  key={stage.key}
                  aria-hidden={i !== active}
                  initial={false}
                  animate={
                    i === active
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: 28, filter: 'blur(6px)' }
                  }
                  transition={{ duration: 0.55, ease: EASE }}
                  className={`absolute inset-0 ${i === active ? '' : 'pointer-events-none'}`}
                >
                  <StageBody stage={stage} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function ProcessHeading() {
  return (
    <div className="space-y-3">
      <span className="section-label">How We Work</span>
      <h2 className="max-w-2xl text-display-sm font-black uppercase leading-[0.95] tracking-tight text-[#F8FAFC] sm:text-display-md">
        Five stages from
        <span className="text-gradient-warm"> question</span> to
        <span className="text-gradient-burgundy"> broadcast</span>
      </h2>
    </div>
  );
}

function StageBody({ stage }: { stage: Stage }) {
  const Icon = stage.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E3A8A] bg-[#0F1D38] text-[#38BDF8]"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <span className="font-mono text-label-sm uppercase tracking-[0.22em] text-[#94A3B8]">
            Stage {stage.index}
          </span>
          <h3 className="text-lg font-black uppercase leading-none tracking-tight text-[#F8FAFC]">
            {stage.title}
          </h3>
        </div>
      </div>

      <p
        className="max-w-xl text-base font-semibold leading-snug sm:text-lg text-[#38BDF8]"
      >
        {stage.lead}
      </p>

      <p className="max-w-2xl text-sm leading-relaxed text-[#BAE6FD] font-light">{stage.body}</p>

      <ul className="flex flex-wrap gap-2 pt-1">
        {stage.outputs.map((output) => (
          <li
            key={output}
            className="rounded-full border border-[#1E3A8A] bg-[#0B132B] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#38BDF8]"
          >
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}
