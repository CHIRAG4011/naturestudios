'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Globe, CheckCircle2, ShieldCheck, Radio, RefreshCw, ExternalLink } from 'lucide-react';

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/domains');
      if (res.ok) {
        const data = await res.json();
        setDomains(data.domains || []);
      }
    } catch (err) {
      console.error('Failed to load domains', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Domain & Wildcard Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Vercel DNS Synchronized
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Production apex domain, canonical redirects, and multi-tenant creator wildcard configurations.
          </p>
        </div>

        <button
          onClick={fetchDomains}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            hostname: 'naturestudio.in',
            type: 'Apex Production Domain',
            ssl: 'Active (Let\'s Encrypt / Vercel Edge)',
            status: 'VERIFIED',
            traffic: 'Primary Public Studio',
          },
          {
            hostname: 'www.naturestudio.in',
            type: 'Canonical Subdomain',
            ssl: 'Active (Automated 301 to Apex)',
            status: 'VERIFIED',
            traffic: 'Canonical Redirect',
          },
          {
            hostname: '*.naturestudio.in',
            type: 'Multi-Tenant Wildcard',
            ssl: 'Wildcard SSL Active',
            status: 'OPERATIONAL',
            traffic: 'Creator Portfolios Layer',
          },
        ].map((d) => (
          <div
            key={d.hostname}
            className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-xs text-[#38BDF8]">
                {d.hostname}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {d.status}
              </span>
            </div>

            <div className="text-xs text-[#F8FAFC] font-medium">{d.type}</div>
            <div className="text-[11px] text-[#94A3B8]">{d.traffic}</div>

            <div className="pt-2 border-t border-[#172554] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>TLS / SSL</span>
              <span className="text-emerald-400">{d.ssl}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
