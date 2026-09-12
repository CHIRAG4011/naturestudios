'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Sliders,
  Palette,
  Eye,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  Type,
  Maximize2,
  RefreshCw,
  History,
} from 'lucide-react';

export default function AdminThemePage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'gradients' | 'typography' | 'design'>('colors');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTheme = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/theme');
      if (res.ok) {
        const data = await res.json();
        setTheme(data.theme);
      }
    } catch (err) {
      console.error('Failed to load theme', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const handleColorChange = (key: string, value: string) => {
    setTheme((prev: any) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleGradientChange = (key: string, value: string) => {
    setTheme((prev: any) => ({
      ...prev,
      gradients: {
        ...prev.gradients,
        [key]: value,
      },
    }));
  };

  const handleSaveDraft = async () => {
    if (!isSuperAdmin && !hasPermission('theme.edit')) {
      alert('You lack theme.edit authority.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, action: 'DRAFT' }),
      });
      if (!res.ok) throw new Error('Failed to save draft');
      setToastMessage('Theme draft saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Error saving theme draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishTheme = async () => {
    if (!isSuperAdmin && !hasPermission('theme.publish')) {
      alert('You lack theme.publish authority.');
      return;
    }
    if (!confirm('Publish this theme configuration globally to all NatureStudios visitors?')) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, action: 'PUBLISH' }),
      });
      if (!res.ok) throw new Error('Failed to publish theme');
      const data = await res.json();
      setTheme(data.theme);
      setToastMessage(`Theme v${data.theme.version} published globally!`);
    } catch (err: any) {
      alert(err.message || 'Error publishing theme');
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async () => {
    if (!isSuperAdmin && !hasPermission('theme.publish')) {
      alert('You lack theme.publish authority.');
      return;
    }
    const target = prompt('Enter theme version number to rollback to (e.g. 1):', '1');
    if (!target) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollbackVersion: parseInt(target, 10) }),
      });
      if (!res.ok) throw new Error('Rollback failed');
      await fetchTheme();
      setToastMessage(`Theme rolled back to Version ${target}.`);
    } catch (err: any) {
      alert(err.message || 'Error rolling back theme');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !theme) {
    return (
      <div className="p-12 text-center text-xs text-[#B89B8D]">
        Loading active theme tokens and CSS variables from MongoDB Atlas...
      </div>
    );
  }

  const colors = theme.colors || {};
  const gradients = theme.gradients || {};
  const typography = theme.typography || {};
  const design = theme.design || {};

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
              Global Theme Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Active v{theme.version} • {theme.status}
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Dynamic CSS variable pipeline. Modify studio color palettes, typography, and animation scales without code changes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(isSuperAdmin || hasPermission('theme.publish')) && (
            <button
              onClick={handleRollback}
              disabled={saving}
              className="px-3 py-1.5 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs text-[#B89B8D] hover:text-[#FFF5ED] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rollback</span>
            </button>
          )}

          {(isSuperAdmin || hasPermission('theme.edit')) && (
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs font-medium text-[#FFF5ED] transition-colors"
            >
              Save Draft
            </button>
          )}

          {(isSuperAdmin || hasPermission('theme.publish')) && (
            <button
              onClick={handlePublishTheme}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FED7B8]" />
              <span>Publish Theme</span>
            </button>
          )}
        </div>
      </div>

      {/* Studio Tabs & Live Interactive Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-[#3D0D13] text-xs">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'colors'
                  ? 'border-[#FED7B8] text-[#FED7B8]'
                  : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>
            <button
              onClick={() => setActiveTab('gradients')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'gradients'
                  ? 'border-[#FED7B8] text-[#FED7B8]'
                  : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gradients</span>
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'typography'
                  ? 'border-[#FED7B8] text-[#FED7B8]'
                  : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography</span>
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'design'
                  ? 'border-[#FED7B8] text-[#FED7B8]'
                  : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Design & Animations</span>
            </button>
          </div>

          {/* Tab 1: Colors */}
          {activeTab === 'colors' && (
            <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Primary Brand (Burgundy)', key: 'primary' },
                  { label: 'Secondary (Warm Beige)', key: 'secondary' },
                  { label: 'Dark Background', key: 'background' },
                  { label: 'Dark Surface', key: 'surface' },
                  { label: 'Main Text', key: 'text' },
                  { label: 'Muted Text', key: 'mutedText' },
                  { label: 'Border Color', key: 'border' },
                  { label: 'Accent Highlight', key: 'accent' },
                  { label: 'Success Green', key: 'success' },
                  { label: 'Warning Amber', key: 'warning' },
                  { label: 'Error / LIVE Red', key: 'liveRed' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3 rounded-xl bg-[#150304] border border-[#3D0D13] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-[#FFF5ED]">{item.label}</div>
                      <div className="font-mono text-[11px] text-[#FED7B8]">
                        {colors[item.key] || '#000000'}
                      </div>
                    </div>
                    <input
                      type="color"
                      value={colors[item.key] || '#59171B'}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Gradients */}
          {activeTab === 'gradients' && (
            <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-4 text-xs">
              <div>
                <label className="text-[#B89B8D] block mb-1">Primary Hero Gradient</label>
                <input
                  type="text"
                  value={gradients.primary || ''}
                  onChange={(e) => handleGradientChange('primary', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FED7B8] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Secondary Gradient</label>
                <input
                  type="text"
                  value={gradients.secondary || ''}
                  onChange={(e) => handleGradientChange('secondary', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FED7B8] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Ambient Mesh Glow</label>
                <input
                  type="text"
                  value={gradients.ambientMesh || ''}
                  onChange={(e) => handleGradientChange('ambientMesh', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FED7B8] font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Typography */}
          {activeTab === 'typography' && (
            <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#B89B8D] block mb-1">Display Font</label>
                  <input
                    type="text"
                    value={typography.displayFont || 'Syne, sans-serif'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        typography: { ...prev.typography, displayFont: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  />
                </div>
                <div>
                  <label className="text-[#B89B8D] block mb-1">Heading Font</label>
                  <input
                    type="text"
                    value={typography.headingFont || 'Outfit, sans-serif'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        typography: { ...prev.typography, headingFont: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#B89B8D] block mb-1">Body Font</label>
                  <input
                    type="text"
                    value={typography.bodyFont || 'Inter, sans-serif'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        typography: { ...prev.typography, bodyFont: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  />
                </div>
                <div>
                  <label className="text-[#B89B8D] block mb-1">Monospace Font</label>
                  <input
                    type="text"
                    value={typography.monoFont || 'JetBrains Mono, monospace'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        typography: { ...prev.typography, monoFont: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Design & Animations */}
          {activeTab === 'design' && (
            <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#B89B8D] block mb-1">Border Radius</label>
                  <select
                    value={design.borderRadius || '16px'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        design: { ...prev.design, borderRadius: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  >
                    <option value="8px">Subtle (8px)</option>
                    <option value="16px">Standard (16px)</option>
                    <option value="24px">Editorial (24px)</option>
                    <option value="32px">Heavy Pill (32px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#B89B8D] block mb-1">Animation Intensity</label>
                  <select
                    value={design.animationIntensity || 'CINEMATIC'}
                    onChange={(e) =>
                      setTheme((prev: any) => ({
                        ...prev,
                        design: { ...prev.design, animationIntensity: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  >
                    <option value="OFF">OFF (Respect Reduced Motion)</option>
                    <option value="SUBTLE">SUBTLE</option>
                    <option value="STANDARD">STANDARD</option>
                    <option value="CINEMATIC">CINEMATIC (Recommended)</option>
                    <option value="EXTREME">EXTREME</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#FED7B8]" />
                <span className="font-semibold text-xs uppercase tracking-wider text-[#FFF5ED]">
                  Live Component Preview
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#FED7B8]">Reactive</span>
            </div>

            {/* Mock website hero card rendered using currently picked values */}
            <div
              style={{
                backgroundColor: colors.background || '#150304',
                borderColor: colors.border || '#3D0D13',
                color: colors.text || '#FFF5ED',
                borderRadius: design.borderRadius || '16px',
              }}
              className="p-6 border shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    backgroundColor: colors.primary || '#59171B',
                    color: colors.secondary || '#FED7B8',
                    borderColor: colors.border || '#3D0D13',
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                >
                  LIVE BROADCAST
                </span>
                <span
                  style={{ color: colors.mutedText || '#B89B8D' }}
                  className="text-[11px] font-mono"
                >
                  NATURESTUDIOS
                </span>
              </div>

              <div>
                <h3
                  style={{ color: colors.secondary || '#FED7B8' }}
                  className="font-syne text-xl font-bold"
                >
                  WE CREATE THE NEXT LEVEL OF ESPORTS.
                </h3>
                <p
                  style={{ color: colors.mutedText || '#B89B8D' }}
                  className="text-xs mt-1 leading-relaxed"
                >
                  Cinematic broadcasts, tournament packaging, and multi-tenant creator portfolios.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  style={{
                    backgroundColor: colors.primary || '#59171B',
                    color: colors.text || '#FFF5ED',
                    borderRadius: design.borderRadius || '12px',
                  }}
                  className="px-4 py-2 text-xs font-semibold shadow-md"
                >
                  Explore Work
                </button>
                <button
                  style={{
                    backgroundColor: colors.surface || '#240709',
                    color: colors.secondary || '#FED7B8',
                    borderColor: colors.border || '#3D0D13',
                    borderRadius: design.borderRadius || '12px',
                  }}
                  className="px-4 py-2 text-xs font-medium border"
                >
                  Contact Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
