'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Shield, Compass, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSqueezeTrigger } from '@/hooks/useSqueezeTrigger';
import { AuthForms } from './AuthForms';

export function AuthSqueezeModal() {
  const { isSqueezeOpen, squeezeView, setSqueezeView } = useAuth();
  const { dismiss } = useSqueezeTrigger();

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isSqueezeOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      modalRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
      previouslyFocusedElement.current?.focus();
    };
  }, [isSqueezeOpen, dismiss]);

  return (
    <AnimatePresence>
      {isSqueezeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="squeeze-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-[#52141A] bg-[#240709] shadow-2xl flex flex-col md:flex-row max-h-[92vh] text-[#FFF5ED]"
          >
            {/* LEFT — cinematic environment panel */}
            <div className="relative md:w-5/12 bg-[#1C0507] flex flex-col justify-between p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#3D0D13] overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity pointer-events-none">
                <Image
                  src="/media/hero-lightfield.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0507] via-[#1C0507]/80 to-transparent" />
              </div>

              {/* Burgundy & Warm Beige Ambient Orbs */}
              <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-radial from-[#59171B]/60 to-transparent blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-radial from-[#FED7B8]/20 to-transparent blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#FED7B8] px-2.5 py-1 rounded bg-[#2D0A0E] border border-[#52141A] inline-block">
                  CLIENT &amp; CREATOR PORTAL
                </span>

                <h2
                  id="squeeze-title"
                  className="text-3xl sm:text-4xl font-black tracking-tight text-[#FFF5ED] uppercase leading-[0.92]"
                >
                  Enter the Digital Wild
                </h2>

                <p className="text-xs sm:text-sm text-[#E8C5A5] leading-relaxed font-light">
                  Create an account to follow active production projects, build your custom portfolio subdomain, and message the studio directly.
                </p>
              </div>

              <div className="relative z-10 pt-6 space-y-2.5 hidden sm:block text-xs text-[#B89B8D]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#59171B] text-[#FED7B8] shrink-0">
                    <Shield className="h-3 w-3" />
                  </span>
                  <span>Personalized subdomain portfolio builder</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#3A0E11] text-[#FED7B8] shrink-0">
                    <Compass className="h-3 w-3" />
                  </span>
                  <span>Direct studio messaging pipeline</span>
                </div>
              </div>
            </div>

            {/* RIGHT — form panel */}
            <div className="relative md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#240709]">
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-20 rounded-full p-2 text-[#B89B8D] bg-[#150304] hover:bg-[#3A0E11] hover:text-[#FFF5ED] transition-colors cursor-pointer border border-[#3D0D13]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 border-b border-[#3D0D13] pb-4 mb-6 pr-10">
                <button
                  type="button"
                  onClick={() => setSqueezeView('register')}
                  aria-pressed={squeezeView === 'register'}
                  className={`text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    squeezeView === 'register'
                      ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/50 shadow-glow-burgundy'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={() => setSqueezeView('login')}
                  aria-pressed={squeezeView === 'login'}
                  className={`text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    squeezeView === 'login'
                      ? 'bg-[#59171B] text-[#FED7B8] font-bold border border-[#FED7B8]/50 shadow-glow-burgundy'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  Login
                </button>
              </div>

              <div className="flex-1 flex items-center">
                <AuthForms
                  initialView={squeezeView}
                  onSwitchView={(v) => {
                    if (v === 'login' || v === 'register') setSqueezeView(v);
                  }}
                  onSuccess={dismiss}
                  redirectOnSuccess
                />
              </div>

              <div className="pt-4 mt-4 border-t border-[#3D0D13] flex items-center justify-between gap-3 text-[11px] font-mono text-[#B89B8D]">
                <button
                  type="button"
                  onClick={dismiss}
                  className="hover:text-[#FED7B8] transition-colors flex items-center gap-1 group cursor-pointer uppercase tracking-widest"
                >
                  <span>Continue Exploring</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={dismiss}
                  className="hover:text-[#FED7B8] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Dismiss for 24h
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
