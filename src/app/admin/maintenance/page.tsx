'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { Wrench, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminMaintenancePage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(Boolean(data.settings?.maintenanceMode));
      }
    } catch (err) {
      console.error('Failed to load maintenance status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    if (!isSuperAdmin && !hasPermission('maintenance.manage')) {
      alert('You lack maintenance.manage authority.');
      return;
    }

    const nextState = !maintenanceMode;
    if (
      nextState &&
      !confirm('Enable Maintenance Mode? Public visitors will receive "We\'ll be back shortly".')
    ) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: nextState }),
      });

      if (!res.ok) throw new Error('Failed to update maintenance mode');
      setMaintenanceMode(nextState);
      setToastMessage(`Maintenance mode is now ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}.`);
    } catch (err: any) {
      alert(err.message || 'Error updating maintenance mode');
    } finally {
      setSaving(false);
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
              Emergency Maintenance Control
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                maintenanceMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {maintenanceMode ? 'MAINTENANCE ACTIVE' : 'PUBLIC LIVE'}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Enclave safeguard: Enabling maintenance mode redirects unauthenticated public traffic while keeping the administrative control center fully operational.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Control Card */}
      <div className="p-8 rounded-3xl bg-[#070D1E] border border-[#172554] max-w-2xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/40 border border-[#38BDF8]/20 flex items-center justify-center mx-auto text-[#38BDF8] shadow-inner">
          <Wrench className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-syne text-xl font-bold text-[#F8FAFC]">
            {maintenanceMode ? 'Maintenance Mode is ACTIVE' : 'Public Access is Normal'}
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            {maintenanceMode
              ? 'Public visitors currently receive the branded NatureStudios maintenance screen. Verified administrators continue to have full access.'
              : 'The public website, creator portfolios, and client inquiry forms are accessible globally.'}
          </p>
        </div>

        <div className="pt-2">
          {(isSuperAdmin || hasPermission('maintenance.manage')) && (
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`px-6 py-3 rounded-2xl text-xs font-semibold shadow-xl transition-all ${
                maintenanceMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-[#E63946] hover:bg-[#C92A36] text-white'
              }`}
            >
              {saving
                ? 'Processing...'
                : maintenanceMode
                ? 'Deactivate Maintenance (Restore Public)'
                : 'Activate Maintenance Mode'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
