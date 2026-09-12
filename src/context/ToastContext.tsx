'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  detail?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  /** Show a toast. Returns its id so callers can dismiss it early. */
  notify: (title: string, options?: { detail?: string; variant?: ToastVariant; duration?: number }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

const ICON_TONE: Record<ToastVariant, string> = {
  success: 'text-forest-bright',
  error: 'text-red-400',
  warning: 'text-ember-light',
  info: 'text-steel',
};

const DEFAULT_DURATION = 4800;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback<ToastContextValue['notify']>(
    (title, options) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast: Toast = {
        id,
        title,
        detail: options?.detail,
        variant: options?.variant ?? 'info',
      };

      // Cap the stack so a burst of events can never cover the viewport.
      setToasts((prev) => [...prev.slice(-3), toast]);

      const duration = options?.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => {
            timers.current.delete(id);
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, duration)
        );
      }

      return id;
    },
    []
  );

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[9500] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col items-end gap-2.5 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className={`toast pointer-events-auto w-full ${toast.variant}`}
              role={toast.variant === 'error' ? 'alert' : 'status'}
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${ICON_TONE[toast.variant]}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-snug text-cream">{toast.title}</p>
                {toast.detail && (
                  <p className="mt-1 text-xs leading-relaxed text-cream-muted">{toast.detail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 shrink-0 rounded p-1 text-cream-muted transition-colors duration-200 hover:text-cream cursor-pointer"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
