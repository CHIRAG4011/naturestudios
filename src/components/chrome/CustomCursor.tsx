'use client';

import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], summary, label[for], [data-cursor="hover"]';

const PROJECT_SELECTOR = '[data-cursor="project"], [data-cursor="view"], .project-card, [data-project-reel]';
const DRAG_SELECTOR = '[data-cursor="drag"], [role="slider"], .drag-target, .carousel-drag';
const TEXT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

/**
 * Desktop-only custom cursor for NatureStudios.
 * Rebuilt in Burgundy + Warm Beige palette with contextual label badge (e.g. "VIEW PROJECT").
 * Automatically disabled on touch, mobile, and prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !reduced.matches);

    sync();
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('cursor-custom');

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let seen = false;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      place(ring, ringX, ringY);
      if (label) {
        label.style.transform = `translate3d(${ringX}px, ${ringY - 32}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;

      if (!seen) {
        seen = true;
        ringX = pointerX;
        ringY = pointerY;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      place(dot, pointerX, pointerY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== 'function') return;

      if (target.closest(TEXT_SELECTOR)) {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        if (label) label.style.opacity = '0';
        return;
      }

      dot.style.opacity = seen ? '1' : '0';
      ring.style.opacity = seen ? '1' : '0';

      const projectEl = target.closest(PROJECT_SELECTOR);
      if (projectEl) {
        ring.style.width = '68px';
        ring.style.height = '68px';
        ring.style.borderColor = '#38BDF8';
        ring.style.backgroundColor = 'rgba(37, 99, 235, 0.45)';
        dot.style.opacity = '0';
        setCursorText('VIEW');
        if (label) label.style.opacity = '1';
        return;
      }

      const dragEl = target.closest(DRAG_SELECTOR);
      if (dragEl) {
        ring.style.width = '64px';
        ring.style.height = '64px';
        ring.style.borderColor = '#38BDF8';
        ring.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
        dot.style.opacity = '0';
        setCursorText('DRAG');
        if (label) label.style.opacity = '1';
        return;
      }

      const hot = !!target.closest(INTERACTIVE_SELECTOR);
      if (hot) {
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = '#38BDF8';
        ring.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
        dot.style.width = '4px';
        dot.style.height = '4px';
        setCursorText('');
        if (label) label.style.opacity = '0';
      } else {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(56, 189, 248, 0.45)';
        ring.style.backgroundColor = 'transparent';
        dot.style.width = '8px';
        dot.style.height = '8px';
        setCursorText('');
        if (label) label.style.opacity = '0';
      }
    };

    const onDown = () => {
      ring.style.width = '28px';
      ring.style.height = '28px';
    };
    const onUp = () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      if (label) label.style.opacity = '0';
    };
    const onEnter = () => {
      if (!seen) return;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('cursor-custom');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      {cursorText && (
        <div ref={labelRef} className="cursor-label" style={{ opacity: 0 }} aria-hidden="true">
          {cursorText}
        </div>
      )}
    </>
  );
}
