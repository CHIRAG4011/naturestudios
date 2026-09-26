'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import {
  Inbox,
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  RefreshCw,
  User,
  Mail,
  ExternalLink,
} from 'lucide-react';

const STATUSES = [
  'RECEIVED',
  'REVIEWING',
  'IN_DISCUSSION',
  'IN_PRODUCTION',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminProjectRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;
  const { hasPermission, isSuperAdmin } = useAdmin();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [status, setStatus] = useState('RECEIVED');
  const [budget, setBudget] = useState('');
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [message, setMessage] = useState('');

  const fetchRequest = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/project-requests/${requestId}`);
      if (!res.ok) throw new Error('Request not found or access restricted.');
      const data = await res.json();
      setRequest(data.request);

      setStatus(data.request.status || 'RECEIVED');
      setBudget(data.request.budget || '');
      setProjectType(data.request.projectType || '');
      setTimeline(data.request.timeline || '');
      setMessage(data.request.message || '');
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve project request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isSuperAdmin && !hasPermission('requests.change_status')) {
      alert('You lack requests.change_status authorization.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/project-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          budget,
          projectType,
          timeline,
          message,
        }),
      });

      if (!res.ok) throw new Error('Failed to update request.');
      setToast({ message: 'Client project request updated successfully.', type: 'success' });
      fetchRequest();
    } catch (err: any) {
      setToast({ message: err.message || 'Error updating request.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isSuperAdmin && !hasPermission('requests.delete')) {
      alert('You lack requests.delete authorization.');
      return;
    }

    if (!confirm('Are you sure you want to delete this project request?')) return;

    try {
      const res = await fetch(`/api/admin/project-requests/${requestId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete request.');
      alert('Request deleted.');
      router.push('/admin/project-requests');
    } catch (err: any) {
      alert(err.message || 'Error deleting request.');
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#38BDF8]" />
        <div className="text-xs font-mono text-[#94A3B8]">Loading client brief details...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="text-sm font-semibold text-[#E63946]">{error || 'Request not found.'}</div>
        <Link
          href="/admin/project-requests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] text-xs text-[#38BDF8] border border-[#172554]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xl ${
            toast.type === 'success'
              ? 'bg-[#030712] border border-emerald-500/50 text-emerald-400'
              : 'bg-[#030712] border border-[#E63946]/50 text-[#E63946]'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/project-requests"
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Project Requests</span>
          </Link>
          <span className="text-[#172554]">/</span>
          <span className="text-[#38BDF8] font-semibold truncate max-w-xs">{projectType || 'Client Inquiry'}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/40 text-xs font-semibold text-[#38BDF8] shadow-glow-burgundy transition-all hover:scale-105"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Request'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Specifications Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#38BDF8]" />
              <h1 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                Client Inquiry Details & Scope
              </h1>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#2563EB] text-[#38BDF8]">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Inquiry Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] font-mono text-xs focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Project Type / Service
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Proposed Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Estimated Timeline
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 2-4 Weeks"
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Client Message & Creative Request
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Client Card & Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 text-xs shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
              <User className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">
                Client Details
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] border border-[#38BDF8]/30 flex items-center justify-center font-bold text-sm text-[#38BDF8]">
                  {request.clientName ? request.clientName[0].toUpperCase() : (request.user?.name ? request.user.name[0].toUpperCase() : 'C')}
                </div>
                <div>
                  <div className="font-semibold text-[#F8FAFC]">
                    {request.clientName || request.user?.name || 'Inquiry Contact'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-mono">
                    {request.clientEmail || request.user?.email || 'N/A'}
                  </div>
                </div>
              </div>

              {request.user && (
                <div className="pt-2">
                  <Link
                    href={`/admin/users/${request.user.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline"
                  >
                    <span>View Client Account Profile →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-3 text-xs shadow-xl font-mono text-[11px]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#172554] font-sans">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">Metadata</h2>
            </div>
            <div className="flex justify-between py-1 border-b border-[#172554]/40">
              <span className="text-[#94A3B8]">Submitted</span>
              <span className="text-[#F8FAFC]">{new Date(request.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Request ID</span>
              <span className="text-[#38BDF8]">{requestId.slice(0, 10)}...</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#E63946]/30 space-y-3 text-xs shadow-xl">
            <div className="text-[#E63946] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone</span>
            </div>
            <p className="text-[#94A3B8] text-[11px]">Permanently remove this project inquiry.</p>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-1.5 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 border border-[#E63946]/30 text-[#E63946] font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
