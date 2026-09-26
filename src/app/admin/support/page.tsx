'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Send,
  UserCheck,
  Search,
  X,
  Loader2,
  Filter,
  Eye,
} from 'lucide-react';

export default function AdminSupportPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'APPEAL' | 'GENERAL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Selected ticket modal
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [staffReply, setStaffReply] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryFilter !== 'ALL') query.set('category', categoryFilter);
      if (statusFilter !== 'ALL') query.set('status', statusFilter);
      if (search.trim()) query.set('search', search.trim());

      const res = await fetch(`/api/admin/support?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error('Failed to load support tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [categoryFilter, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update ticket status');
      setToastMessage(`Ticket marked as ${status}.`);
      fetchTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      alert(err.message || 'Error updating ticket');
    }
  };

  const handleSendStaffReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !staffReply.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          staffReply: staffReply.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to post reply');

      setToastMessage(`Reply dispatched to ${selectedTicket.email}.`);
      setStaffReply('');
      fetchTickets();

      // Refresh currently open ticket
      const refreshRes = await fetch(`/api/admin/support`);
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const updated = (data.tickets || []).find((t: any) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch staff reply');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!selectedTicket || !internalNote.trim()) return;

    try {
      const res = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          internalNote: internalNote.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to add internal note');
      setToastMessage('Internal staff note added.');
      setInternalNote('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    }
  };

  const handleApproveAppealAndUnsuspend = async () => {
    if (!selectedTicket) return;
    const confirm = window.confirm(
      `Are you sure you want to APPROVE this appeal and REINSTATE the user account for ${selectedTicket.email}?`
    );
    if (!confirm) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          action: 'approve_appeal_and_unsuspend',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve appeal');

      setToastMessage(`Appeal APPROVED: User ${selectedTicket.email} has been unsuspended and notified.`);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const appealsCount = tickets.filter((t) => t.category === 'APPEAL').length;

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
              Support & Moderation Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {tickets.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Resolve creator inquiries, review account suspension appeals, and dispatch direct staff replies.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Category & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-[#2563EB] text-[#F8FAFC]'
                : 'bg-[#070D1E] text-[#94A3B8] border border-[#172554]'
            }`}
          >
            All Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setCategoryFilter('APPEAL')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              categoryFilter === 'APPEAL'
                ? 'bg-red-900 text-white font-bold border border-red-500/50'
                : 'bg-[#070D1E] text-red-400 border border-red-900/40 hover:bg-red-950/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Suspension Appeals ({appealsCount})</span>
          </button>
          <button
            onClick={() => setCategoryFilter('GENERAL')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'GENERAL'
                ? 'bg-[#2563EB] text-[#F8FAFC]'
                : 'bg-[#070D1E] text-[#94A3B8] border border-[#172554]'
            }`}
          >
            General Inquiries
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="WAITING_CLIENT">WAITING CLIENT</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#94A3B8]">
            Loading support tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#94A3B8]">
            No outstanding tickets in this queue.
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-2xl bg-[#070D1E] border transition-all space-y-3 flex flex-col justify-between text-xs ${
                t.category === 'APPEAL'
                  ? 'border-red-900/60 hover:border-red-600/80 shadow-lg bg-gradient-to-b from-[#200508] to-[#070D1E]'
                  : 'border-[#172554] hover:border-[#2563EB]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#38BDF8]">
                      {t.ticketNumber}
                    </span>
                    {t.category === 'APPEAL' && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-red-950 text-red-300 border border-red-800/60 font-bold">
                        APPEAL
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300'
                        : t.status === 'WAITING_CLIENT'
                        ? 'bg-cyan-950 text-cyan-300'
                        : 'bg-[#030712] text-[#38BDF8]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#F8FAFC]">{t.name}</span>
                  <span className="text-[11px] text-[#94A3B8] font-mono ml-2">({t.email})</span>
                </div>

                <div className="font-semibold text-[#38BDF8] text-sm">{t.subject}</div>
                <p className="text-[#94A3B8] leading-relaxed line-clamp-2">{t.message}</p>

                {t.responses && t.responses.length > 0 && (
                  <div className="text-[10px] text-cyan-400 font-mono pt-1">
                    ↳ {t.responses.length} message(s) in conversation thread
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#172554] flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8]">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#721C22] text-[#38BDF8] font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View & Reply</span>
                  </button>

                  {t.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(t.id, 'RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 font-semibold text-white text-[10px] transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[92vh] bg-[#070D1E] border border-[#2563EB] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#172554] bg-[#030712] flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#38BDF8]">
                    {selectedTicket.ticketNumber}
                  </span>
                  {selectedTicket.category === 'APPEAL' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950 text-red-300 border border-red-800/60 font-bold">
                      Suspension Appeal
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-[#0B132B] text-[#38BDF8]">
                    {selectedTicket.status}
                  </span>
                </div>
                <h2 className="font-syne font-bold text-base text-[#F8FAFC] truncate">
                  {selectedTicket.subject}
                </h2>
                <div className="text-xs text-[#94A3B8] font-mono">
                  From: <span className="text-[#38BDF8]">{selectedTicket.name}</span> ({selectedTicket.email})
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Moderation Banner for Appeals */}
            {selectedTicket.category === 'APPEAL' && (
              <div className="p-4 bg-red-950/40 border-b border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-red-200">
                  <p className="font-bold">Appeal Action Center</p>
                  <p className="text-[11px] text-red-300/80">
                    If this appeal is valid, click Approve to automatically reinstate the user and notify them.
                  </p>
                </div>
                <button
                  onClick={handleApproveAppealAndUnsuspend}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shrink-0"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Approve Appeal & Unsuspend</span>
                </button>
              </div>
            )}

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Original User Message */}
              <div className="p-4 rounded-2xl bg-[#030712] border border-[#172554] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span className="font-bold text-[#38BDF8]">Creator Description</span>
                  <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-[#F8FAFC] leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Thread Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] px-1">
                    Conversation Thread
                  </div>
                  {selectedTicket.responses.map((r: any) => (
                    <div
                      key={r.id}
                      className={`p-4 rounded-2xl border leading-relaxed space-y-1.5 ${
                        r.sender === 'ADMIN'
                          ? 'bg-[#0B132B] border-[#2563EB] text-[#F8FAFC]'
                          : 'bg-[#030712] border-[#172554] text-[#38BDF8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-mono font-bold ${
                            r.sender === 'ADMIN' ? 'text-amber-300' : 'text-emerald-400'
                          }`}
                        >
                          {r.sender === 'ADMIN' ? `Staff (${r.senderName})` : r.senderName}
                        </span>
                        <span className="text-[#94A3B8] font-mono text-[10px]">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{r.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Staff Reply & Status Footer */}
            <div className="p-4 border-t border-[#172554] bg-[#030712] space-y-3">
              <form onSubmit={handleSendStaffReply} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type an official reply to the user (sent via email)..."
                  value={staffReply}
                  onChange={(e) => setStaffReply(e.target.value)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B132B] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={actionLoading || !staffReply.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#721C22] text-[#38BDF8] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-[#94A3B8]">Status Controls:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-[#38BDF8] border border-[#172554]"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, 'RESOLVED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, 'CLOSED')}
                    className="px-2.5 py-1 rounded-lg bg-[#030712] text-[#94A3B8] border border-[#172554]"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
