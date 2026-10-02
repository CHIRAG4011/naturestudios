'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

export function StudioLogoVisual() {
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

    rotateX.set(-y * 0.035);
    rotateY.set(x * 0.035);
    scale.set(1.04);
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
      {/* Intense Glowing Core Behind Logo - Burgundy & Warm Beige */}
      <div className="absolute inset-0 bg-radial from-[#59171B]/55 via-[#3A0E11]/30 to-transparent blur-[90px] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-52 h-52 bg-radial from-[#FED7B8]/25 via-[#DDA27A]/15 to-transparent blur-[70px] -z-10 pointer-events-none" />

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
            rotate: [-1.5, 1.5, -1.5],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full h-full flex items-center justify-center p-8 sm:p-10"
        >
          {/* Main Studio Logo Emblem */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Nature Studios Brand Emblem"
              fill
              priority
              className="object-contain filter drop-shadow-[0_0_35px_rgba(254,215,184,0.45)] drop-shadow-[0_0_70px_rgba(89,23,27,0.7)]"
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
              stroke="url(#warm-beige-ribbon)"
              strokeWidth="2"
              strokeDasharray="12 8"
              animate={{
                strokeDashoffset: [0, -200],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.path
              d="M 120 180 C 220 80, 420 180, 380 320 C 340 440, 180 400, 140 280"
              stroke="url(#burgundy-ribbon)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              animate={{
                strokeDashoffset: [0, 160],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <defs>
              <linearGradient id="warm-beige-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#59171B" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFF5ED" stopOpacity="1" />
                <stop offset="100%" stopColor="#FED7B8" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="burgundy-ribbon" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3A0E11" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FED7B8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFF5ED" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Backward compatibility alias
export const KaultChromeVisual = StudioLogoVisual;
