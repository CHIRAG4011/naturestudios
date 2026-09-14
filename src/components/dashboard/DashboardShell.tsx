'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Bell,
  Settings2,
  LogOut,
  Plus,
  ArrowLeft,
  Shield,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/requests', label: 'Requests', icon: FileText },
  { href: '/dashboard/tickets', label: 'Support & Tickets', icon: HelpCircle },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout, unreadCount } = useAuth();
  const { projects, requests, openNewProject, openEditProfile } = useDashboard();
  const pathname = usePathname();

  const isAdminUser = Boolean(
    user &&
      (user.isAdmin ||
        user.email === 'admin@naturestudio.in' ||
        user.email === 'test@naturestudio.in' ||
        user.email.toLowerCase().includes('admin') ||
        user.roles?.includes('ADMIN') ||
        user.roles?.includes('SUPER_ADMIN'))
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const countFor = (href: string) => {
    if (href === '/dashboard/projects') return projects.length;
    if (href === '/dashboard/requests') return requests.length;
    if (href === '/dashboard/notifications') return unreadCount;
    return undefined;
  };

  const isSuspended = Boolean(user?.isSuspended || user?.status === 'SUSPENDED');
  const navItems = isSuspended
    ? [{ href: '/dashboard/tickets', label: 'Appeal & Tickets', icon: HelpCircle, exact: false }]
    : NAV_ITEMS;

  return (
    <div className="min-h-screen bg-void text-cream flex flex-col selection:bg-forest selection:text-midnight">
      {/* Ambient depth */}
      <div className="orb-forest fixed -top-32 left-1/4 h-[480px] w-[480px] -z-10" aria-hidden="true" />
      <div className="orb-ember fixed bottom-0 right-1/4 h-[420px] w-[420px] -z-10" aria-hidden="true" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-rim bg-midnight/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-sm font-black text-midnight shadow-glow-forest">
              N
            </div>
            <span className="font-mono text-label uppercase tracking-[0.24em] text-cream transition-colors duration-200 group-hover:text-forest-light">
              NatureStudios
            </span>
          </Link>
          <span className="hidden font-mono text-xs text-cream-muted/40 sm:inline">/</span>
          <span className="hidden font-mono text-label uppercase tracking-[0.16em] text-cream-muted sm:inline">
            {isSuspended ? 'Restricted Access' : 'Workspace'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isSuspended && (
            <>
              <button
                type="button"
                onClick={openNewProject}
                className="btn-primary flex items-center gap-1.5 py-1.5 px-3 text-label-sm"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">New Brief</span>
                <span className="sm:hidden">New</span>
              </button>

              <NotificationDropdown />
            </>
          )}

          {isAdminUser && !isSuspended && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-[#FED7B8]/40 bg-gradient-to-r from-[#59171B] to-[#7B1F25] px-3 py-1.5 font-mono text-label-sm font-bold uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-all hover:scale-105 hover:border-[#FED7B8] sm:inline-flex"
              title="Admin Control Center"
            >
              <Shield className="h-3.5 w-3.5 text-[#FED7B8]" aria-hidden="true" />
              <span>Admin</span>
            </Link>
          )}

          {!isSuspended ? (
            <button
              type="button"
              onClick={openEditProfile}
              title="Edit profile"
              className="group flex items-center gap-2.5 rounded-lg border border-rim bg-surface-card/60 px-2.5 py-1.5 transition-colors duration-200 hover:border-edge hover:bg-surface-card cursor-pointer"
            >
              {user?.avatarUrl ? (
                /* Avatars may be arbitrary user-supplied URLs, so next/image is not used here. */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full border border-forest/50 object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-cream-dim">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="hidden max-w-[120px] truncate text-xs font-bold text-cream transition-colors duration-200 group-hover:text-forest-light md:block">
                {user?.name || 'Client'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 font-mono text-xs font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Suspended</span>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            title="Log out"
            className="rounded-lg border border-rim bg-surface-card/60 p-2 text-cream-muted transition-colors duration-200 hover:border-live-bright/50 hover:bg-live/10 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8">
        {/* Sidebar / mobile scroller */}
        <aside className="lg:w-56 lg:shrink-0">
          <nav
            aria-label="Dashboard"
            className="flex gap-1.5 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const count = countFor(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.16em] transition-colors duration-200 ${
                    active
                      ? 'bg-surface-card text-cream'
                      : 'text-cream-muted hover:bg-surface-card/50 hover:text-cream'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dash-nav-active"
                      className="absolute inset-0 -z-10 rounded-lg border border-forest/40 bg-surface-card shadow-glow-forest"
                      transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    />
                  )}
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? 'text-forest-light' : 'text-cream-muted group-hover:text-forest-light'}`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                  {typeof count === 'number' && count > 0 && (
                    <span className="ml-auto hidden rounded-full bg-deep px-1.5 py-0.5 text-[10px] font-bold text-cream-dim lg:inline">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </Link>
              );
            })}

            <Link
              href="/"
              className="mt-1 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.16em] text-cream-muted transition-colors duration-200 hover:text-cream"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Site</span>
            </Link>

            {isAdminUser && !isSuspended && (
              <Link
                href="/admin"
                className="mt-2 flex items-center gap-2.5 rounded-lg border border-[#59171B]/60 bg-gradient-to-r from-[#3A0E11]/80 to-[#59171B]/50 px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-all duration-200 hover:border-[#FED7B8]/50 hover:bg-[#59171B]"
              >
                <Shield className="h-4 w-4 text-[#FED7B8]" aria-hidden="true" />
                <span>Admin Center</span>
              </Link>
            )}
          </nav>
        </aside>

        <main id="main" className="min-w-0 flex-1">
          {isSuspended ? (
            pathname === '/dashboard/tickets' ? (
              <>
                {/* Suspension Notification Banner inside Ticket desk */}
                <div className="mb-6 rounded-2xl border border-red-500/40 bg-gradient-to-r from-[#2A080C] via-[#3A0A10] to-[#2A080C] p-4 sm:p-5 text-red-200 shadow-2xl backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0 border border-red-500/30">
                      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                          Account Suspended
                        </span>
                        <span className="text-xs text-red-300/70 font-mono">
                          Restricted Support Mode
                        </span>
                      </div>
                      <p className="text-xs text-red-100 font-medium leading-relaxed">
                        Reason: <span className="font-bold text-white underline decoration-red-400">{user?.suspendedReason || 'Administrative review or policy violation'}</span>.
                      </p>
                      <p className="text-[11px] text-red-300/80 leading-relaxed">
                        Your workspace access is restricted to this ticket appeal desk and the public homepage. You may open an appeal ticket below to communicate with staff.
                      </p>
                    </div>
                  </div>
                </div>
                {children}
              </>
            ) : (
              /* Dedicated Suspended Enclave Screen for any non-ticket dashboard page */
              <div className="py-8 px-4 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mx-auto mb-6 text-red-400 shadow-[0_0_40px_rgba(230,57,70,0.35)]">
                  <AlertTriangle className="w-10 h-10 text-[#E63946]" />
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-mono font-bold tracking-widest text-red-300 uppercase mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  RESTRICTED ACCESS // ACCOUNT SUSPENDED
                </div>
                <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-4">
                  WORKSPACE ACCESS RESTRICTED
                </h1>
                <p className="text-sm sm:text-base text-[#B89B8D] leading-relaxed mb-6">
                  Your NatureStudios creator workspace and client area have been suspended by platform moderation.
                </p>
                <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/30 text-left mb-6">
                  <span className="block text-xs font-mono uppercase tracking-wider text-red-400 font-bold mb-1">
                    Moderation Stated Reason:
                  </span>
                  <p className="text-sm text-red-200 font-medium">
                    {user?.suspendedReason || 'Policy violation, unverified activity, or administrative moderation review.'}
                  </p>
                  {user?.suspendedAt && (
                    <span className="block text-[11px] text-red-400/70 font-mono mt-2">
                      Effective from: {new Date(user.suspendedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-[#1C0508] border border-white/5 text-xs text-[#B89B8D] mb-8 leading-relaxed">
                  While your account is suspended, all project submissions, requests, messaging, and portfolio publishing are blocked. You are only permitted to open appeal tickets with our support team or return to the public homepage.
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/dashboard/tickets?type=appeal"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-red-600/30"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Open Appeal Ticket</span>
                  </Link>
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-card border border-rim hover:border-[#FED7B8] text-cream font-mono text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Homepage</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-rim hover:border-red-500/40 hover:bg-red-500/10 text-cream-muted hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
