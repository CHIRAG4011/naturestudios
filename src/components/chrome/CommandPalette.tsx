'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Building2,
  CornerDownLeft,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Scale,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { PROJECTS } from '@/data/site';

interface Command {
  id: string;
  label: string;
  group: string;
  icon: React.ElementType;
  /** Extra words matched by the filter but not displayed. */
  keywords?: string;
  href?: string;
  run?: () => void;
}

/**
 * Ctrl/Cmd+K palette. Everything it exposes is a real route or a real action —
 * there are no placeholder entries.
 */
export function CommandPalette() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOpen: open, close } = useCommandPalette();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // ------------------------------------------------------------ command source
  const commands = useMemo<Command[]>(() => {
    const site: Command[] = [
      { id: 'home', label: 'Home', group: 'Navigate', icon: Home, href: '/' },
      { id: 'work', label: 'Selected Work', group: 'Navigate', icon: FolderKanban, href: '/work', keywords: 'portfolio projects reel case studies' },
      { id: 'services', label: 'Services', group: 'Navigate', icon: Wrench, href: '/services', keywords: 'capabilities offering what we do' },
      { id: 'studio', label: 'The Studio', group: 'Navigate', icon: Building2, href: '/studio', keywords: 'facility team space' },
      { id: 'about', label: 'About', group: 'Navigate', icon: Sparkles, href: '/about', keywords: 'story manifesto who we are' },
      { id: 'contact', label: 'Start a Project', group: 'Navigate', icon: Mail, href: '/contact', keywords: 'brief enquiry get in touch hire' },
    ];

    const caseStudies: Command[] = PROJECTS.map((project) => ({
      id: `work-${project.id}`,
      label: project.title,
      group: 'Case Studies',
      icon: ArrowRight,
      keywords: `${project.category} ${project.year}`,
      href: `/work/${project.id}`,
    }));

    const account: Command[] = user
      ? [
          { id: 'dashboard', label: 'Dashboard Overview', group: 'Account', icon: LayoutDashboard, href: '/dashboard' },
          { id: 'dash-projects', label: 'My Projects', group: 'Account', icon: FolderKanban, href: '/dashboard/projects' },
          { id: 'dash-requests', label: 'My Requests', group: 'Account', icon: FileText, href: '/dashboard/requests' },
          { id: 'dash-messages', label: 'Messages', group: 'Account', icon: MessageSquare, href: '/dashboard/messages' },
          { id: 'dash-notifications', label: 'Notifications', group: 'Account', icon: Bell, href: '/dashboard/notifications' },
          { id: 'dash-settings', label: 'Settings', group: 'Account', icon: Settings2, href: '/dashboard/settings' },
          {
            id: 'logout',
            label: 'Log Out',
            group: 'Account',
            icon: LogOut,
            keywords: 'sign out exit',
            run: () => {
              void logout();
            },
          },
        ]
      : [
          { id: 'login', label: 'Log In', group: 'Account', icon: LogIn, href: '/login', keywords: 'sign in' },
          { id: 'register', label: 'Create an Account', group: 'Account', icon: UserPlus, href: '/register', keywords: 'sign up join' },
        ];

    const legal: Command[] = [
      { id: 'privacy', label: 'Privacy Policy', group: 'Legal', icon: ShieldCheck, href: '/privacy' },
      { id: 'terms', label: 'Terms of Service', group: 'Legal', icon: Scale, href: '/terms' },
    ];

    return [...site, ...caseStudies, ...account, ...legal];
  }, [user, logout]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.keywords ?? ''}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group while preserving the original ordering of each group's first hit.
  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    results.forEach((command) => {
      const bucket = map.get(command.group);
      if (bucket) bucket.push(command);
      else map.set(command.group, [command]);
    });
    return Array.from(map.entries());
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  // ------------------------------------------------------- open / close effects
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    setQuery('');
    setActiveIndex(0);

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 40);
    const restore = previouslyFocused.current;

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
      restore?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the highlighted row inside the scroll container.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const select = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      close();
      if (command.href) router.push(command.href);
      else command.run?.();
    },
    [router, close]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      select(flat[activeIndex]);
    }
  };

  let cursor = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="cmd-palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onKeyDown}
          >
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-rim px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-forest-light" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, work, account…"
                aria-label="Search commands"
                aria-controls="cmd-results"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream-muted/70 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-rim px-1.5 py-0.5 font-mono text-label-sm text-cream-muted sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              id="cmd-results"
              role="listbox"
              aria-label="Commands"
              className="max-h-[min(52vh,420px)] overflow-y-auto py-2"
            >
              {flat.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-cream-muted">
                  No matches for “{query}”.
                </p>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <p className="px-4 pb-1.5 pt-2 font-mono text-label-sm uppercase tracking-[0.2em] text-cream-muted/70">
                      {group}
                    </p>
                    {items.map((command) => {
                      cursor += 1;
                      const index = cursor;
                      const isActive = index === activeIndex;
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => select(command)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 cursor-pointer ${
                            isActive ? 'bg-surface-hover text-cream' : 'text-cream-dim hover:text-cream'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${isActive ? 'text-forest-bright' : 'text-cream-muted'}`}
                            aria-hidden="true"
                          />
                          <span className="flex-1 truncate text-xs font-medium">{command.label}</span>
                          {isActive && (
                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-cream-muted" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer legend */}
            <div className="flex items-center justify-between border-t border-rim bg-deep/60 px-4 py-2.5 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
              <span>NatureStudios</span>
              <span className="hidden sm:inline">↑ ↓ to navigate · ↵ to open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
