'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { HelpCircle, RefreshCw, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function AdminSupportPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/support');
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
  }, []);

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
    } catch (err: any) {
      alert(err.message || 'Error updating ticket');
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
              Creator Support Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              {tickets.length} Inquiries
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Support tickets, portfolio troubleshooting, and internal notes for verified support staff.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="p-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading support tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No outstanding creator support requests.
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-3 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#FFF5ED]">{t.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] text-[#FED7B8]">
                    {t.status}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-[#B89B8D]">{t.email}</div>
                <div className="font-semibold text-[#FED7B8]">{t.subject}</div>
                <p className="text-[#B89B8D] leading-relaxed">{t.message}</p>
              </div>

              <div className="pt-3 border-t border-[#3D0D13] flex items-center justify-between text-[11px]">
                <span className="text-[#B89B8D]">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {t.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(t.id, 'RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white text-[10px]"
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
    </div>
  );
}
