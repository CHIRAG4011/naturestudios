'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, Sparkles, User, Mail, MessageSquare, ShieldCheck, Instagram } from 'lucide-react';
import { DiscordIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useAuth } from '@/context/AuthContext';

interface ContactTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'STUDIO' | 'CREATOR';
  targetName: string;
  targetUserId?: string;
  targetUserEmail?: string;
  portfolioTitle?: string;
  portfolioSlug?: string;
}

export function ContactTicketModal({
  isOpen,
  onClose,
  targetType,
  targetName,
  targetUserId,
  targetUserEmail,
  portfolioTitle,
  portfolioSlug,
}: ContactTicketModalProps) {
  const { user } = useAuth();

  const [subject, setSubject] = useState(
    targetType === 'STUDIO'
      ? `Project Commission Inquiry: ${portfolioTitle || 'Studio Production'}`
      : `Creative Collaboration Inquiry: ${portfolioTitle || targetName}`
  );
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ ticketNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailToSend = user?.email || guestEmail.trim();
    if (!emailToSend || !emailToSend.includes('@')) {
      setErrorMsg('Please enter a valid email address so we can reach you.');
      return;
    }

    if (!subject.trim() || !message.trim()) {
      setErrorMsg('Please provide both a subject and a message.');
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
          name: user?.name || guestName.trim() || 'Visitor',
          email: emailToSend,
          targetType,
          targetUserId,
          targetUserEmail,
          portfolioTitle,
          portfolioSlug,
          category: targetType === 'STUDIO' ? 'COMMISSION' : 'PROJECT_INQUIRY',
          priority: 'NORMAL',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      setTicketResult({ ticketNumber: data.ticketNumber || 'NS-TCK-SENT' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTicketResult(null);
    setErrorMsg(null);
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#050B17] border border-[#1E3A8A] p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#0F1D38] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E3A8A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {ticketResult ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#18A957]/20 border border-[#18A957]/40 text-[#18A957]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase text-[#F8FAFC]">
                  Ticket Dispatched!
                </h3>
                <p className="text-xs font-mono text-[#38BDF8] mt-1">
                  Ticket Reference: <span className="font-bold underline">{ticketResult.ticketNumber}</span>
                </p>
              </div>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                {targetType === 'STUDIO'
                  ? 'Your inquiry has been directly logged into the Studio Production Ticket Queue. Our lead art directors will review your brief and reply promptly.'
                  : `Your inquiry has been sent directly to ${targetName}. They will receive your ticket in their Creator Dashboard and reply via email.`}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn-primary text-xs py-3 px-6 shadow-glow-burgundy"
                >
                  Done & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20 uppercase tracking-widest font-bold">
                    {targetType === 'STUDIO' ? 'STUDIO DIRECT TICKET' : 'CREATOR DIRECT TICKET'}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase text-[#F8FAFC] mt-2">
                  Contact {targetName}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {targetType === 'STUDIO'
                    ? 'Start a commission or inquiry with the NatureStudios core production team.'
                    : `Send a direct project inquiry or collaborate with verified creator ${targetName}.`}
                </p>

                {targetType === 'STUDIO' && (
                  <div className="mt-3 p-3 rounded-2xl bg-[#0B132B] border border-[#1E3A8A] flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
                    <span className="text-[11px] text-[#94A3B8]">Direct Channels:</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="mailto:naturestudio05@gmail.com"
                        className="text-[#38BDF8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
                        title="naturestudio05@gmail.com"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Email</span>
                      </a>
                      <span className="text-[#1E3A8A]">•</span>
                      <a
                        href="https://wa.me/917480066539"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors"
                        title="WhatsApp: +91 7480 066 539"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                      <span className="text-[#1E3A8A]">•</span>
                      <a
                        href="https://discord.gg/PTVReHZp4n"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-300 hover:text-white flex items-center gap-1.5 transition-colors"
                        title="Discord Server"
                      >
                        <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Discord</span>
                      </a>
                      <span className="text-[#1E3A8A]">•</span>
                      <a
                        href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-300 hover:text-white flex items-center gap-1.5 transition-colors"
                        title="Instagram @naturestudio.in"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Guest coordinates if not logged in */}
              {!user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0B132B] border border-[#172554]">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Alex Drake"
                      className="field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#94A3B8] mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="alex@team.gg"
                      className="field text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {user && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-[#172554] text-xs text-[#94A3B8]">
                  <ShieldCheck className="w-4 h-4 text-[#18A957]" />
                  <span>
                    Sending as <strong className="text-[#F8FAFC]">{user.name || user.email}</strong> ({user.email})
                  </span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#38BDF8] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="field text-xs font-mono"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#38BDF8] mb-1">
                  Detailed Message / Project Brief *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your timeline, deliverables needed (e.g. Tournament graphics, overlays, roster announcement), and budget..."
                  className="field text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  Tickets are protected & tracked in dashboard
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-glow-burgundy disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Create & Send Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
