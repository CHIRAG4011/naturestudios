'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

/**
 * Cinematic Word-by-Word Text Reveal with Overflow-Hidden Masking.
 * Words slide smoothly upward from behind a clipping plane with ease-out-expo.
 * No layout shift, zero jitter, fully accessible.
 */
export function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as: Tag = 'h2',
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={`${className} inline-flex flex-wrap`}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden mr-[0.25em] last:mr-0 align-bottom"
          aria-hidden="true"
        >
          <motion.span
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
