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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
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
        ...(categoryFilter && { category: categoryFilter }),
        ...(subcategoryFilter && { subcategory: subcategoryFilter }),
      });

      const res = await fetch(`/api/admin/portfolios?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data.portfolios || []);
        setTotal(data.total || (data.portfolios ? data.portfolios.length : 0));
      }
    } catch (err) {
      console.error('Failed to load portfolios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [page, statusFilter, categoryFilter, subcategoryFilter]);

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

    const isPub = portfolio.published || portfolio.status === 'PUBLISHED';
    const action = isPub ? 'UNPUBLISH' : 'PUBLISH';
    const identifier = portfolio.slug || portfolio.username || portfolio.id;
    if (!confirm(`Are you sure you want to ${action} portfolio @${identifier}?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolios/${portfolio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !isPub, status: !isPub ? 'PUBLISHED' : 'DRAFT' }),
      });

      if (!res.ok) throw new Error('Action failed');
      setToastMessage(`Portfolio @${identifier} ${action.toLowerCase()}ed.`);
      fetchPortfolios();
    } catch (err: any) {
      alert(err.message || 'Error updating portfolio state');
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
              Global User Portfolios Moderation
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              COMMUNITY
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Moderate community creator portfolios, tenant isolation, subdomain allocations, and GFX/VFX classification.
          </p>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creator or slug..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#2563EB] w-44 sm:w-52"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="">All Tracks</option>
            <option value="GFX">GFX</option>
            <option value="VFX">VFX</option>
            <option value="Other">Other</option>
          </select>

          {(!categoryFilter || categoryFilter === 'GFX') && (
            <select
              value={subcategoryFilter}
              onChange={(e) => {
                setSubcategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
            >
              <option value="">All GFX Subcategories</option>
              <option value="Tournament">Tournament</option>
              <option value="Roster">Roster</option>
              <option value="Thumbnail">Thumbnail</option>
              <option value="Logo/Banner">Logo/Banner</option>
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#6D1C22] text-xs font-semibold text-[#F8FAFC] cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Portfolios Table */}
      <div className="rounded-3xl bg-[#070D1E] border border-[#172554] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030712] border-b border-[#172554] text-[#38BDF8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Portfolio / Creator</th>
                <th className="px-4 py-3.5">Subdomain</th>
                <th className="px-4 py-3.5">Track / Category</th>
                <th className="px-4 py-3.5">Theme</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Views</th>
                <th className="px-4 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172554]/60 text-[#F8FAFC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#94A3B8]">
                    Loading portfolio records...
                  </td>
                </tr>
              ) : portfolios.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#94A3B8]">
                    No portfolios found matching filters.
                  </td>
                </tr>
              ) : (
                portfolios.map((p) => {
                  const identifier = p.slug || p.username || 'creator';
                  const title = p.personalInfo?.fullName || p.personalInfo?.professionalName || p.title || `@${identifier}`;
                  const isPublished = p.published || p.status === 'PUBLISHED';
                  return (
                    <tr key={p.id} className="hover:bg-[#0B132B]/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-[#F8FAFC]">{title}</div>
                        <div className="text-[11px] text-[#94A3B8] font-mono">{p.ownerEmail || p.personalInfo?.publicEmail || '—'}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#38BDF8]">
                        {identifier}.naturestudio.in
                      </td>
                      <td className="px-4 py-3.5">
                        {p.category === 'GFX' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2563EB]/50 border border-[#38BDF8]/20 text-[#38BDF8] font-mono text-[10px] uppercase font-bold">
                            GFX • {p.gfxSubcategory || 'Tournament'}
                          </span>
                        ) : p.category === 'VFX' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-[10px] uppercase font-bold">
                            VFX Reel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B132B] border border-[#172554] text-[#94A3B8] font-mono text-[10px] uppercase">
                            {p.category || 'Creator'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[#94A3B8] capitalize">{p.themeId || p.theme || 'Editorial'}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isPublished ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#94A3B8]">{p.views || 0}</td>
                      <td className="px-4 py-3.5 text-[#94A3B8] text-[11px]">
                        {new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/portfolio/preview?slug=${identifier}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-[#38BDF8] transition-colors"
                            title="Preview Public Portfolio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {(isSuperAdmin || hasPermission('portfolios.unpublish')) && (
                            <button
                              onClick={() => handleTogglePublish(p)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                                isPublished
                                  ? 'bg-[#E63946]/10 text-[#E63946] hover:bg-[#E63946]/20'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                            >
                              {isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
