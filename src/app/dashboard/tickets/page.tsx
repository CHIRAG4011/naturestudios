'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  X,
  Send,
  Loader2,
  ShieldAlert,
  ArrowLeft,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface TicketResponse {
  id: string;
  sender: 'USER' | 'ADMIN';
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: 'APPEAL' | 'ACCOUNT' | 'BILLING' | 'TECHNICAL' | 'GENERAL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'RESOLVED' | 'CLOSED';
  responses?: TicketResponse[];
  createdAt: string;
  updatedAt: string;
}

export default function DashboardTicketsPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const searchParams = useSearchParams();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPEAL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Create ticket modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [category, setCategory] = useState<'APPEAL' | 'ACCOUNT' | 'BILLING' | 'TECHNICAL' | 'GENERAL'>('GENERAL');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle ?type=appeal URL query to open appeal form immediately
  useEffect(() => {
    if (searchParams.get('type') === 'appeal') {
      setCategory('APPEAL');
      setPriority('HIGH');
      setSubject('Suspension Appeal: Reinstatement Request');
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      notify('Subject and message are required', { variant: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          category,
          priority,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      notify('Ticket submitted successfully', {
        variant: 'success',
        detail: `Ticket ${data.ticket?.ticketNumber || ''} has been assigned to operations.`,
      });

      setIsCreateOpen(false);
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err: any) {
      notify(err.message || 'Error submitting ticket', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      notify('Reply posted to ticket thread', { variant: 'success' });
      setReplyText('');

      // Refresh single ticket view & list
      const updatedRes = await fetch(`/api/tickets/${selectedTicket.id}`);
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setSelectedTicket(updatedData.ticket);
      }
      fetchTickets();
    } catch (err: any) {
      notify(err.message || 'Error sending reply', { variant: 'error' });
    } finally {
      setSendingReply(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'APPEAL' && t.category !== 'APPEAL') return false;
    if (activeTab === 'OPEN' && (t.status === 'RESOLVED' || t.status === 'CLOSED')) return false;
    if (activeTab === 'RESOLVED' && t.status !== 'RESOLVED' && t.status !== 'CLOSED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header plate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-rim bg-surface-card/70 backdrop-blur-md shadow-card">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-syne text-2xl font-black uppercase tracking-tight text-cream">
              Support & Appeal Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-forest/20 text-forest-light border border-forest/30">
              {tickets.length} Total Tickets
            </span>
          </div>
          <p className="text-xs text-cream-muted mt-1 max-w-xl">
            Direct communication channel with NatureStudios moderation, production support, and creative directors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.isSuspended && (
            <button
              onClick={() => {
                setCategory('APPEAL');
                setPriority('HIGH');
                setSubject(`Suspension Appeal: ${user.name || user.email}`);
                setIsCreateOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Submit Suspension Appeal</span>
            </button>
          )}

          <button
            onClick={() => {
              setCategory('GENERAL');
              setPriority('NORMAL');
              setSubject('');
              setIsCreateOpen(true);
            }}
            className="btn-primary px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Open Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'ALL'
                ? 'bg-surface-card text-cream border border-forest/50'
                : 'text-cream-muted hover:bg-surface-card/40'
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('APPEAL')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'APPEAL'
                ? 'bg-red-950/60 text-red-300 border border-red-500/50'
                : 'text-cream-muted hover:bg-surface-card/40'
            }`}
          >
            Appeals ({tickets.filter((t) => t.category === 'APPEAL').length})
          </button>
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'OPEN'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/50'
                : 'text-cream-muted hover:bg-surface-card/40'
            }`}
          >
            Open ({tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50'
                : 'text-cream-muted hover:bg-surface-card/40'
            }`}
          >
            Resolved ({tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cream-muted" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-deep border border-rim text-xs text-cream focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Ticket List */}
      <div className="rounded-3xl border border-rim bg-surface-card/50 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-cream-muted flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-forest" />
            <span>Loading support tickets...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 px-4 text-center text-xs text-cream-muted space-y-2">
            <LifeBuoy className="h-8 w-8 mx-auto text-cream-muted/50" />
            <p className="font-bold text-cream">No tickets found in this view.</p>
            <p className="text-[11px] text-cream-muted/80">
              Need assistance with an inquiry, brief revision, or account suspension appeal? Click Open Ticket above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-rim/60">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="p-4 sm:p-5 hover:bg-surface-hover/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-forest-light">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        t.category === 'APPEAL'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : 'bg-deep text-cream-dim border border-rim'
                      }`}
                    >
                      {t.category || 'GENERAL'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : t.status === 'WAITING_CLIENT'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                    {t.responses && t.responses.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-cream-muted font-mono bg-deep px-1.5 py-0.5 rounded border border-rim">
                        <MessageSquare className="h-3 w-3" />
                        {t.responses.length} {t.responses.length === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm text-cream group-hover:text-forest-light transition-colors truncate">
                    {t.subject}
                  </h3>
                  <p className="text-xs text-cream-muted line-clamp-1 leading-relaxed">
                    {t.message}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-cream-muted shrink-0">
                  <span className="font-mono text-[11px]">
                    {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                  </span>
                  <ChevronRight className="h-4 w-4 text-cream-muted group-hover:text-cream group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Thread Modal / Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] bg-surface-card border border-rim rounded-3xl flex flex-col shadow-card-lg overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-rim flex items-start justify-between gap-3 bg-midnight">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-forest-light">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      selectedTicket.category === 'APPEAL'
                        ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                        : 'bg-deep text-cream-dim border border-rim'
                    }`}
                  >
                    {selectedTicket.category || 'GENERAL'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      selectedTicket.status === 'RESOLVED'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="font-syne font-bold text-base text-cream truncate">
                  {selectedTicket.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-cream-muted hover:text-cream hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Original Post */}
              <div className="p-4 rounded-2xl bg-deep/80 border border-rim space-y-2">
                <div className="flex items-center justify-between text-[11px] text-cream-muted font-mono">
                  <span className="font-bold text-cream">{selectedTicket.name} (You)</span>
                  <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-cream leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Replies */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cream-muted px-1">
                    Activity & Staff Responses
                  </div>
                  {selectedTicket.responses.map((r) => (
                    <div
                      key={r.id}
                      className={`p-4 rounded-2xl border leading-relaxed space-y-1.5 ${
                        r.sender === 'ADMIN'
                          ? 'bg-[#3D0D13]/40 border-[#59171B] text-[#FFF5ED]'
                          : 'bg-deep border-rim text-cream'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-mono font-bold ${
                            r.sender === 'ADMIN' ? 'text-[#FED7B8]' : 'text-forest-light'
                          }`}
                        >
                          {r.sender === 'ADMIN' ? `Staff (${r.senderName})` : r.senderName}
                        </span>
                        <span className="text-cream-muted font-mono text-[10px]">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{r.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-rim bg-midnight flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to support staff..."
                disabled={sendingReply}
                className="flex-1 px-4 py-2.5 rounded-xl bg-deep border border-rim text-xs text-cream focus:outline-none focus:border-forest"
              />
              <button
                type="submit"
                disabled={sendingReply || !replyText.trim()}
                className="btn-primary px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                {sendingReply ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket / Appeal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-surface-card border border-rim rounded-3xl p-6 shadow-card-lg space-y-5">
            <div className="flex items-center justify-between border-b border-rim pb-4">
              <div>
                <span className="section-label">
                  {category === 'APPEAL' ? 'Moderation Review' : 'Client Care'}
                </span>
                <h3 className="font-syne text-lg font-bold text-cream mt-0.5">
                  {category === 'APPEAL' ? 'Submit Suspension Appeal' : 'Open Support Ticket'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-cream-muted hover:text-cream hover:bg-surface-hover transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {category === 'APPEAL' && (
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span>Account Suspension Appeal</span>
                </p>
                <p className="text-[11px] text-red-300/80 leading-relaxed">
                  Provide factual context regarding why the suspension should be reviewed or resolved. Moderation prioritizes suspension appeal tickets.
                </p>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cream-muted font-mono uppercase text-[10px] tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-deep border border-rim text-cream focus:outline-none focus:border-forest"
                  >
                    <option value="GENERAL">General Support</option>
                    <option value="APPEAL">Account Suspension Appeal</option>
                    <option value="TECHNICAL">Technical & Studio Help</option>
                    <option value="BILLING">Billing & Quotes</option>
                    <option value="ACCOUNT">Account Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cream-muted font-mono uppercase text-[10px] tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-deep border border-rim text-cream focus:outline-none focus:border-forest"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cream-muted font-mono uppercase text-[10px] tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary of your inquiry or appeal..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep border border-rim text-cream focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-cream-muted font-mono uppercase text-[10px] tracking-wider mb-1">
                  Message / Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, links, or context to help our staff resolve your ticket swiftly..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-deep border border-rim text-cream focus:outline-none focus:border-forest leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-deep hover:bg-surface-hover text-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{category === 'APPEAL' ? 'Submit Appeal' : 'Submit Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
