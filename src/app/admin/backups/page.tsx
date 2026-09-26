'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Server,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Archive,
} from 'lucide-react';

export default function AdminBackupsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/backups');
      if (res.ok) {
        const json = await res.json();
        setData(json.backupSystem);
      }
    } catch (err) {
      console.error('Failed to load backup status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/system"
          className="flex items-center gap-2 text-xs text-[#38BDF8] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to System Health</span>
        </Link>
        <button
          onClick={fetchBackups}
          className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-[#38BDF8] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Cloud Backup & Point-In-Time Restore
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {data?.status || 'EXTERNAL_MANAGED'}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Production disaster recovery policies managed through MongoDB Atlas Cloud Console.
          </p>
        </div>

        <a
          href="https://cloud.mongodb.com"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-xs font-semibold text-[#38BDF8] flex items-center gap-2 transition-all shadow-md"
        >
          <span>Atlas Cloud Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Backup Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
            <Server className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Provider Architecture
            </h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#172554]/50">
              <span className="text-[#94A3B8]">Managed Provider</span>
              <span className="text-[#F8FAFC] font-mono">{data?.provider || 'MongoDB Atlas'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#172554]/50">
              <span className="text-[#94A3B8]">Backup Mode</span>
              <span className="text-[#38BDF8] font-mono">{data?.type || 'Continuous PITR'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#172554]/50">
              <span className="text-[#94A3B8]">Snapshot Retention</span>
              <span className="text-[#F8FAFC] font-mono">{data?.retentionPolicy || '7-day Continuous'}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Integrity & Operational Notice
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs">
            {data?.note ||
              'Continuous cloud backups are managed externally directly at the cluster storage layer in MongoDB Atlas with encrypted snapshots and zero impact on live write latency.'}
          </p>
          <div className="p-3 rounded-xl bg-[#030712] border border-[#172554] text-[11px] text-[#38BDF8]">
            Note: Database restores must be initiated securely through the Atlas Management Console or CLI with multi-factor break-glass authorization.
          </div>
        </div>
      </div>
    </div>
  );
}
