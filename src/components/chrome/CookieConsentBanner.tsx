'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'naturestudios_cookie_consent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has previously made a consent choice
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Show after a brief delay so the initial page transition is smooth
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access might be blocked in strict private browsing
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent: 'all', timestamp: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent: 'essential', timestamp: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 p-5 rounded-2xl bg-[#1C0507]/95 border border-[#52141A] shadow-2xl backdrop-blur-xl text-[#FFF5ED]"
        >
          {/* Subtle burgundy ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-radial from-[#59171B]/60 to-transparent blur-2xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2D0A0E] border border-[#52141A] text-[#FED7B8]">
                  <Cookie className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFF5ED]">
                    Cookie &amp; Privacy Preferences
                  </h3>
                  <span className="text-[10px] font-mono text-[#FED7B8]/80">
                    Compliant with Google AdSense Policies
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEssentialOnly}
                aria-label="Close cookie consent banner"
                className="text-[#B89B8D] hover:text-[#FFF5ED] p-1 transition-colors rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#E8C5A5] leading-relaxed">
              We and our trusted partners (including <strong className="text-[#FFF5ED]">Google AdSense</strong>) use cookies to analyze audience engagement, personalize advertising content, and deliver seamless esports studio experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 border-t border-[#3D0D13]">
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <Link
                  href="/cookies"
                  className="text-[#FED7B8] underline hover:text-[#FFF5ED] transition-colors"
                >
                  Cookie Policy
                </Link>
                <span className="text-[#52141A]">&bull;</span>
                <Link
                  href="/privacy"
                  className="text-[#FED7B8] underline hover:text-[#FFF5ED] transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-[#52141A] bg-[#240709] hover:bg-[#2D0A0E] text-[11px] font-mono uppercase tracking-wider text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#7B1F25] hover:to-[#8E232B] border border-[#FED7B8]/40 text-[11px] font-mono font-bold uppercase tracking-wider text-[#FED7B8] shadow-glow-burgundy transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="h-3 w-3" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
