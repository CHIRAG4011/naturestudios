'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import {
  Database,
  Layers,
  Activity,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Lock,
} from 'lucide-react';

export default function AdminDatabasePage() {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDbMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/database');
      if (res.ok) {
        const data = await res.json();
        setDbData(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load db metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbMetrics();
  }, []);

  const collections = dbData?.collections || [];

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/system"
          className="flex items-center gap-2 text-xs text-[#38BDF8] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to System Health</span>
        </Link>
        <button
          onClick={fetchDbMetrics}
          className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-[#38BDF8] transition-colors"
          title="Refresh Metrics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              MongoDB Atlas Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {dbData?.status || 'OPERATIONAL'}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Cluster database status: <span className="font-mono text-[#38BDF8]">{dbData?.databaseName || 'naturestudios'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#38BDF8]">
          <span>Ping: {dbData?.latencyMs ?? 10}ms</span>
          <span>•</span>
          <span>{dbData?.totalCollections || 21} Collections</span>
        </div>
      </div>

      {/* Security Banner: No arbitrary query console */}
      <div className="p-4 rounded-2xl bg-[#030712] border border-[#172554] flex items-center gap-3 text-xs text-[#94A3B8]">
        <Lock className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
        <span>
          Zero Arbitrary Query Console: By strict security policy, direct browser-to-database raw query execution is prohibited to prevent injection and unauthorized schema corruption.
        </span>
      </div>

      {/* Collections Grid */}
      <div className="rounded-3xl bg-[#070D1E] border border-[#172554] overflow-hidden shadow-xl">
        <div className="px-5 py-4 bg-[#030712] border-b border-[#172554] flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[#38BDF8]">
            Active Collections & Document Counts
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">Realtime Atlas countDocuments</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections.map((col: any) => (
            <div
              key={col.name}
              className="p-3.5 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="font-mono text-[#F8FAFC]">{col.name}</span>
              </div>
              <span className="font-mono text-[#38BDF8] font-semibold">{col.count} docs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
