'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  Save,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
];

const fieldClass =
  'w-full rounded-lg border border-rim bg-deep px-3.5 py-2.5 text-xs text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200';

const labelClass =
  'block text-label font-mono uppercase tracking-[0.2em] text-cream-muted mb-1.5';

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, refreshUser } = useAuth();
  const { notify } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [customUrl, setCustomUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  // Re-sync when the modal reopens with fresher user data.
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setAvatarPreview(user?.avatarUrl || null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, user?.name, user?.avatarUrl]);

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  // Release any blob URL we created for the local file preview.
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

  const setPreviewFromFile = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewFromFile(file);
    setError(null);
  };

  const handleSelectPreset = (url: string) => {
    setSelectedFile(null);
    setAvatarPreview(url);
    setError(null);
  };

  const handleApplyCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      setError('Image URL must start with http:// or https://');
      return;
    }
    setSelectedFile(null);
    setAvatarPreview(trimmed);
    setCustomUrl('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let finalAvatarUrl = avatarPreview;

      // 1. Upload the selected file first, if there is one.
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const uploadRes = await fetch('/api/user/profile', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || 'Failed to upload profile picture.');
          setLoading(false);
          return;
        }

        finalAvatarUrl = uploadData.avatarUrl;
      }

      // 2. Persist name + avatar.
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatarUrl: finalAvatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save changes.');
        setLoading(false);
        return;
      }

      await refreshUser();
      setSuccess(true);
      notify('Profile updated', {
        variant: 'success',
        detail: 'Your name and avatar are live across every project channel.',
      });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch {
      setError('Unable to save changes. Please try again.');
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
          aria-labelledby="edit-profile-title"
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
            <div className="orb-ember pointer-events-none absolute -top-20 -left-20 h-56 w-56" aria-hidden="true" />

            {/* Header */}
            <div className="relative mb-5 flex items-start justify-between gap-4 border-b border-rim pb-4">
              <div>
                <span className="section-label">Account</span>
                <h3
                  id="edit-profile-title"
                  className="mt-1.5 text-lg font-black uppercase tracking-tight leading-none"
                >
                  Edit Profile
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

            {/* Alerts */}
            {error && (
              <div
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-lg border border-live-bright/40 bg-live/15 p-3 text-xs text-red-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-4 flex items-center gap-2 rounded-lg border border-forest/40 bg-forest/10 p-3 text-xs text-forest-bright"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <p>Profile updated.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-5 rounded-xl border border-rim bg-deep/60 p-4">
                <div className="group relative shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-forest/50 bg-midnight">
                    {avatarPreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-9 w-9 text-cream-muted" aria-hidden="true" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload a new profile picture"
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-void/75 font-mono text-label-sm uppercase tracking-[0.16em] text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                  >
                    <Camera className="mb-0.5 h-4 w-4 text-forest-light" aria-hidden="true" />
                    <span>Change</span>
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <span className="block text-xs font-bold text-cream">Profile Picture</span>
                  <p className="text-xs leading-relaxed text-cream-muted">
                    Upload from your device, paste a link, or pick a studio avatar. Max 5MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rim bg-surface-card px-3 py-1.5 font-mono text-label-sm uppercase tracking-[0.16em] text-cream hover:border-edge hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                    >
                      <Upload className="h-3 w-3 text-forest-light" aria-hidden="true" />
                      <span>Upload</span>
                    </button>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setAvatarPreview(null);
                        }}
                        className="font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted underline underline-offset-2 hover:text-live-bright transition-colors duration-200 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div>
                <span className={labelClass}>Studio Avatars</span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((preset, idx) => {
                    const active = avatarPreview === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        aria-pressed={active}
                        aria-label={`Use studio avatar ${idx + 1}`}
                        className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 transition-transform duration-200 hover:scale-105 cursor-pointer ${
                          active
                            ? 'scale-105 border-forest ring-2 ring-forest/40'
                            : 'border-rim opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preset} alt="" className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL */}
              <div>
                <label htmlFor="ep-url" className={labelClass}>
                  Or Paste an Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="ep-url"
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="shrink-0 rounded-lg border border-rim bg-surface-card px-3.5 py-2.5 font-mono text-label-sm uppercase tracking-[0.16em] text-cream hover:border-forest/60 hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="ep-name" className={labelClass}>
                  Display Name
                </label>
                <input
                  id="ep-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or organisation"
                  className={fieldClass}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="ep-email" className={`${labelClass} mb-0`}>
                    Account Email
                  </label>
                  <span className="inline-flex items-center gap-1 font-mono text-label-sm uppercase tracking-[0.16em] text-forest-light">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Verified
                  </span>
                </div>
                <input
                  id="ep-email"
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || ''}
                  className="w-full cursor-not-allowed rounded-lg border border-rim/50 bg-deep/50 px-3.5 py-2.5 text-xs text-cream-muted"
                />
                <p className="mt-1.5 text-xs text-cream-muted">
                  Email addresses cannot be changed here — contact the studio to update it.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-rim px-4 py-2.5 font-mono text-label uppercase tracking-[0.2em] text-cream-muted hover:border-edge hover:text-cream transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" aria-hidden="true" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
