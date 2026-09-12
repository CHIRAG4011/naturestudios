'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthFormsProps {
  initialView?: 'login' | 'register' | 'verify' | 'forgot';
  onSuccess?: () => void;
  onSwitchView?: (view: 'login' | 'register' | 'verify' | 'forgot') => void;
  redirectOnSuccess?: boolean;
}

/* Shared field styling — token-driven, no scattered hex */
const inputClass =
  'w-full rounded-lg border border-rim bg-deep pl-10 pr-3.5 py-2.5 text-sm text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200';

const labelClass =
  'block text-label font-mono uppercase tracking-[0.2em] text-cream-muted mb-1.5';

const iconClass =
  'absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-muted pointer-events-none';

function GoogleGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.2 8.9 5 12 5z" />
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.6 2.8c2.1-2 3.8-4.9 3.8-8.8z" />
      <path fill="#FBBC05" d="M5.5 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L1.9 7.1C.7 9.5 0 12.2 0 15s.7 5.5 1.9 7.9l3.6-2.8c-.2-.7-.4-1.4-.4-2z" />
      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.6-2.8c-1.1.7-2.5 1.2-4.4 1.2-3.1 0-5.6-2.2-6.5-5.1L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z" />
    </svg>
  );
}

export function AuthForms({
  initialView = 'register',
  onSuccess,
  onSwitchView,
  redirectOnSuccess = true,
}: AuthFormsProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [view, setView] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialView);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP state
  const [userId, setUserId] = useState<string>('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI status
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const switchView = (newView: 'login' | 'register' | 'verify' | 'forgot') => {
    setError(null);
    setSuccessMessage(null);
    setView(newView);
    if (onSwitchView) onSwitchView(newView);
  };

  const triggerErrorShake = (msg: string) => {
    setError(msg);
    setShakeKey((k) => k + 1);
  };

  // Google OAuth — server-side route handles state + secret
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError(null);
    window.location.href = '/api/auth/google';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.requiresVerification) {
        setUserId(data.userId);
        if (data.devOtp) setDevOtpCode(data.devOtp);
        setSuccessMessage(data.message);
        switchView('verify');
        setLoading(false);
        return;
      }

      await refreshUser();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      if (onSuccess) onSuccess();
      if (redirectOnSuccess) router.push('/dashboard');
    } catch {
      triggerErrorShake('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      triggerErrorShake('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      triggerErrorShake('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setUserId(data.userId);
      if (data.devOtp) setDevOtpCode(data.devOtp);
      setSuccessMessage('Account created. Verify your email with the 6-digit code.');
      setResendCooldown(60);
      switchView('verify');
    } catch {
      triggerErrorShake('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...otpValues];
    newValues[index] = val.slice(-1);
    setOtpValues(newValues);
    if (val && index < 5) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) otpInputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOtpValues(pasteData.split(''));
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      triggerErrorShake('Please enter all 6 digits of your verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Verification failed');
        setLoading(false);
        return;
      }

      await refreshUser();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      setSuccessMessage('Email verified. Welcome to NatureStudios.');

      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (redirectOnSuccess) router.push('/dashboard');
      }, 1000);
    } catch {
      triggerErrorShake('Unable to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Failed to resend code');
      } else {
        setResendCooldown(60);
        if (data.devOtp) setDevOtpCode(data.devOtp);
        setSuccessMessage('A fresh verification code has been dispatched.');
      }
    } catch {
      triggerErrorShake('Failed to resend code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      // Server returns a neutral message — never reveals whether the email exists
      setSuccessMessage(data.message);
    } catch {
      triggerErrorShake('Unable to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-cream">
      {/* Error banner — icon + text, never colour alone */}
      <AnimatePresence>
        {error && (
          <motion.div
            key={shakeKey}
            role="alert"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mb-4 flex items-center gap-2.5 rounded-lg border border-live-bright/40 bg-live/15 px-3.5 py-2.5 text-xs text-red-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
            <p className="flex-1 leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center gap-2.5 rounded-lg border border-forest/40 bg-forest/10 px-3.5 py-2.5 text-xs text-forest-bright"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="flex-1 leading-relaxed">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev-only OTP helper — surfaced by the API in non-production */}
      {devOtpCode && view === 'verify' && (
        <div className="mb-4 p-2.5 rounded-lg bg-ember/10 border border-ember/40 text-xs text-ember-bright flex items-center justify-between gap-3">
          <span className="font-mono">
            Demo code: <strong>{devOtpCode}</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setOtpValues(devOtpCode.split(''));
              otpInputsRef.current[5]?.focus();
            }}
            className="text-label-sm uppercase font-mono px-2 py-1 rounded bg-ember text-cream font-bold hover:bg-ember-light transition-colors duration-200 cursor-pointer shrink-0"
          >
            Auto-Fill
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ─────────────── REGISTER ─────────────── */}
        {view === 'register' && (
          <motion.form
            key="register-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleRegister}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="reg-name" className={labelClass}>
                Full Name / Organization
              </label>
              <div className="relative">
                <UserIcon className={iconClass} aria-hidden="true" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={iconClass} aria-hidden="true" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className={labelClass}>
                Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className={iconClass} aria-hidden="true" />
                <input
                  id="reg-password"
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
              <label htmlFor="reg-confirm" className={labelClass}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={iconClass} aria-hidden="true" />
                <input
                  id="reg-confirm"
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
              disabled={loading || googleLoading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-rim" />
              </div>
              <div className="relative flex justify-center text-label font-mono">
                <span className="bg-surface-card px-3 text-cream-muted">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full rounded-lg border border-rim bg-deep/60 hover:bg-surface-hover/40 hover:border-edge py-2.5 px-4 text-xs font-semibold text-cream flex items-center justify-center gap-2.5 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-forest-light" aria-hidden="true" />
              ) : (
                <GoogleGlyph />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-cream-dim">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchView('login')}
                className="font-bold text-ember-light hover:text-ember-bright underline underline-offset-4 cursor-pointer transition-colors duration-150"
              >
                Log In
              </button>
            </div>
          </motion.form>
        )}

        {/* ─────────────── LOGIN ─────────────── */}
        {view === 'login' && (
          <motion.form
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleLogin}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="login-email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={iconClass} aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className={labelClass + ' mb-0'}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchView('forgot')}
                  className="text-xs text-ember-light hover:text-ember-bright underline underline-offset-2 cursor-pointer transition-colors duration-150"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className={iconClass} aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Logging In…</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-rim" />
              </div>
              <div className="relative flex justify-center text-label font-mono">
                <span className="bg-surface-card px-3 text-cream-muted">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full rounded-lg border border-rim bg-deep/60 hover:bg-surface-hover/40 hover:border-edge py-2.5 px-4 text-xs font-semibold text-cream flex items-center justify-center gap-2.5 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-forest-light" aria-hidden="true" />
              ) : (
                <GoogleGlyph />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-cream-dim">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchView('register')}
                className="font-bold text-forest-light hover:text-forest-bright underline underline-offset-4 cursor-pointer transition-colors duration-150"
              >
                Create Account
              </button>
            </div>
          </motion.form>
        )}

        {/* ─────────────── VERIFY OTP ─────────────── */}
        {view === 'verify' && (
          <motion.form
            key="verify-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleVerifyOtp}
            className="space-y-5"
            noValidate
          >
            <div className="text-center space-y-1.5">
              <span className="section-label justify-center">Verification</span>
              <h3 className="text-display-sm font-black uppercase tracking-tight text-cream">
                Verify Your Account
              </h3>
              <p className="text-xs text-cream-dim">
                Enter the 6-digit code sent to{' '}
                <span className="font-mono text-cream font-semibold">{email || 'your email'}</span>
              </p>
            </div>

            <fieldset className="flex items-center justify-between gap-2 max-w-xs mx-auto my-6">
              <legend className="sr-only">6-digit verification code</legend>
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${idx + 1} of 6`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="h-12 w-10 text-center text-xl font-bold font-mono rounded-lg border border-rim bg-deep text-cream focus:border-forest focus:ring-2 focus:ring-forest/30 focus:outline-none transition-colors duration-200"
                />
              ))}
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Verifying Code…</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Enter</span>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-cream-dim">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className="hover:text-forest-light transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>

              <button
                type="button"
                onClick={() => switchView('login')}
                className="text-cream-muted hover:text-cream transition-colors duration-150 cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </motion.form>
        )}

        {/* ─────────────── FORGOT PASSWORD ─────────────── */}
        {view === 'forgot' && (
          <motion.form
            key="forgot-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleForgotPassword}
            className="space-y-4"
            noValidate
          >
            <div className="text-center space-y-1.5 mb-2">
              <h3 className="text-display-sm font-black uppercase tracking-tight text-cream">
                Reset Password
              </h3>
              <p className="text-xs text-cream-dim">
                Enter your account email to receive a single-use recovery link.
              </p>
            </div>

            <div>
              <label htmlFor="forgot-email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={iconClass} aria-hidden="true" />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-ember w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Sending Link…</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="text-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => switchView('login')}
                className="text-cream-muted hover:text-cream underline underline-offset-2 cursor-pointer transition-colors duration-150"
              >
                Back to Login
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
