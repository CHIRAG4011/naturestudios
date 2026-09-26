'use client';

import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Compass, CheckCircle2, ArrowUp, ArrowDown, Eye, Save } from 'lucide-react';

export default function AdminNavigationPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [navItems, setNavItems] = useState([
    { label: 'Work', href: '/work', visible: true },
    { label: 'About', href: '/about', visible: true },
    { label: 'Services', href: '/services', visible: true },
    { label: 'Studio', href: '/studio', visible: true },
    { label: 'Portfolio', href: '/portfolio', visible: true },
    { label: 'Contact', href: '/contact', visible: true },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    const target = direction === 'UP' ? index - 1 : index + 1;
    if (target < 0 || target >= navItems.length) return;
    const updated = [...navItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setNavItems(updated);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...navItems];
    updated[index].visible = !updated[index].visible;
    setNavItems(updated);
  };

  const handleSave = () => {
    setToastMessage('Navigation menu configuration saved.');
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
              Public Navigation Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              Header & Mobile Menu
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Reorder public navigation items, toggle visibility, and validate destination routes.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('navigation.edit')) && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#38BDF8]" />
            <span>Save Menu</span>
          </button>
        )}
      </div>

      {/* Nav Items List */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-3 max-w-2xl">
        {navItems.map((item, i) => (
          <div
            key={item.href}
            className="p-3.5 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#38BDF8] font-bold">0{i + 1}</span>
              <span className="font-semibold text-[#F8FAFC]">{item.label}</span>
              <span className="font-mono text-[10px] text-[#94A3B8]">{item.href}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleVisibility(i)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  item.visible
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-[#0B132B] text-[#94A3B8]'
                }`}
              >
                {item.visible ? 'VISIBLE' : 'HIDDEN'}
              </button>

              <button
                disabled={i === 0}
                onClick={() => moveItem(i, 'UP')}
                className="p-1 rounded bg-[#0B132B] hover:bg-[#111C35] disabled:opacity-30 text-[#38BDF8]"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={i === navItems.length - 1}
                onClick={() => moveItem(i, 'DOWN')}
                className="p-1 rounded bg-[#0B132B] hover:bg-[#111C35] disabled:opacity-30 text-[#38BDF8]"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
