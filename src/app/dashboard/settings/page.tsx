'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UserCog,
  ShieldCheck,
  Bell,
  TriangleAlert,
  KeyRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Camera,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { formatDate } from '@/lib/utils';

const fieldClass =
  'w-full rounded-lg border border-rim bg-deep px-3.5 py-2.5 text-xs text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200';

function Section({
  icon: Icon,
  eyebrow,
  title,
  description,
  danger,
  children,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border p-5 sm:p-6 ${
        danger ? 'border-live-bright/40 bg-live/5' : 'border-rim bg-surface-card/60'
      }`}
    >
      <div className="mb-5 flex items-start gap-3 border-b border-rim pb-4">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            danger ? 'bg-live/20 text-red-300' : 'bg-deep text-forest-light'
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <span className="section-label">{eyebrow}</span>
          <h2 className="mt-1 text-sm font-black uppercase tracking-[0.1em] text-cream">{title}</h2>
          <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-cream-muted">{description}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export default function DashboardSettingsPage() {
  const { user, logout } = useAuth();
  const { openEditProfile } = useDashboard();
  const router = useRouter();

  const [resetState, setResetState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Server-confirmed: OAuth-only accounts have no password to re-enter, so they
  // confirm deletion by typing their exact email instead.
  const isOAuthOnly = user?.hasPassword === false;

  const sendResetLink = async () => {
    if (!user?.email) return;
    setResetState('sending');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
    } catch {
      // The endpoint always responds neutrally; surface the same message either way
    } finally {
      setResetState('sent');
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (confirmPhrase.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Type DELETE to confirm.');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword, confirmEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Unable to delete the account.');
        setDeleting(false);
        return;
      }

      await logout();
      router.replace('/');
    } catch {
      setDeleteError('Something went wrong. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <span className="section-label">Workspace</span>
        <h1 className="mt-1.5 text-display-sm font-black uppercase leading-none tracking-tight text-cream">
          Settings
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-dim">
          Manage your profile, account security, and notification behaviour.
        </p>
      </header>

      {/* ---------------------------------------------------------- */}
      <Section
        icon={UserCog}
        eyebrow="Profile"
        title="Your Details"
        description="Your display name and avatar are what the studio team sees on every project channel."
      >
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
              Display Name
            </dt>
            <dd className="mt-1 text-xs font-bold text-cream">{user?.name || '—'}</dd>
          </div>
          <div>
            <dt className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
              Email
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-xs text-cream">
              <span className="truncate">{user?.email}</span>
              {user?.emailVerified && (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-light" aria-hidden="true" />
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
              Member Since
            </dt>
            <dd className="mt-1 text-xs text-cream-dim">
              {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
              Sign-in Methods
            </dt>
            <dd className="mt-1 text-xs text-cream-dim">
              {user?.providers?.length ? user.providers.join(', ') : 'Email & password'}
            </dd>
          </div>
        </dl>

        <button type="button" onClick={openEditProfile} className="btn-secondary mt-5 px-4 py-2.5">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Edit Profile</span>
        </button>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section
        icon={ShieldCheck}
        eyebrow="Security"
        title="Account Security"
        description="Passwords are hashed with bcrypt and never stored in plain text. Sessions use HTTP-only cookies."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rim bg-deep/60 p-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-forest-light" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-cream">Change your password</p>
                <p className="mt-0.5 text-xs text-cream-muted">
                  We email a single-use link that expires in one hour.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={sendResetLink}
              disabled={resetState !== 'idle'}
              className="btn-secondary shrink-0 px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resetState === 'sending' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Sending…</span>
                </>
              ) : resetState === 'sent' ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest-light" aria-hidden="true" />
                  <span>Link Sent</span>
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </div>

          {resetState === 'sent' && (
            <p role="status" className="text-xs text-cream-dim">
              If an account exists for {user?.email}, a reset link is on its way. Check your spam
              folder if it does not arrive within a few minutes.
            </p>
          )}

          <div className="rounded-xl border border-rim bg-deep/60 p-4">
            <p className="text-xs font-bold text-cream">Active session</p>
            <p className="mt-0.5 text-xs text-cream-muted">
              You are signed in on this device. Logging out ends the session immediately and clears
              the session cookie.
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 rounded-lg border border-rim px-3.5 py-2 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-dim transition-colors duration-200 hover:border-edge hover:text-cream cursor-pointer"
            >
              Log out of this device
            </button>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section
        icon={Bell}
        eyebrow="Notifications"
        title="What You'll Hear About"
        description="These are the events that currently generate a notification on your account."
      >
        <ul className="divide-y divide-rim overflow-hidden rounded-xl border border-rim">
          {[
            ['Project registered', 'A new brief you submit is logged in the studio pipeline.'],
            ['Inquiry received', 'A contact-form request is matched to your account.'],
            ['Profile updated', 'Your display name or avatar changes.'],
            ['Channel activity', 'The studio team replies in one of your project channels.'],
          ].map(([label, detail]) => (
            <li key={label} className="flex items-start gap-3 bg-deep/40 p-3.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-bright" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-cream">{label}</p>
                <p className="mt-0.5 text-xs text-cream-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-cream-muted">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-light" aria-hidden="true" />
          <span>
            Per-event toggles are not available yet — all account notifications are currently
            delivered in-app. Email delivery is used only for verification and password resets.
          </span>
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section
        icon={TriangleAlert}
        eyebrow="Danger Zone"
        title="Delete Account"
        description="This permanently removes your account, projects, messages, and notifications. It cannot be undone."
        danger
      >
        {!deleteOpen ? (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg border border-live-bright/50 bg-live/10 px-4 py-2.5 font-mono text-label uppercase tracking-[0.18em] text-red-200 transition-colors duration-200 hover:bg-live/20 cursor-pointer"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={handleDelete} className="max-w-md space-y-4">
            {deleteError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-live-bright/40 bg-live/15 p-3 text-xs text-red-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                <p>{deleteError}</p>
              </div>
            )}

            {isOAuthOnly ? (
              <div>
                <label
                  htmlFor="confirm-email"
                  className="mb-1.5 block font-mono text-label uppercase tracking-[0.2em] text-cream-muted"
                >
                  Type your account email
                </label>
                <input
                  id="confirm-email"
                  type="email"
                  autoComplete="off"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={user?.email || ''}
                  className={fieldClass}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="delete-password"
                  className="mb-1.5 block font-mono text-label uppercase tracking-[0.2em] text-cream-muted"
                >
                  Confirm your password
                </label>
                <input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldClass}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="confirm-phrase"
                className="mb-1.5 block font-mono text-label uppercase tracking-[0.2em] text-cream-muted"
              >
                Type DELETE to confirm
              </label>
              <input
                id="confirm-phrase"
                type="text"
                autoComplete="off"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                placeholder="DELETE"
                className={fieldClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteError(null);
                  setDeletePassword('');
                  setConfirmEmail('');
                  setConfirmPhrase('');
                }}
                className="rounded-lg border border-rim px-4 py-2.5 font-mono text-label uppercase tracking-[0.18em] text-cream-muted transition-colors duration-200 hover:text-cream cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-live-bright px-5 py-2.5 font-mono text-label font-bold uppercase tracking-[0.18em] text-cream transition-colors duration-200 hover:bg-live disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                <span>{deleting ? 'Deleting…' : 'Permanently Delete'}</span>
              </button>
            </div>
          </form>
        )}
      </Section>
    </div>
  );
}
