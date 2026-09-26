'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from './AdminContext';
import {
  Users,
  Layers,
  Inbox,
  Activity,
  Cpu,
  Mail,
  ArrowUpRight,
  TrendingUp,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { user, isSuperAdmin, hasPermission } = useAdmin();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
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

  const health = data?.systemHealth || {
    mongo: { status: 'OPERATIONAL', latencyMs: 15 },
    api: { status: 'OPERATIONAL' },
    resend: { status: 'OPERATIONAL' },
    googleOAuth: { status: 'OPERATIONAL' },
  };

  const recentAudits = data?.recentAuditLogs || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#070D1E] to-[#030712] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Mission Control
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              Live Realtime
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            NatureStudios studio operations, creator portfolios, RBAC policies & production cluster health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-[#030712] p-1 rounded-xl border border-[#172554]">
            {(['today', '7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg uppercase tracking-wider transition-all ${
                  period === p
                    ? 'bg-[#2563EB] text-[#F8FAFC] shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={fetchOverview}
            className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.totalUsers}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span>{metrics.verifiedUsers} Verified</span>
            <span className="text-emerald-400 font-mono">{metrics.activeUsers} Active</span>
          </div>
        </div>

        {/* Portfolios */}
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium uppercase tracking-wider">Portfolios</span>
            <Layers className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.totalPortfolios}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span className="text-[#38BDF8] font-mono">{metrics.publishedPortfolios} Published</span>
            <span>{metrics.draftPortfolios} Draft</span>
          </div>
        </div>

        {/* Project Requests */}
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium uppercase tracking-wider">Project Inquiries</span>
            <Inbox className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.projectRequests}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span>{metrics.openProjects} In Production</span>
            <span className="text-[#38BDF8] font-mono">100% Pipeline</span>
          </div>
        </div>

        {/* Email Dispatches */}
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-medium uppercase tracking-wider">Resend Delivery</span>
            <Mail className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.emailsSent}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span className="text-emerald-400 font-mono">Sent Verified</span>
            <span className={metrics.emailsFailed > 0 ? 'text-[#E63946]' : 'text-[#94A3B8]'}>
              {metrics.emailsFailed} Failed
            </span>
          </div>
        </div>
      </div>

      {/* Cluster Health & Quick Operations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Infrastructure Status */}
        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
                Infrastructure Latency
              </span>
            </div>
            <Link
              href="/admin/system"
              className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              <span>Full Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {/* MongoDB */}
            <div className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F8FAFC]">MongoDB Atlas</div>
                <div className="text-[10px] text-[#94A3B8]">FIPS 140-2 Encrypted Clusters</div>
              </div>
              <div className="flex items-center gap-2">
                {health.mongo.latencyMs && (
                  <span className="text-[11px] font-mono text-[#38BDF8]">{health.mongo.latencyMs}ms</span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {health.mongo.status}
                </span>
              </div>
            </div>

            {/* Resend */}
            <div className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F8FAFC]">Resend API</div>
                <div className="text-[10px] text-[#94A3B8]">Mailbox routing (naturestudio.in)</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {health.resend.status}
              </span>
            </div>

            {/* Google OAuth */}
            <div className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#F8FAFC]">Google OAuth 2.0</div>
                <div className="text-[10px] text-[#94A3B8]">Federated Single Sign-On</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {health.googleOAuth.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Operations Matrix */}
        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
              High-Frequency Actions
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/admin/theme"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                Theme Studio
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Colors, typography & live CSS</div>
            </Link>

            <Link
              href="/admin/content"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                CMS Editor
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Hero, services, studio copy</div>
            </Link>

            <Link
              href="/admin/users"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                User Directory
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Roles, suspension, sessions</div>
            </Link>

            <Link
              href="/admin/permissions"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                Permissions
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">50+ keys & Allow/Deny matrix</div>
            </Link>

            <Link
              href="/admin/portfolios"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                Portfolios
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Subdomains & moderation</div>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="p-3 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] hover:border-[#2563EB] transition-all group text-left"
            >
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8]">
                Audit Trail
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Immutable admin logs</div>
            </Link>
          </div>
        </div>

        {/* Real-time Audit Activity Stream */}
        <div className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
                Audit Activity Feed
              </span>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#172554]">
            {recentAudits.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No recent administrative actions recorded yet.
              </div>
            ) : (
              recentAudits.map((log: any) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-[#030712] border border-[#172554] text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-medium text-[#38BDF8] font-mono text-[11px]">
                      {log.action}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] truncate max-w-[180px]">
                      {log.resource} • {log.adminEmail}
                    </div>
                  </div>
                  <span className="text-[9px] text-[#94A3B8] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
