'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // 0 to 1, default ~0.25 (keeps within 5-10px)
  className?: string;
  as?: React.ElementType;
}

/**
 * Desktop-only subtle magnetic spring wrapper for CTA buttons & interactive pills.
 * Stays strictly within 5-10px maximum displacement for effortless clickability.
 * Disabled automatically on touch devices and prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = '',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  // Spring physics: smooth and snappy return
  const springX = useSpring(0, { stiffness: 180, damping: 15, mass: 0.1 });
  const springY = useSpring(0, { stiffness: 180, damping: 15, mass: 0.1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)');
    setEnabled(fine.matches && !reduced);

    const onChange = () => setEnabled(fine.matches && !reduced);
    fine.addEventListener('change', onChange);
    return () => fine.removeEventListener('change', onChange);
  }, [reduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    // Clamp within 8px maximum displacement
    const clampedX = Math.max(-8, Math.min(8, deltaX));
    const clampedY = Math.max(-8, Math.min(8, deltaY));

    springX.set(clampedX);
    springY.set(clampedY);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  if (!enabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
