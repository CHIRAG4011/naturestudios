'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';

const inputClass =
  'w-full rounded-lg border border-rim bg-deep pl-10 pr-3.5 py-2.5 text-sm text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200';

const labelClass =
  'block text-label font-mono uppercase tracking-[0.2em] text-cream-muted mb-1.5';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing or invalid reset token. Please request a new link.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Unable to reset password. Please check your connection.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        className="text-center py-6 space-y-3"
      >
        <CheckCircle2 className="h-12 w-12 text-forest-bright mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold uppercase tracking-tight text-cream">
          Password Reset Complete
        </h3>
        <p className="text-xs text-cream-dim">
          Your password has been updated. Redirecting to login…
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-live-bright/40 bg-live/15 p-3 text-xs text-red-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="new-password" className={labelClass}>
            New Password (min. 8 characters)
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-new-password" className={labelClass}>
            Confirm New Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="confirm-new-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Updating Password…</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Set New Password"
      subtitle="Choose a secure password for your NatureStudios account."
      accent="forest"
      backHref="/login"
      backLabel="Back to Login"
    >
      <Suspense
        fallback={
          <p className="text-xs text-cream-muted text-center py-8 font-mono uppercase tracking-[0.2em]">
            Loading…
          </p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
