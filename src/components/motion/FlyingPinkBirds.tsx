'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BirdConfig {
  id: string;
  size: number;
  duration: number;
  delay: number;
  flapSpeed: number;
  initialY: number;
  targetY: number;
  scale: number;
  opacity: number;
  glowBlur: number;
}

const BIRDS: BirdConfig[] = [
  {
    id: 'bird-alpha',
    size: 52,
    duration: 20,
    delay: 0,
    flapSpeed: 0.55,
    initialY: 62,
    targetY: 18,
    scale: 1,
    opacity: 0.9,
    glowBlur: 14,
  },
  {
    id: 'bird-beta',
    size: 38,
    duration: 24,
    delay: 8,
    flapSpeed: 0.45,
    initialY: 76,
    targetY: 30,
    scale: 0.8,
    opacity: 0.75,
    glowBlur: 10,
  },
  {
    id: 'bird-gamma',
    size: 26,
    duration: 28,
    delay: 15,
    flapSpeed: 0.38,
    initialY: 42,
    targetY: 10,
    scale: 0.55,
    opacity: 0.55,
    glowBlur: 8,
  },
];

/**
 * Animated Flying Bird Component
 * Renders ethereal origami-style birds soaring across the background with
 * rhythmic flapping wings, warm beige & burgundy gradient plumage, and glowing stardust trails.
 */
export function FlyingPinkBirds({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduced) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-[5] ${className}`}
      aria-hidden="true"
    >
      {BIRDS.map((bird) => (
        <SingleFlyingBird key={bird.id} config={bird} />
      ))}
    </div>
  );
}

// Alias for semantic clarity
export const FlyingBirds = FlyingPinkBirds;

function SingleFlyingBird({ config }: { config: BirdConfig }) {
  const { size, duration, delay, flapSpeed, initialY, targetY, opacity, glowBlur } = config;

  return (
    <motion.div
      className="absolute top-0 left-0"
      initial={{
        x: '-12vw',
        y: `${initialY}vh`,
        rotate: -12,
        opacity: 0,
      }}
      animate={{
        x: ['-10vw', '25vw', '55vw', '85vw', '112vw'],
        y: [
          `${initialY}vh`,
          `${initialY - 14}vh`,
          `${(initialY + targetY) / 2 + 6}vh`,
          `${targetY - 5}vh`,
          `${targetY - 18}vh`,
        ],
        rotate: [-14, -8, 6, -12, -6],
        opacity: [0, opacity, opacity, opacity * 0.9, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: size,
        height: size,
        transformOrigin: 'center center',
      }}
    >
      {/* Luminous Warm Stardust Trail */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-16 h-2 bg-gradient-to-r from-transparent via-[#FED7B8]/40 to-transparent blur-sm rounded-full pointer-events-none" />

      {/* SVG Bird with Flapping Wings */}
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 ${glowBlur}px rgba(254, 215, 184, 0.75)) drop-shadow(0 0 ${glowBlur / 2}px rgba(89, 23, 27, 0.9))`,
        }}
      >
        <defs>
          {/* Main Warm Beige to Classic Burgundy Gradient */}
          <linearGradient id={`bird-grad-${config.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5ED" />
            <stop offset="35%" stopColor="#FED7B8" />
            <stop offset="75%" stopColor="#DDA27A" />
            <stop offset="100%" stopColor="#59171B" />
          </linearGradient>

          {/* Wing Specular Highlight */}
          <linearGradient id={`wing-specular-${config.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF5ED" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FED7B8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#59171B" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Glow behind bird */}
        <circle cx="50" cy="40" r="22" fill="rgba(254, 215, 184, 0.2)" filter="blur(6px)" />

        {/* Distant / Back Wing */}
        <motion.path
          fill={`url(#bird-grad-${config.id})`}
          opacity="0.8"
          stroke="#FED7B8"
          strokeWidth="0.75"
          strokeLinejoin="round"
          animate={{
            d: [
              // Wing Up
              'M 42 36 L 56 4 L 38 18 L 42 36 Z',
              // Wing Glide / Neutral
              'M 42 36 L 68 28 L 44 32 L 42 36 Z',
              // Wing Down
              'M 42 36 L 58 54 L 40 44 L 42 36 Z',
              // Wing Glide
              'M 42 36 L 68 28 L 44 32 L 42 36 Z',
              // Wing Up
              'M 42 36 L 56 4 L 38 18 L 42 36 Z',
            ],
          }}
          transition={{
            duration: flapSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Bird Body & Swallow Tail */}
        <g>
          {/* Main Body */}
          <path
            d="M 72 37 C 68 33 55 35 44 36 C 36 37 26 39 12 44 L 18 40 L 8 36 C 24 34 38 33 50 34 C 62 34 70 36 72 37 Z"
            fill={`url(#bird-grad-${config.id})`}
            stroke="#FED7B8"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Aerodynamic Sleek Head & Beak */}
          <polygon
            points="72,36 82,37 72,39"
            fill="#FFF5ED"
            stroke="#FED7B8"
            strokeWidth="0.5"
          />

          {/* Sleek Swallow Twin Tail Feathers */}
          <polygon
            points="14,43 0,48 10,40"
            fill={`url(#bird-grad-${config.id})`}
            stroke="#FED7B8"
            strokeWidth="0.6"
          />
          <polygon
            points="14,37 2,30 11,38"
            fill="#59171B"
            stroke="#FED7B8"
            strokeWidth="0.6"
          />
        </g>

        {/* Foreground / Near Wing (Primary Wing Motion) */}
        <motion.path
          fill={`url(#bird-grad-${config.id})`}
          stroke="#FFF5ED"
          strokeWidth="1"
          strokeLinejoin="round"
          animate={{
            d: [
              // Wing Up - high elevation
              'M 46 36 L 64 2 L 42 22 L 46 36 Z',
              // Wing Mid - glide
              'M 46 36 L 76 26 L 48 34 L 46 36 Z',
              // Wing Down - deep thrust
              'M 46 36 L 66 68 L 44 48 L 46 36 Z',
              // Wing Mid - glide
              'M 46 36 L 76 26 L 48 34 L 46 36 Z',
              // Wing Up - high elevation
              'M 46 36 L 64 2 L 42 22 L 46 36 Z',
            ],
          }}
          transition={{
            duration: flapSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Wing Feather Specular Sheen (Animated with Wing) */}
        <motion.path
          fill={`url(#wing-specular-${config.id})`}
          animate={{
            d: [
              'M 47 35 L 61 7 L 46 22 Z',
              'M 47 35 L 72 27 L 50 33 Z',
              'M 47 35 L 62 62 L 46 45 Z',
              'M 47 35 L 72 27 L 50 33 Z',
              'M 47 35 L 61 7 L 46 22 Z',
            ],
            opacity: [1, 0.7, 0.4, 0.7, 1],
          }}
          transition={{
            duration: flapSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Bird Eye - Pure White Glimmer */}
        <circle cx="68" cy="36" r="1.2" fill="#FFF5ED" filter="drop-shadow(0 0 2px #FFF5ED)" />
      </svg>
    </motion.div>
  );
}
