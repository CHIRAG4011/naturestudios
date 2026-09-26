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
      <div className="p-12 text-center text-xs text-[#94A3B8]">
        Loading platform settings from MongoDB Atlas...
      </div>
    );
  }

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
              Global Platform Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              Atlas Configured
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Global studio parameters, contact routing, authentication toggles, and emergency maintenance controls.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('settings.edit')) && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#38BDF8]" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        )}
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Brand Information */}
        <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#38BDF8] pb-2 border-b border-[#172554]">
            Brand Identity & Contact
          </div>

          <div>
            <label className="text-[#94A3B8] block mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brandName || ''}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="text-[#94A3B8] block mb-1">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline || ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#94A3B8] block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="text-[#94A3B8] block mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#94A3B8] block mb-1">Official Instagram URL</label>
            <input
              type="url"
              value={settings.instagramUrl || ''}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              placeholder="https://www.instagram.com/naturestudio.in..."
              className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#94A3B8] block mb-1">Discord Invite URL</label>
              <input
                type="url"
                value={settings.discordUrl || ''}
                onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                placeholder="https://discord.gg/..."
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="text-[#94A3B8] block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+91 ..."
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Global Operational Toggles */}
        <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4">
          <div className="font-semibold text-xs uppercase tracking-wider text-[#38BDF8] pb-2 border-b border-[#172554]">
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
              className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#F8FAFC]">{toggle.label}</div>
                <div className="text-[11px] text-[#94A3B8]">{toggle.desc}</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings[toggle.key] ? 'bg-[#2563EB]' : 'bg-[#0B132B] border border-[#172554]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#F8FAFC] transition-transform ${
                    settings[toggle.key] ? 'translate-x-6 bg-[#38BDF8]' : 'translate-x-0'
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
