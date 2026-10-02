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
              Public Navigation Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Header & Mobile Menu
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Reorder public navigation items, toggle visibility, and validate destination routes.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('navigation.edit')) && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#FED7B8]" />
            <span>Save Menu</span>
          </button>
        )}
      </div>

      {/* Nav Items List */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-3 max-w-2xl">
        {navItems.map((item, i) => (
          <div
            key={item.href}
            className="p-3.5 rounded-xl bg-[#150304] border border-[#3D0D13] flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#FED7B8] font-bold">0{i + 1}</span>
              <span className="font-semibold text-[#FFF5ED]">{item.label}</span>
              <span className="font-mono text-[10px] text-[#B89B8D]">{item.href}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleVisibility(i)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  item.visible
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-[#240709] text-[#B89B8D]'
                }`}
              >
                {item.visible ? 'VISIBLE' : 'HIDDEN'}
              </button>

              <button
                disabled={i === 0}
                onClick={() => moveItem(i, 'UP')}
                className="p-1 rounded bg-[#240709] hover:bg-[#320B0F] disabled:opacity-30 text-[#FED7B8]"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={i === navItems.length - 1}
                onClick={() => moveItem(i, 'DOWN')}
                className="p-1 rounded bg-[#240709] hover:bg-[#320B0F] disabled:opacity-30 text-[#FED7B8]"
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
