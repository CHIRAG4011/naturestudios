'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { MessageSquare, RefreshCw, CheckCircle2, User } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Studio Inquiries & Messages
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              {messages.length} Conversations
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Client messages and community contact submissions sent to NatureStudios.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading studio messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No messages received yet.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#FFF5ED]">{m.senderName || 'Visitor'}</span>
                <span className="text-[10px] font-mono text-[#B89B8D]">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#FED7B8]">{m.senderEmail}</div>
              <p className="text-[#B89B8D] leading-relaxed">{m.content || m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
