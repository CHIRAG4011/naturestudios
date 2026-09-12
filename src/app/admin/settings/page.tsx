'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Settings,
  Save,
  Shield,
  AlertTriangle,
  RefreshCw,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin && !hasPermission('settings.edit')) {
      alert('You lack settings.edit authority.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setToastMessage('Global platform settings updated successfully.');
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-[#B89B8D]">
        Loading platform settings from MongoDB Atlas...
      </div>
    );
  }

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
              Global Platform Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Atlas Configured
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Global studio parameters, contact routing, authentication toggles, and emergency maintenance controls.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('settings.edit')) && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#FED7B8]" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        )}
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Brand Information */}
        <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#FED7B8] pb-2 border-b border-[#3D0D13]">
            Brand Identity & Contact
          </div>

          <div>
            <label className="text-[#B89B8D] block mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brandName || ''}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#59171B]"
            />
          </div>

          <div>
            <label className="text-[#B89B8D] block mb-1">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline || ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#59171B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#B89B8D] block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
              />
            </div>
            <div>
              <label className="text-[#B89B8D] block mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
              />
            </div>
          </div>
        </div>

        {/* Global Operational Toggles */}
        <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#FED7B8] pb-2 border-b border-[#3D0D13]">
            Access & Operational Toggles
          </div>

          {[
            { label: 'Public User Registration', key: 'registrationEnabled', desc: 'Allow visitors to sign up' },
            { label: 'Google OAuth Single Sign-On', key: 'googleLoginEnabled', desc: 'Enable Google authentication' },
            { label: 'Portfolio Creation Engine', key: 'portfolioCreationEnabled', desc: 'Allow creators to build portfolios' },
            { label: 'Portfolio Subdomain Publishing', key: 'portfolioPublishingEnabled', desc: 'Allow public *.naturestudio.in publishing' },
            { label: 'Studio Contact Forms', key: 'contactFormsEnabled', desc: 'Receive client inquiry submissions' },
            { label: 'Maintenance Mode', key: 'maintenanceMode', desc: 'Show maintenance screen to public (admins unaffected)' },
          ].map((toggle) => (
            <div
              key={toggle.key}
              className="p-3 rounded-xl bg-[#150304] border border-[#3D0D13] flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#FFF5ED]">{toggle.label}</div>
                <div className="text-[11px] text-[#B89B8D]">{toggle.desc}</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings[toggle.key] ? 'bg-[#59171B]' : 'bg-[#240709] border border-[#3D0D13]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#FFF5ED] transition-transform ${
                    settings[toggle.key] ? 'translate-x-6 bg-[#FED7B8]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
