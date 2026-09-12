'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';
import { Search, X, User, Folder, Briefcase, FileText, Shield, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function CommandPalette() {
  const router = useRouter();
  const { showCommandPalette, setShowCommandPalette, hasPermission, isSuperAdmin } = useAdmin();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    users: any[];
    portfolios: any[];
    projects: any[];
    auditLogs: any[];
    content: any[];
  }>({
    users: [],
    portfolios: [],
    projects: [],
    auditLogs: [],
    content: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showCommandPalette) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ users: [], portfolios: [], projects: [], auditLogs: [], content: [] });
    }
  }, [showCommandPalette]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], portfolios: [], projects: [], auditLogs: [], content: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || { users: [], portfolios: [], projects: [], auditLogs: [], content: [] });
        }
      } catch (err) {
        console.error('Command search failed', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!showCommandPalette) return null;

  const navigateTo = (url: string) => {
    setShowCommandPalette(false);
    router.push(url);
  };

  const quickLinks = [
    { label: 'Overview Dashboard', url: '/admin', icon: Briefcase, perm: 'analytics.view' },
    { label: 'User Directory', url: '/admin/users', icon: User, perm: 'users.view' },
    { label: 'Roles & RBAC', url: '/admin/roles', icon: Shield, perm: 'roles.view' },
    { label: 'Granular Permissions', url: '/admin/permissions', icon: Shield, perm: 'permissions.view' },
    { label: 'Site Content CMS', url: '/admin/content', icon: FileText, perm: 'content.view' },
    { label: 'Global Theme Studio', url: '/admin/theme', icon: Folder, perm: 'theme.view' },
    { label: 'Creator Portfolios', url: '/admin/portfolios', icon: Folder, perm: 'portfolios.view' },
    { label: 'Security Center', url: '/admin/security', icon: Shield, perm: 'security.view' },
    { label: 'Audit Trail', url: '/admin/audit-logs', icon: FileText, perm: 'audit.view' },
    { label: 'System Health & Latency', url: '/admin/system', icon: Briefcase, perm: 'system.view' },
  ].filter((link) => isSuperAdmin || hasPermission(link.perm));

  const totalResults =
    results.users.length +
    results.portfolios.length +
    results.projects.length +
    results.auditLogs.length +
    results.content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#1D0608] border border-[#59171B]/60 rounded-2xl shadow-2xl overflow-hidden text-[#FFF5ED] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#3D0D13] bg-[#240709]/80">
          <Search className="w-5 h-5 text-[#FED7B8]/60 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowCommandPalette(false);
            }}
            placeholder="Search users, portfolios, projects, audit logs, or jump to route..."
            className="w-full bg-transparent text-sm text-[#FFF5ED] placeholder-[#B89B8D]/50 focus:outline-none"
          />
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#FED7B8] border-t-transparent rounded-full animate-spin mr-2" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#B89B8D] hover:text-[#FFF5ED] rounded transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[#B89B8D] bg-[#150304] border border-[#3D0D13] rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!query && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FED7B8]/60 px-3 py-1.5">
                Quick Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.url}
                      onClick={() => navigateTo(link.url)}
                      className="flex items-center justify-between p-2.5 rounded-xl text-left text-xs text-[#FFF5ED] hover:bg-[#59171B]/30 hover:border-[#FED7B8]/20 border border-transparent transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#FED7B8]/70 group-hover:text-[#FED7B8]" />
                        <span>{link.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B89B8D]/40 group-hover:text-[#FED7B8] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {query && totalResults === 0 && !loading && (
            <div className="py-10 text-center text-xs text-[#B89B8D]">
              No records found matching <span className="text-[#FED7B8]">&quot;{query}&quot;</span>.
            </div>
          )}

          {/* Users */}
          {results.users.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FED7B8]/60 px-3 py-1">
                Users ({results.users.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => navigateTo(u.url)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#59171B]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#59171B]/60 flex items-center justify-center text-xs font-bold text-[#FED7B8]">
                        {u.title[0]}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#FFF5ED]">{u.title}</div>
                        <div className="text-[11px] text-[#B89B8D]">{u.subtitle}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#B89B8D]/40 group-hover:text-[#FED7B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Portfolios */}
          {results.portfolios.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FED7B8]/60 px-3 py-1">
                Portfolios ({results.portfolios.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.portfolios.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigateTo(p.url)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#59171B]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-4 h-4 text-[#FED7B8]" />
                      <div>
                        <div className="text-xs font-medium text-[#FFF5ED]">{p.title}</div>
                        <div className="text-[11px] text-[#FED7B8]/70">{p.subtitle}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#B89B8D]/40 group-hover:text-[#FED7B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {results.auditLogs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FED7B8]/60 px-3 py-1">
                Audit Events ({results.auditLogs.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.auditLogs.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => navigateTo(a.url)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#59171B]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#B89B8D]" />
                      <div>
                        <div className="text-xs font-medium text-[#FFF5ED]">{a.title}</div>
                        <div className="text-[11px] text-[#B89B8D]">{a.subtitle}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#B89B8D]/40 group-hover:text-[#FED7B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Pages */}
          {results.content.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FED7B8]/60 px-3 py-1">
                Site Pages & Content ({results.content.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.content.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigateTo(c.url)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-[#59171B]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#FED7B8]" />
                      <div>
                        <div className="text-xs font-medium text-[#FFF5ED]">{c.title}</div>
                        <div className="text-[11px] text-[#B89B8D]">{c.subtitle}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#B89B8D]/40 group-hover:text-[#FED7B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#3D0D13] bg-[#150304] flex items-center justify-between text-[11px] text-[#B89B8D]">
          <span>Tip: Permission-filtered real time search</span>
          <span className="flex items-center gap-2">
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 bg-[#240709] border border-[#3D0D13] rounded text-[10px]">↑↓</kbd>
            <span>Select</span>
            <kbd className="px-1.5 py-0.5 bg-[#240709] border border-[#3D0D13] rounded text-[10px]">↵</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
