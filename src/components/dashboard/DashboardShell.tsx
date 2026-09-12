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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/requests', label: 'Requests', icon: FileText },
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
            <span className="text-sm font-black uppercase tracking-[0.14em] text-cream transition-colors duration-200 group-hover:text-forest-light">
              NatureStudios
            </span>
          </Link>

          <span className="hidden h-4 w-px bg-rim sm:block" />

          <div className="hidden items-center gap-1.5 font-mono text-label-sm uppercase tracking-[0.2em] text-cream-muted sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-bright" aria-hidden="true" />
            <span>Client Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openNewProject}
            className="hidden items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 font-mono text-label-sm font-bold uppercase tracking-[0.16em] text-midnight transition-colors duration-200 hover:bg-forest-light sm:inline-flex cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>New Brief</span>
          </button>

          <NotificationDropdown />

          {isAdminUser && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-[#FED7B8]/40 bg-gradient-to-r from-[#59171B] to-[#7B1F25] px-3 py-1.5 font-mono text-label-sm font-bold uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-all hover:scale-105 hover:border-[#FED7B8] sm:inline-flex"
              title="Admin Control Center"
            >
              <Shield className="h-3.5 w-3.5 text-[#FED7B8]" aria-hidden="true" />
              <span>Admin</span>
            </Link>
          )}

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
            {NAV_ITEMS.map((item) => {
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
              className="mt-1 hidden items-center gap-2.5 rounded-lg px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.16em] text-cream-muted transition-colors duration-200 hover:text-cream lg:flex"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Site</span>
            </Link>

            {isAdminUser && (
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
          {children}
        </main>
      </div>
    </div>
  );
}
