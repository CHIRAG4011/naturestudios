'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Layers,
  Inbox,
  Eye,
  Mail,
  AlertCircle,
  Download,
  RefreshCw,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d' | '12m'>('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const metrics = data?.metrics || {
    totalUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
    totalPortfolios: 0,
    publishedPortfolios: 0,
    draftPortfolios: 0,
    projectRequests: 0,
    openProjects: 0,
    totalMessages: 0,
    pageViews: 0,
    portfolioViews: 0,
    emailsSent: 0,
    emailsFailed: 0,
  };

  const chartSeries = data?.chartSeries || [];
  const hasData = data?.hasData ?? false;

  const exportAnalytics = () => {
    if (!isSuperAdmin && !hasPermission('analytics.export')) {
      alert('Export requires analytics.export permission.');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      Object.entries(metrics)
        .map(([k, v]) => `${k},${v}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `naturestudios-analytics-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Real-time Analytics Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              MongoDB Telemetry
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Audited aggregate metrics for creator registration, portfolio views, and inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter Buttons */}
          <div className="flex bg-[#030712] p-1 rounded-xl border border-[#172554]">
            {(['today', '7d', '30d', '90d', '12m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-lg uppercase tracking-wider transition-all ${
                  period === p
                    ? 'bg-[#2563EB] text-[#F8FAFC] shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {(isSuperAdmin || hasPermission('analytics.export')) && (
            <button
              onClick={exportAnalytics}
              className="px-3 py-1.5 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-xs font-medium text-[#38BDF8] flex items-center gap-1.5 transition-colors"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-medium">Unique Pageviews</span>
            <Eye className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.pageViews}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            {metrics.portfolioViews} on Portfolios
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-medium">New Registrations</span>
            <Users className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.totalUsers}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            {metrics.verifiedUsers} Email Verified
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-medium">Portfolios Published</span>
            <Layers className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#38BDF8] mt-2">
            {metrics.publishedPortfolios}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            {metrics.draftPortfolios} Currently In Draft
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-medium">Project Requests</span>
            <Inbox className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.projectRequests}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
            {metrics.openProjects} In Active Production
          </div>
        </div>
      </div>

      {/* Chart & Empty State Section */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne text-lg font-bold text-[#F8FAFC]">
              Activity Trends Over Time
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Cumulative events across selected timeframe ({period.toUpperCase()})
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8]" />
              Pageviews
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Signups
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Portfolios
            </span>
          </div>
        </div>

        {/* Real Data Chart or Explicit "No data available yet" state */}
        {!hasData && chartSeries.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-[#030712] border border-dashed border-[#172554] p-8">
            <AlertCircle className="w-10 h-10 text-[#94A3B8]/40 mb-3" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">No data available yet.</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mt-1">
              Real analytics events will automatically populate as visitors interact with the public studio website, create portfolios, and submit inquiries.
            </p>
          </div>
        ) : (
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8 pb-4 px-4 bg-[#030712] rounded-2xl border border-[#172554]">
            {chartSeries.map((item: any, i: number) => {
              const maxVal = Math.max(10, ...chartSeries.map((s: any) => s.value || 1));
              const heightPct = Math.min(100, Math.max(8, ((item.value || 0) / maxVal) * 100));

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[40px] flex items-end justify-center h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#2563EB] to-[#38BDF8] transition-all duration-300 group-hover:brightness-125 relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-[#0B132B] border border-[#2563EB] rounded text-[10px] text-[#F8FAFC] whitespace-nowrap z-10 shadow-lg">
                        {item.value} events
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] truncate max-w-full">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            Visitor → Inquirer
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC]">
            {metrics.pageViews > 0
              ? `${((metrics.projectRequests / metrics.pageViews) * 100).toFixed(1)}%`
              : '0.0%'}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Proportion of visitors who submit an esports project inquiry.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            User → Portfolio Creator
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC]">
            {metrics.totalUsers > 0
              ? `${((metrics.totalPortfolios / metrics.totalUsers) * 100).toFixed(1)}%`
              : '0.0%'}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Registered creators who initialize a custom portfolio workspace.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            Creator → Published Domain
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC]">
            {metrics.totalPortfolios > 0
              ? `${((metrics.publishedPortfolios / metrics.totalPortfolios) * 100).toFixed(1)}%`
              : '0.0%'}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Draft portfolios successfully published to *.naturestudio.in.
          </p>
        </div>
      </div>
    </div>
  );
}
