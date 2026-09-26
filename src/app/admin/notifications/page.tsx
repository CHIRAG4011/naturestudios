'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Bell, Send, CheckCircle2, User, Users, Shield, RefreshCw } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'ALL' | 'ROLE' | 'INDIVIDUAL'>('ALL');
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          target,
          recipient: target !== 'ALL' ? recipient : undefined,
          channel: 'IN_APP',
        }),
      });

      if (!res.ok) throw new Error('Failed to dispatch notification');
      setTitle('');
      setMessage('');
      setToastMessage('Notification dispatched successfully.');
      fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Error sending notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#0B132B] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Notification Dispatch
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              In-App & Email
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Dispatch announcements, role alerts, or individual direct notifications to creators and team members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 text-xs">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#38BDF8] pb-2 border-b border-[#172554]">
            Dispatch New Notification
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="text-[#94A3B8] block mb-1">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
              >
                <option value="ALL">All Registered Users</option>
                <option value="ROLE">Role-Based Target</option>
                <option value="INDIVIDUAL">Specific User Email</option>
              </select>
            </div>

            {target === 'ROLE' && (
              <div>
                <label className="text-[#94A3B8] block mb-1">Target Role</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. ADMIN, MODERATOR"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
                />
              </div>
            )}

            {target === 'INDIVIDUAL' && (
              <div>
                <label className="text-[#94A3B8] block mb-1">User Email Address</label>
                <input
                  type="email"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
                />
              </div>
            )}

            <div>
              <label className="text-[#94A3B8] block mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title..."
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message body..."
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 font-semibold text-[#F8FAFC] flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{sending ? 'Dispatching...' : 'Dispatch Notification'}</span>
            </button>
          </form>
        </div>

        {/* Recent Dispatches */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#38BDF8] pb-2 border-b border-[#172554]">
            Recent Broadcasts
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#94A3B8]">
                No notifications dispatched yet.
              </div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#030712] border border-[#172554] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F8FAFC]">{n.title}</span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
