'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

export default function AdminPortfolioReportsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/portfolio-reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string, status: 'RESOLVED' | 'DISMISSED') => {
    if (!isSuperAdmin && !hasPermission('portfolio_reports.resolve')) {
      alert('You lack portfolio_reports.resolve authority.');
      return;
    }

    try {
      const res = await fetch('/api/admin/portfolio-reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error('Action failed');
      setToastMessage(`Report status updated to ${status}.`);
      fetchReports();
    } catch (err: any) {
      alert(err.message || 'Error updating report');
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
              Portfolio Moderation & Abuse Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {reports.length} Reports
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Community reports regarding copyright infringement, abusive imagery, or malicious subdomains.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            Loading moderation reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            No outstanding abuse reports. All creator subdomains are in compliance.
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-xs text-[#38BDF8]">
                    @{r.portfolioSlug}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                      r.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-[#E63946]/10 text-[#E63946]'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#F8FAFC]">Reason: {r.reason}</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{r.details}</p>
              </div>

              <div className="pt-3 border-t border-[#172554] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#94A3B8]">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>

                {(isSuperAdmin || hasPermission('portfolio_reports.resolve')) && r.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(r.id, 'DISMISSED')}
                      className="px-2.5 py-1 rounded-lg bg-[#0B132B] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(r.id, 'RESOLVED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[11px] font-semibold text-white"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
