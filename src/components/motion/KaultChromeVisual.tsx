'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

export function KaultChromeVisual() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Smooth spring mouse reaction
  const rotateX = useSpring(0, { stiffness: 45, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 45, damping: 18 });
  const scale = useSpring(1, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    rotateX.set(-y * 0.04);
    rotateY.set(x * 0.04);
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center select-none"
    >
      {/* Intense Glowing Core Behind Sculpture */}
      <div className="absolute inset-0 bg-radial from-[#2563EB]/40 via-[#1E40AF]/20 to-transparent blur-[80px] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-radial from-[#38BDF8]/30 to-transparent blur-[60px] -z-10 pointer-events-none" />

      {/* 3D Perspective Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformPerspective: 1000,
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Floating Ambient Motion */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Main 3D Chrome Sculpture Image */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden mix-blend-screen opacity-100 filter contrast-125 brightness-110">
            <Image
              src="/media/kault-chrome-sculpture.jpg"
              alt="Nature Studios 3D Metallic Sculpture"
              fill
              priority
              className="object-contain filter drop-shadow-[0_0_50px_rgba(56,189,248,0.5)]"
            />
          </div>

          {/* Overlay Dynamic Glowing Energy Rings / Ribbons */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
            viewBox="0 0 500 500"
            fill="none"
          >
            <motion.path
              d="M 100 250 C 150 120, 350 100, 400 250 C 450 400, 250 420, 150 350"
              stroke="url(#blue-cyan-gradient)"
              strokeWidth="2.5"
              strokeDasharray="12 8"
              animate={{
                strokeDashoffset: [0, -200],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.path
              d="M 120 180 C 220 80, 420 180, 380 320 C 340 440, 180 400, 140 280"
              stroke="url(#electric-glow-gradient)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              animate={{
                strokeDashoffset: [0, 160],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <defs>
              <linearGradient id="blue-cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="electric-glow-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
