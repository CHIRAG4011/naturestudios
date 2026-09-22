'use client';

import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { useAdmin } from './AdminContext';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  Compass,
  SearchCheck,
  Users,
  ShieldAlert,
  Key,
  Inbox,
  MessageSquare,
  Bell,
  Megaphone,
  Mail,
  Globe,
  Radio,
  Sliders,
  Flag,
  ShieldCheck,
  FileSpreadsheet,
  Cpu,
  Database,
  Archive,
  Wrench,
  Settings,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'analytics.view' },
      { label: 'Activity Feed', href: '/admin/activity', icon: Activity, permission: 'audit.view' },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { label: 'Studio Portfolio (GFX/VFX)', href: '/admin/studio-portfolio', icon: Sparkles, permission: 'content.view', badge: 'GFX/VFX' },
      { label: 'Site Content CMS', href: '/admin/content', icon: FileText, permission: 'content.view' },
      { label: 'Global Theme Studio', href: '/admin/theme', icon: Sliders, permission: 'theme.view', badge: 'v2' },
      { label: 'Studio Projects', href: '/admin/projects', icon: Briefcase, permission: 'projects.view' },
      { label: 'Global User Portfolios', href: '/admin/portfolios', icon: Layers, permission: 'portfolios.view', badge: 'User' },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon, permission: 'media.view' },
      { label: 'Navigation Menu', href: '/admin/navigation', icon: Compass, permission: 'navigation.view' },
      { label: 'SEO & Redirects', href: '/admin/seo', icon: SearchCheck, permission: 'seo.view' },
    ],
  },
  {
    group: 'USERS & ACCESS',
    items: [
      { label: 'User Directory', href: '/admin/users', icon: Users, permission: 'users.view' },
      { label: 'RBAC Roles', href: '/admin/roles', icon: ShieldAlert, permission: 'roles.view' },
      { label: '50+ Permissions', href: '/admin/permissions', icon: Key, permission: 'permissions.view' },
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [
      { label: 'Project Requests', href: '/admin/project-requests', icon: Inbox, permission: 'requests.view' },
      { label: 'Studio Messages', href: '/admin/messages', icon: MessageSquare, permission: 'messages.view' },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell, permission: 'notifications.view' },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone, permission: 'announcements.view' },
      { label: 'Email Control', href: '/admin/email', icon: Mail, permission: 'email.view' },
      { label: 'Support Tickets', href: '/admin/support', icon: HelpCircle, permission: 'support.view' },
    ],
  },
  {
    group: 'PLATFORM',
    items: [
      { label: 'Domains & Wildcards', href: '/admin/domains', icon: Globe, permission: 'domains.view' },
      { label: 'Subdomains', href: '/admin/subdomains', icon: Radio, permission: 'subdomains.view' },
      { label: 'Feature Flags', href: '/admin/feature-flags', icon: Flag, permission: 'feature_flags.view' },
    ],
  },
  {
    group: 'SECURITY & AUDIT',
    items: [
      { label: 'Security Center', href: '/admin/security', icon: ShieldCheck, permission: 'security.view' },
      { label: 'Audit Trail', href: '/admin/audit-logs', icon: FileSpreadsheet, permission: 'audit.view' },
    ],
  },
  {
    group: 'SYSTEM & INFRA',
    items: [
      { label: 'System Health', href: '/admin/system', icon: Cpu, permission: 'system.view' },
      { label: 'MongoDB Atlas', href: '/admin/database', icon: Database, permission: 'database.view' },
      { label: 'Cloud Backups', href: '/admin/backups', icon: Archive, permission: 'backups.view' },
      { label: 'System Logs', href: '/admin/logs', icon: Activity, permission: 'logs.view' },
      { label: 'Maintenance Mode', href: '/admin/maintenance', icon: Wrench, permission: 'maintenance.view' },
      { label: 'Global Settings', href: '/admin/settings', icon: Settings, permission: 'settings.view' },
    ],
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin } = useAdmin();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#150304] border-r border-[#3D0D13] flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#3D0D13] bg-[#180406]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-[#2D0A0E] border border-[#52141A] p-1 flex items-center justify-center shadow-md">
              <NextImage
                src="/logo.png"
                alt="NatureStudios Logo"
                width={26}
                height={26}
                className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(255,107,0,0.4)]"
              />
            </div>
            <div>
              <div className="font-syne font-bold text-sm tracking-wider text-[#FFF5ED]">
                NATURESTUDIOS
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#FED7B8]/70">
                ADMIN ENCLAVE
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#B89B8D] hover:text-[#FFF5ED] rounded-lg hover:bg-[#240709]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-[#3D0D13]">
          {NAV_GROUPS.map((group) => {
            // Filter items by permission
            const visibleItems = group.items.filter(
              (item) => !item.permission || isSuperAdmin || hasPermission(item.permission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#FED7B8]/50">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-[#59171B] text-[#FFF5ED] shadow-sm font-semibold border border-[#FED7B8]/20'
                            : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#240709] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive ? 'text-[#FED7B8]' : 'text-[#B89B8D]/70 group-hover:text-[#FED7B8]'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#240709] text-[#FED7B8] border border-[#FED7B8]/20">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#3D0D13] bg-[#180406]/70 text-[11px] text-[#B89B8D] flex items-center justify-between">
          <span className="font-mono text-[10px]">v2.4 Production</span>
          <span className="text-[#FED7B8] text-[10px] uppercase font-mono">RBAC Active</span>
        </div>
      </aside>
    </>
  );
}
