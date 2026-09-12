'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatTimeAgo } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardNotificationsPage() {
  const { refreshUser } = useAuth();
  const { notify } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // Non-fatal — the empty state covers it
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markOne = async (id: string) => {
    const snapshot = notifications;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      if (!res.ok) throw new Error('Request rejected');
      refreshUser();
    } catch {
      // Roll the optimistic update back rather than showing a state the
      // server never accepted.
      setNotifications(snapshot);
      notify('Could not mark as read', {
        variant: 'error',
        detail: 'The update did not reach the studio. Please try again.',
      });
    }
  };

  const markAll = async () => {
    const snapshot = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      if (!res.ok) throw new Error('Request rejected');
      refreshUser();
      notify('All notifications marked read', { variant: 'success' });
    } catch {
      setNotifications(snapshot);
      notify('Could not mark all as read', {
        variant: 'error',
        detail: 'The update did not reach the studio. Please try again.',
      });
    }
  };

  const unread = notifications.filter((n) => !n.read).length;
  const visible = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-label">Workspace</span>
          <h1 className="mt-1.5 text-display-sm font-black uppercase leading-none tracking-tight text-cream">
            Notifications
          </h1>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-dim">
            Studio updates about your projects, briefs, and account.
          </p>
        </div>

        {unread > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rim bg-surface-card/60 px-3 py-2 font-mono text-label-sm uppercase tracking-[0.16em] text-cream transition-colors duration-200 hover:border-forest/50 hover:text-forest-light cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mark all read</span>
          </button>
        )}
      </header>

      <div role="group" aria-label="Filter notifications" className="flex gap-1.5 border-b border-rim pb-4">
        {(['all', 'unread'] as const).map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              className={`relative rounded-lg px-3 py-1.5 font-mono text-label-sm uppercase tracking-[0.16em] transition-colors duration-200 cursor-pointer ${
                active ? 'text-midnight' : 'text-cream-muted hover:text-cream'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="notif-filter-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-forest"
                  transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                />
              )}
              <span className="relative">
                {key === 'all' ? `All (${notifications.length})` : `Unread (${unread})`}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-16">
          <Loader2 className="h-6 w-6 animate-spin text-forest-light" aria-hidden="true" />
        </div>
      ) : visible.length === 0 ? (
        <div className="space-y-2 rounded-xl border border-rim bg-surface-card/40 p-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-rim" aria-hidden="true" />
          <h2 className="text-sm font-bold text-cream">
            {filter === 'unread' ? 'Nothing unread' : 'No notifications yet'}
          </h2>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-cream-muted">
            Updates appear here as your projects move through the studio pipeline.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-rim overflow-hidden rounded-xl border border-rim bg-surface-card/60">
          {visible.map((n, i) => (
            <motion.li
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
              className={`flex items-start gap-3 p-4 ${n.read ? 'opacity-70' : 'border-l-2 border-ember bg-deep/40'}`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-cream">{n.title}</span>
                  <span className="shrink-0 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
                    {formatTimeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-cream-dim">{n.message}</p>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={() => markOne(n.id)}
                  className="shrink-0 rounded-lg p-1.5 text-cream-muted transition-colors duration-200 hover:bg-surface-hover hover:text-forest-light cursor-pointer"
                  aria-label={`Mark "${n.title}" as read`}
                >
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
