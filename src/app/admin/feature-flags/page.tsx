'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Flag, Check, X, Shield, RefreshCw } from 'lucide-react';

export default function AdminFeatureFlagsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/feature-flags');
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags || []);
      }
    } catch (err) {
      console.error('Failed to load feature flags', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggleFlag = async (flag: any) => {
    if (!isSuperAdmin && !hasPermission('feature_flags.manage')) {
      alert('You lack feature_flags.manage authority.');
      return;
    }

    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: flag.key,
          enabled: !flag.enabled,
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle flag');
      setToastMessage(`Feature flag "${flag.name}" set to ${!flag.enabled ? 'ENABLED' : 'DISABLED'}.`);
      fetchFlags();
    } catch (err: any) {
      alert(err.message || 'Error updating feature flag');
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
              Feature Flags & Rollouts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              Runtime Configuration
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Safely enable, disable, and canary-test upcoming platform capabilities in production without code deploys.
          </p>
        </div>

        <button
          onClick={fetchFlags}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            Loading feature flag configurations...
          </div>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.key}
              className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#F8FAFC]">{flag.name}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                      flag.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#030712] text-[#94A3B8] border border-[#172554]'
                    }`}
                  >
                    {flag.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-[#38BDF8]">{flag.key}</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                  {flag.description || 'Feature flag controlling platform capability.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#172554] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  {flag.percentage !== undefined ? `${flag.percentage}% Rollout` : '100% Target'}
                </span>

                {(isSuperAdmin || hasPermission('feature_flags.manage')) && (
                  <button
                    onClick={() => handleToggleFlag(flag)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                      flag.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-[#030712] text-[#94A3B8] hover:bg-[#0B132B] hover:text-[#F8FAFC] border border-[#172554]'
                    }`}
                  >
                    {flag.enabled ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
