'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const SESSION_DISMISS_KEY = 'ns_squeeze_dismissed_session';
const COOLDOWN_KEY = 'ns_squeeze_cooldown_until';
const REGISTERED_KEY = 'ns_user_registered';
const COOLDOWN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useSqueezeTrigger() {
  const { user, loading, isSqueezeOpen, openSqueeze, closeSqueeze } = useAuth();
  const triggerFiredRef = useRef(false);

  /**
   * Check whether the squeeze modal is suppressed by anti-annoyance rules.
   */
  const isSuppressed = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;

    // 1. Authenticated user: NEVER SHOW
    if (user !== null) return true;

    // 2. Previously registered/logged in account on this browser: NEVER SHOW
    if (localStorage.getItem(REGISTERED_KEY) === 'true') return true;

    // 3. Per-session suppression: user dismissed in this tab/session
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === 'true') return true;

    // 4. Cooldown period: check 24-hour timestamp
    const cooldownUntil = localStorage.getItem(COOLDOWN_KEY);
    if (cooldownUntil) {
      const timestamp = parseInt(cooldownUntil, 10);
      if (!isNaN(timestamp) && Date.now() < timestamp) {
        return true;
      }
    }

    return false;
  }, [user]);

  /**
   * Dismiss the squeeze experience with full anti-annoyance guarantees.
   */
  const dismiss = useCallback(() => {
    if (typeof window !== 'undefined') {
      // 1. Suppress for the remainder of this browsing session
      sessionStorage.setItem(SESSION_DISMISS_KEY, 'true');

      // 2. Set 24-hour cooldown timestamp in localStorage
      const cooldownTimestamp = Date.now() + COOLDOWN_DURATION_MS;
      localStorage.setItem(COOLDOWN_KEY, cooldownTimestamp.toString());
    }
    closeSqueeze();
  }, [closeSqueeze]);

  useEffect(() => {
    // If still checking session or user is logged in, do nothing
    if (loading || isSuppressed() || triggerFiredRef.current) return;

    let timer: NodeJS.Timeout | null = null;

    // A. RANDOM DELAY TRIGGER:
    // Generate a random delay between 20 seconds and 90 seconds
    const randomDelayMs = Math.floor(Math.random() * (90000 - 20000 + 1)) + 20000;

    // Run a 50% probability check for this session's time trigger
    const willFireTimer = Math.random() < 0.65;

    if (willFireTimer) {
      timer = setTimeout(() => {
        if (!triggerFiredRef.current && !isSuppressed() && !isSqueezeOpen) {
          triggerFiredRef.current = true;
          openSqueeze('register');
        }
      }, randomDelayMs);
    }

    // B. RANDOM SCROLL DEPTH TRIGGER:
    // Target threshold between 40% and 70% of the page
    const targetScrollRatio = 0.4 + Math.random() * 0.3; // 0.40 - 0.70
    let scrollTriggerChecked = false;

    const handleScroll = () => {
      if (triggerFiredRef.current || scrollTriggerChecked || isSuppressed() || isSqueezeOpen) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollHeight > 0) {
        const currentRatio = scrollTop / scrollHeight;
        if (currentRatio >= targetScrollRatio) {
          scrollTriggerChecked = true;
          // Random probability check (45% probability)
          if (Math.random() < 0.45) {
            triggerFiredRef.current = true;
            openSqueeze('register');
          }
        }
      }
    };

    // C. EXIT-INTENT TRIGGER (Desktop):
    // Detect when cursor moves rapidly towards the browser address bar
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggerFiredRef.current || isSuppressed() || isSqueezeOpen) return;
      if (e.clientY <= 8) {
        // 40% probability check so it doesn't fire aggressively
        if (Math.random() < 0.4) {
          triggerFiredRef.current = true;
          openSqueeze('register');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loading, isSuppressed, isSqueezeOpen, openSqueeze]);

  return {
    isSqueezeOpen,
    openSqueeze,
    dismiss,
    isSuppressed,
  };
}
