'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max degrees tilt (default 6deg)
  glareOpacity?: number; // max glare opacity (default 0.15)
  perspective?: number; // default 1000px
}

/**
 * High-performance 3D perspective card tilt with dynamic mouse-tracking lighting.
 * Preserves the exact internal layout & colors of the card while elevating
 * it into a physical glass element in 3D space.
 */
export function Tilt3DCard({
  children,
  className = '',
  maxTilt = 6,
  glareOpacity = 0.15,
  perspective = 1000,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const reduced = useReducedMotion();

  // Smooth springs for rotation and scale
  const rotateX = useSpring(0, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 20 });
  const scale = useSpring(1, { stiffness: 220, damping: 20 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)');
    setEnabled(fine.matches && !reduced);

    const onChange = () => setEnabled(fine.matches && !reduced);
    fine.addEventListener('change', onChange);
    return () => fine.removeEventListener('change', onChange);
  }, [reduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX; // -1 to 1
    const normY = (y - centerY) / centerY; // -1 to 1

    // Tilt opposite: moving mouse up tilts card toward user
    rotateX.set(-normY * maxTilt);
    rotateY.set(normX * maxTilt);
    scale.set(1.015);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className={`relative will-change-transform ${className}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full w-full"
      >
        {children}

        {/* Dynamic Electric Blue / Cyan Spotlight Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.18), rgba(37, 99, 235, 0.08) 40%, transparent 80%)`,
          }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
