'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, Loader2, AlertCircle, Layers } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const PROJECT_TYPES = [
  'Esports & Live Broadcast',
  'Brand & Visual Systems',
  'Cinematic Content Studio',
  'Interactive Web Platforms',
  'Stage & Environmental Design',
  'Creative Direction & Strategy',
];

const BUDGETS = [
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
];

const TIMELINES = ['2 - 4 Weeks', '4 - 8 Weeks', '8 - 12 Weeks', 'Ongoing Retainer'];

const fieldClass =
  'w-full rounded-lg border border-rim bg-deep px-3.5 py-2.5 text-xs text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200';

const labelClass =
  'block text-label font-mono uppercase tracking-[0.2em] text-cream-muted mb-1.5';

export function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const { notify } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Read inside the key handler without re-running (and re-focusing) the effect.
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loadingRef.current) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const focusTimer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    }, 80);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, projectType, budget, timeline }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to register the project brief.');
        setLoading(false);
        return;
      }

      onProjectCreated();
      onClose();
      setTitle('');
      setDescription('');
      // The modal closes on success, so the confirmation has to live outside it.
      notify('Brief registered', {
        variant: 'success',
        detail: `“${title.trim()}” is now in the studio pipeline.`,
      });
    } catch {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={loading ? undefined : onClose}
            className="fixed inset-0 bg-void/85 backdrop-blur-md"
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-rim bg-surface-card p-6 text-cream shadow-card-lg"
          >
            <div className="orb-forest pointer-events-none absolute -top-20 -right-20 h-56 w-56" aria-hidden="true" />

            <div className="relative mb-5 flex items-start justify-between gap-4 border-b border-rim pb-4">
              <div>
                <span className="section-label">New Brief</span>
                <h3
                  id="new-project-title"
                  className="mt-1.5 text-lg font-black uppercase tracking-tight leading-none"
                >
                  Start a Project
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 rounded-lg p-1.5 text-cream-muted hover:bg-surface-hover hover:text-cream transition-colors duration-200 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-lg border border-live-bright/40 bg-live/15 p-3 text-xs text-red-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative space-y-4">
              <div>
                <label htmlFor="np-title" className={labelClass}>
                  Project Title
                </label>
                <input
                  id="np-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Global Stage Broadcast Identity"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="np-type" className={labelClass}>
                  Discipline
                </label>
                <select
                  id="np-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className={fieldClass}
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="np-budget" className={labelClass}>
                    Budget Range
                  </label>
                  <select
                    id="np-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={fieldClass}
                  >
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="np-timeline" className={labelClass}>
                    Timeline
                  </label>
                  <select
                    id="np-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className={fieldClass}
                  >
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="np-description" className={labelClass}>
                  Creative Scope
                </label>
                <textarea
                  id="np-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectives, deliverables, brand context, event dates…"
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-rim bg-deep/60 p-3 text-xs text-cream-muted">
                <Layers className="h-3.5 w-3.5 shrink-0 text-ember-light" aria-hidden="true" />
                <p>
                  Briefs enter the pipeline at <span className="text-cream-dim">Received</span> and
                  are reviewed by a studio director.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Registering…</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Register Brief</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
