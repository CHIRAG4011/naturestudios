'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import CommandPalette from './CommandPalette';
import { ShieldAlert, Lock, ArrowLeft, RefreshCw, LogIn } from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { loading, unauthorized, unauthorizedMessage, refreshAdmin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#150304] flex flex-col items-center justify-center p-6 text-center text-[#FFF5ED]">
        <div className="relative w-14 h-14 rounded-2xl bg-[#2D0A0E] border border-[#52141A] p-2.5 flex items-center justify-center shadow-2xl animate-pulse mb-4">
          <Image
            src="/logo.png"
            alt="NatureStudios Logo"
            width={44}
            height={44}
            className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,107,0,0.6)]"
            priority
          />
        </div>
        <div className="font-syne text-lg font-bold tracking-wider text-[#FED7B8]">
          NATURESTUDIOS ADMIN CONTROL CENTER
        </div>
        <div className="text-xs font-mono text-[#B89B8D] mt-1 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FED7B8]" />
          <span>Verifying cryptographic clearance & administrative tokens...</span>
        </div>
      </div>
    );
  }

  // 403 Forbidden Screen
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-[#120203] flex items-center justify-center p-4 sm:p-6 text-[#FFF5ED]">
        <div className="w-full max-w-lg bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#59171B]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-[#59171B]/40 border border-[#E63946]/40 flex items-center justify-center mx-auto text-[#E63946] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30">
              403 — ADMIN ACCESS REQUIRED
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Administrative Clearance Restricted
            </h1>
            <p className="text-xs sm:text-sm text-[#B89B8D] max-w-md mx-auto leading-relaxed">
              {unauthorizedMessage ||
                'This control center is exclusively restricted to NatureStudios system administrators, studio leads, and permitted staff. Your active account lacks the required RBAC credentials.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#150304] border border-[#3D0D13] text-left text-xs space-y-2 font-mono text-[#B89B8D]">
            <div className="flex items-center justify-between text-[#FED7B8]">
              <span>ENCLAVE_POLICY</span>
              <span className="text-[#E63946]">DENIED_BY_RBAC</span>
            </div>
            <div>STATUS: Authenticated session does not possess staff permission.</div>
            <div>ACTION: Contact super-administrator to request staff clearance.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#240709] hover:bg-[#2C090C] border border-[#3D0D13] text-xs font-semibold text-[#FFF5ED] flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Site</span>
            </Link>
            <Link
              href="/login?redirect=/admin"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4 text-[#FED7B8]" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
