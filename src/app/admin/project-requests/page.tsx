'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Mail,
  RefreshCw,
  Eye,
} from 'lucide-react';

const STATUSES = ['RECEIVED', 'REVIEWING', 'IN_DISCUSSION', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'];

export default function AdminProjectRequestsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `/api/admin/project-requests?status=${selectedStatus}`
        : '/api/admin/project-requests';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load project requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!isSuperAdmin && !hasPermission('requests.change_status')) {
      alert('You lack requests.change_status authority.');
      return;
    }

    try {
      const res = await fetch('/api/admin/project-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      setToastMessage(`Request status updated to ${newStatus}.`);
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
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
              Project Inquiries & Bookings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Pipeline ({requests.length})
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Incoming competitive esports broadcast, motion branding, and tournament packaging inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] focus:outline-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={fetchRequests}
            className="p-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading project requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No incoming client requests found for this filter.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/project-requests/${req.id}`}
                    className="font-semibold text-xs text-[#FFF5ED] hover:text-[#FED7B8] transition-colors"
                  >
                    {req.clientName || 'Private Client'}
                  </Link>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                      req.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : req.status === 'IN_PRODUCTION'
                        ? 'bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20'
                        : 'bg-[#150304] text-[#FED7B8]'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#B89B8D] font-mono">{req.clientEmail}</div>
                <Link
                  href={`/admin/project-requests/${req.id}`}
                  className="block text-xs font-semibold text-[#FED7B8] hover:underline"
                >
                  {req.projectType || 'Broadcast Package'}
                </Link>
                <p className="text-xs text-[#B89B8D] line-clamp-3 leading-relaxed">
                  {req.message || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3D0D13] space-y-2 text-xs">
                <div className="flex justify-between text-[11px] text-[#B89B8D]">
                  <span>Budget</span>
                  <span className="text-[#FFF5ED] font-mono">{req.budget || 'Custom'}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#B89B8D]">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/project-requests/${req.id}`}
                      className="px-2 py-1 rounded-lg bg-[#59171B]/50 hover:bg-[#59171B] border border-[#FED7B8]/20 hover:border-[#FED7B8]/40 text-[10px] font-mono text-[#FED7B8] inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </Link>

                    {(isSuperAdmin || hasPermission('requests.change_status')) && (
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-[#150304] border border-[#3D0D13] text-[10px] font-mono text-[#FED7B8] focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
