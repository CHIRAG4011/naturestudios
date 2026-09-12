'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectData } from './ProjectCard';
import { Send, Loader2, MessageSquare, X } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface MessageItem {
  id: string;
  projectId: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface MessageThreadProps {
  project: ProjectData | null;
  currentUserId: string;
  onClose?: () => void;
}

export function MessageThread({ project, currentUserId, onClose }: MessageThreadProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const projectId = project?.id;

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?projectId=${encodeURIComponent(projectId)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // Non-fatal — the thread renders its empty state
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !inputMessage.trim() || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);
    setSendError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, message: messageText }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        setSendError('Message could not be delivered. Please try again.');
        setInputMessage(messageText);
      }
    } catch {
      setSendError('Connection lost. Your message was not sent.');
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  /* ---------------------------- Empty selection ---------------------------- */
  if (!project) {
    return (
      <div className="h-full min-h-[320px] flex flex-col items-center justify-center rounded-xl border border-rim bg-surface-card/40 p-8 text-center">
        <div className="relative mb-4">
          <div className="orb-forest absolute -inset-8 opacity-40" aria-hidden="true" />
          <MessageSquare className="relative h-10 w-10 text-rim" aria-hidden="true" />
        </div>
        <p className="text-sm font-bold text-cream tracking-tight">
          Select a project to open its channel
        </p>
        <p className="mt-1.5 text-xs text-cream-muted max-w-xs leading-relaxed">
          Every project carries its own direct line to the studio team.
        </p>
      </div>
    );
  }

  /* -------------------------------- Thread -------------------------------- */
  return (
    <div className="h-full flex flex-col overflow-hidden rounded-xl border border-rim bg-surface-card shadow-card-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-rim bg-deep/70 p-4">
        <div className="min-w-0">
          <span className="section-label">Direct Channel</span>
          <h4 className="mt-1 truncate text-sm font-bold tracking-tight text-cream">
            {project.title}
          </h4>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message channel"
            className="shrink-0 rounded-lg p-1.5 text-cream-muted hover:bg-surface-hover hover:text-cream transition-colors duration-200 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Message list */}
      <div
        className="flex-1 min-h-[280px] max-h-[460px] space-y-4 overflow-y-auto p-4"
        role="log"
        aria-label="Project messages"
        aria-live="polite"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-forest-light" aria-hidden="true" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <p className="text-xs text-cream-dim">No messages in this channel yet.</p>
            <p className="mt-1 text-xs text-cream-muted">
              Leave a note below and the studio team will pick it up.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isMe = m.senderId === currentUserId;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
                    <span>{isMe ? 'You' : m.sender?.name || 'NatureStudios Team'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatTimeAgo(m.createdAt)}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isMe
                        ? 'rounded-tr-sm bg-forest font-medium text-midnight'
                        : 'rounded-tl-sm border border-rim bg-deep text-cream'
                    }`}
                  >
                    {m.message}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {sendError && (
        <p role="alert" className="border-t border-live/30 bg-live/10 px-4 py-2 text-xs text-red-200">
          {sendError}
        </p>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t border-rim bg-deep/80 p-3"
      >
        <label htmlFor="channel-message" className="sr-only">
          Message the studio team
        </label>
        <input
          id="channel-message"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message the studio team…"
          autoComplete="off"
          className="flex-1 rounded-lg border border-rim bg-midnight px-3 py-2 text-xs text-cream placeholder:text-cream-muted/60 focus:border-forest/70 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={sending || !inputMessage.trim()}
          aria-label="Send message"
          className="rounded-lg bg-forest p-2.5 text-midnight transition-colors duration-200 hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  );
}
