'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Megaphone, Plus, Check, X, Trash2, AlertCircle } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT'>('INFO');
  const [audience, setAudience] = useState<'ALL' | 'CREATORS' | 'STAFF'>('ALL');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, audience, enabled: true }),
      });

      if (!res.ok) throw new Error('Failed to create announcement');
      setShowCreateModal(false);
      setTitle('');
      setMessage('');
      setToastMessage('Announcement broadcasted successfully.');
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Error creating announcement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#240709] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Global Announcements
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Audience Segmented
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Publish top-banner alerts, release notifications, and urgent broadcast updates.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('announcements.create')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#FED7B8]" />
            <span>Create Banner</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No active announcements.
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#FFF5ED]">{item.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    item.type === 'URGENT'
                      ? 'bg-[#E63946]/20 text-[#E63946]'
                      : item.type === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-[#B89B8D] leading-relaxed">{item.message}</p>
              <div className="pt-2 border-t border-[#3D0D13] flex items-center justify-between text-[11px] text-[#B89B8D] font-mono">
                <span>Audience: {item.audience}</span>
                <span>{item.enabled ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <h3 className="font-syne text-base font-bold text-[#FFF5ED]">
                Create Announcement Banner
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#B89B8D] hover:text-[#FFF5ED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-[#B89B8D] block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Platform Upgrade"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Announcement body displayed across pages..."
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#B89B8D] block mb-1">Banner Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  >
                    <option value="INFO">INFO</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="WARNING">WARNING</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#B89B8D] block mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  >
                    <option value="ALL">ALL (Public + Users)</option>
                    <option value="CREATORS">CREATORS ONLY</option>
                    <option value="STAFF">STAFF ONLY</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] text-[#FFF5ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#59171B] hover:bg-[#6E1C23] font-semibold text-[#FFF5ED]"
                >
                  {saving ? 'Publishing...' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
