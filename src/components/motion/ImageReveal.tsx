'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Cinematic Masked Image Reveal.
 * Opens an elegant clip-path mask from bottom to top as the image enters the viewport,
 * simultaneously easing the inner image from scale 1.08 to 1.00.
 */
export function ImageReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.95,
}: ImageRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative h-full w-full"
      >
        <motion.div
          initial={{ scale: 1.08, opacity: 0.8 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: duration + 0.2,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative h-full w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
