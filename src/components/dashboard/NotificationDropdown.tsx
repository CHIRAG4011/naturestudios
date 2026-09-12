'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const { unreadCount, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // Fail quietly — the bell simply shows an empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshUser();
    } catch {
      // Non-fatal — the list refreshes on next open
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-lg border border-rim bg-surface-card/60 hover:bg-surface-hover hover:border-edge text-cream-muted hover:text-cream transition-colors duration-200 cursor-pointer"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-ember text-[9px] font-bold text-cream font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-rim bg-surface-card shadow-card-lg z-50 overflow-hidden text-cream">
          <div className="p-3.5 border-b border-rim bg-deep/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-label font-mono font-bold uppercase tracking-[0.2em]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-label-sm px-2 py-0.5 rounded-full bg-ember/15 text-ember-light border border-ember/30 font-mono">
                  {unreadCount} new
                </span>
              )}
            </div>

            {notifications.some((n) => !n.read) && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-label-sm font-mono uppercase tracking-[0.18em] text-forest-light hover:text-forest-bright flex items-center gap-1 cursor-pointer transition-colors duration-150"
              >
                <CheckCheck className="h-3 w-3" aria-hidden="true" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-rim">
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-forest-light" aria-hidden="true" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-cream-dim">
                No notifications to display.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 text-xs transition-colors duration-150 ${
                    n.read ? 'opacity-70' : 'bg-deep/40 border-l-2 border-ember'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-bold text-cream">{n.title}</span>
                    <span className="text-label-sm font-mono text-cream-muted shrink-0">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-cream-dim leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
