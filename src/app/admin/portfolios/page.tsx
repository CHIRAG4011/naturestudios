'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import {
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function AdminPortfoliosPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/portfolios?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data.portfolios || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load portfolios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPortfolios();
  };

  const handleTogglePublish = async (portfolio: any) => {
    if (!isSuperAdmin && !hasPermission('portfolios.unpublish')) {
      alert('You lack portfolios.unpublish authority.');
      return;
    }

    const action = portfolio.published ? 'UNPUBLISH' : 'PUBLISH';
    if (!confirm(`Are you sure you want to ${action} portfolio @${portfolio.username}?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolios/${portfolio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !portfolio.published }),
      });

      if (!res.ok) throw new Error('Action failed');
      setToastMessage(`Portfolio @${portfolio.username} ${action.toLowerCase()}ed.`);
      fetchPortfolios();
    } catch (err: any) {
      alert(err.message || 'Error updating portfolio state');
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
              Creator Portfolios & Wildcards
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              *.naturestudio.in
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Tenant isolation, subdomain allocations, theme assignments, and content moderation.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#B89B8D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username or slug..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] placeholder-[#B89B8D]/50 focus:outline-none focus:border-[#59171B] w-48 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#59171B] hover:bg-[#6D1C22] text-xs font-semibold text-[#FFF5ED]"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Portfolios Table */}
      <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#150304] border-b border-[#3D0D13] text-[#FED7B8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Portfolio / Creator</th>
                <th className="px-4 py-3.5">Subdomain</th>
                <th className="px-4 py-3.5">Theme</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Views</th>
                <th className="px-4 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D0D13]/60 text-[#FFF5ED]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#B89B8D]">
                    Loading portfolio records...
                  </td>
                </tr>
              ) : portfolios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#B89B8D]">
                    No portfolios found.
                  </td>
                </tr>
              ) : (
                portfolios.map((p) => (
                  <tr key={p.id} className="hover:bg-[#240709]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#FFF5ED]">{p.title || `@${p.username}`}</div>
                      <div className="text-[11px] text-[#B89B8D] font-mono">{p.ownerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#FED7B8]">
                      {p.username}.naturestudio.in
                    </td>
                    <td className="px-4 py-3.5 text-[#B89B8D] capitalize">{p.theme || 'Burgundy'}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          p.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {p.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#B89B8D]">{p.views || 0}</td>
                    <td className="px-4 py-3.5 text-[#B89B8D] text-[11px]">
                      {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portfolio/preview?slug=${p.username}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#240709] hover:bg-[#320B0F] text-[#FED7B8] transition-colors"
                          title="Preview Public Portfolio"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {(isSuperAdmin || hasPermission('portfolios.unpublish')) && (
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-colors ${
                              p.published
                                ? 'bg-[#E63946]/10 text-[#E63946] hover:bg-[#E63946]/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {p.published ? 'Unpublish' : 'Publish'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
