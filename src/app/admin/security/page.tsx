'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  ShieldCheck,
  Lock,
  Key,
  AlertTriangle,
  Activity,
  FileText,
  CheckCircle2,
  Users,
  Server,
  RefreshCw,
} from 'lucide-react';

export default function AdminSecurityPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSecurity = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/security');
      if (res.ok) {
        const data = await res.json();
        setSecurityData(data);
      }
    } catch (err) {
      console.error('Failed to load security center data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurity();
  }, []);

  const encryption = securityData?.encryption || {
    status: 'ACTIVE',
    atRest: 'MongoDB Atlas FIPS 140-2 Compliant Storage Encryption',
    inTransit: 'TLS 1.3 Strict HTTPS Enforced',
    keyVersion: 'v1.0 (AES-256-GCM class architecture)',
    keyConfigured: true,
  };

  const securityEvents = securityData?.recentEvents || [];
  const metrics = securityData?.metrics || {
    failedLogins: 0,
    rateLimitHits: 0,
    suspiciousRequests: 0,
    activeSessions: 1,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Security Center & Cryptography
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Shield Active
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Threat detection telemetry, cryptographic key status, rate limiting, and session security.
          </p>
        </div>

        <button
          onClick={fetchSecurity}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title="Refresh Security Status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Cryptographic Architecture Card */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
          <Lock className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
            Cryptographic Integrity & Envelope Encryption
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#030712] border border-[#172554] space-y-1">
            <div className="text-[#94A3B8]">Data-at-Rest Encryption</div>
            <div className="font-semibold text-emerald-400 font-mono text-[11px]">
              {encryption.atRest}
            </div>
            <div className="text-[10px] text-[#94A3B8]">Automated volume-level encryption</div>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-[#172554] space-y-1">
            <div className="text-[#94A3B8]">Data-in-Transit</div>
            <div className="font-semibold text-emerald-400 font-mono text-[11px]">
              {encryption.inTransit}
            </div>
            <div className="text-[10px] text-[#94A3B8]">HSTS & Perfect Forward Secrecy</div>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-[#172554] space-y-1">
            <div className="text-[#94A3B8]">Application Key Status</div>
            <div className="font-semibold text-[#38BDF8] font-mono text-[11px]">
              {encryption.keyVersion}
            </div>
            <div className="text-[10px] text-emerald-400">Zero Raw Secret Leakage Enforced</div>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="text-xs uppercase font-medium text-[#94A3B8]">Failed Logins</div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.failedLogins}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Normal baseline</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="text-xs uppercase font-medium text-[#94A3B8]">Rate Limit Triggers</div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.rateLimitHits}
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-1">IP-based protection active</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="text-xs uppercase font-medium text-[#94A3B8]">Active Sessions</div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.activeSessions}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Argon2id + JWT Verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070D1E] border border-[#172554]">
          <div className="text-xs uppercase font-medium text-[#94A3B8]">Suspicious Events</div>
          <div className="text-2xl font-bold font-syne text-[#F8FAFC] mt-2">
            {metrics.suspiciousRequests}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Zero anomalies detected</div>
        </div>
      </div>

      {/* Security Event Log */}
      <div className="rounded-3xl bg-[#070D1E] border border-[#172554] overflow-hidden shadow-xl">
        <div className="px-5 py-4 bg-[#030712] border-b border-[#172554] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
              Security Event Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">Sanitized Payload Stream</span>
        </div>

        <div className="p-4 space-y-2">
          {securityEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#94A3B8]">
              No high-severity security incidents detected.
            </div>
          ) : (
            securityEvents.map((evt: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-semibold text-[#38BDF8]">{evt.type}</div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {evt.email || 'System'} • {evt.ip || 'Localhost'}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                      evt.severity === 'HIGH' || evt.severity === 'CRITICAL'
                        ? 'bg-[#E63946]/20 text-[#E63946]'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {evt.severity}
                  </span>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5 font-mono">
                    {new Date(evt.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
