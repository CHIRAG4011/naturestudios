'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';
import {
  Search,
  Bell,
  Activity,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  LayoutDashboard,
} from 'lucide-react';

export default function AdminTopbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const router = useRouter();
  const { user, roles, isSuperAdmin, environment, setShowCommandPalette, systemHealth } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
  };

  const primaryRole = isSuperAdmin ? 'SUPER_ADMIN' : roles[0] || 'ADMIN';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#030712]/90 backdrop-blur-md border-b border-[#172554]">
      {/* Left side: Hamburger for mobile + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-[#030712] shadow-md">
            NS
          </div>
          <div className="hidden sm:block">
            <span className="font-syne font-bold text-sm tracking-wider text-[#F8FAFC]">
              NATURESTUDIOS
            </span>
            <span className="ml-2 text-[10px] uppercase font-mono tracking-widest text-[#38BDF8] px-1.5 py-0.5 rounded bg-[#2563EB]/50 border border-[#38BDF8]/20">
              CONTROL CENTER
            </span>
          </div>
        </div>

        {/* Environment Pill */}
        <div className="hidden md:flex items-center ml-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider ${
              environment === 'PRODUCTION'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
            {environment}
          </span>
        </div>
      </div>

      {/* Center: Search trigger / Command Palette */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={() => setShowCommandPalette(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0B132B] hover:bg-[#2C090C] border border-[#172554] hover:border-[#2563EB] text-xs text-[#94A3B8] transition-all group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#38BDF8]/60 group-hover:text-[#38BDF8]" />
            <span>Search users, portfolios, logs...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#030712] border border-[#172554] rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: System status, Notifications, Profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="sm:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] rounded-lg transition-colors"
          aria-label="Open Command Palette"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Live System Health Badge */}
        <Link
          href="/admin/system"
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0B132B] border border-[#172554] hover:border-[#2563EB] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title="System Health"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Atlas {systemHealth.mongo?.latencyMs ? `${systemHealth.mongo.latencyMs}ms` : 'OPERATIONAL'}</span>
        </Link>

        {/* Workspace Link */}
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[#38BDF8]/80 hover:text-[#38BDF8] hover:bg-[#2563EB]/30 border border-transparent hover:border-[#38BDF8]/20 transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Workspace</span>
        </Link>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[#38BDF8]/80 hover:text-[#38BDF8] hover:bg-[#2563EB]/30 border border-transparent hover:border-[#38BDF8]/20 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E63946]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#070D1E] border border-[#172554] rounded-xl shadow-2xl p-3 z-50 text-xs text-[#F8FAFC] animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#172554]">
                <span className="font-semibold text-[#38BDF8]">System Notifications</span>
                <span className="text-[10px] text-[#94A3B8]">Realtime</span>
              </div>
              <div className="py-3 space-y-2">
                <div className="p-2 rounded bg-[#0B132B] border border-[#172554] text-[11px]">
                  <div className="font-medium text-[#38BDF8]">Administrative Enclave Active</div>
                  <div className="text-[#94A3B8] mt-0.5">Continuous audit trail logging is enabled.</div>
                </div>
                <div className="p-2 rounded bg-[#0B132B] border border-[#172554] text-[11px]">
                  <div className="font-medium text-emerald-400">Database Synchronized</div>
                  <div className="text-[#94A3B8] mt-0.5">MongoDB Atlas latency within normal bounds.</div>
                </div>
              </div>
              <Link
                href="/admin/notifications"
                onClick={() => setShowNotifications(false)}
                className="block text-center pt-2 text-[11px] text-[#38BDF8] hover:underline"
              >
                Manage Broadcasts →
              </Link>
            </div>
          )}
        </div>

        {/* Profile Card & Role Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#172554]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#8C2329] border border-[#38BDF8]/30 flex items-center justify-center font-bold text-xs text-[#F8FAFC]">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-[#F8FAFC] truncate max-w-[130px]">
              {user?.name || user?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-[#38BDF8]" />
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#38BDF8]/90">
                {primaryRole}
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-[#94A3B8] hover:text-[#E63946] hover:bg-[#0B132B] rounded-lg transition-colors ml-1"
          title="Sign Out of Admin Control Center"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
