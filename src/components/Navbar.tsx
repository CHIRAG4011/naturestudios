'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, Search, Shield, Sparkles, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from '@/context/CommandPaletteContext';

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const { user, openSqueeze } = useAuth();
  const { open: openPalette } = useCommandPalette();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminUser = Boolean(
    user &&
      (user.isAdmin ||
        user.email === 'admin@naturestudio.in' ||
        user.email === 'test@naturestudio.in' ||
        user.email.toLowerCase().includes('admin') ||
        user.roles?.includes('ADMIN') ||
        user.roles?.includes('SUPER_ADMIN'))
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-[#52141A] bg-[#240709]/85 py-3 shadow-xl backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NatureStudios home">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#59171B] border border-[#FED7B8]/40 text-base font-black text-[#FED7B8] shadow-glow-burgundy transition-transform duration-300 group-hover:scale-105">
              N
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-black uppercase leading-tight tracking-wider text-[#FFF5ED] transition-colors duration-300 group-hover:text-[#FED7B8]">
                NatureStudios
              </span>
              <span className="font-mono text-[9px] uppercase leading-none tracking-[0.22em] text-[#FED7B8]/70">
                ESPORTS • CREATIVE • DIGITAL
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? 'text-[#FED7B8]' : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  {active && !reduced && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-lg border border-[#59171B] bg-[#3A0E11]/60"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  {active && reduced && (
                    <span className="absolute inset-0 -z-10 rounded-lg border border-[#59171B] bg-[#3A0E11]/60" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="group inline-flex items-center gap-2 rounded-lg border border-[#52141A] bg-[#240709] px-3 py-2 text-[#B89B8D] transition-colors duration-200 hover:border-[#FED7B8] hover:text-[#FFF5ED] cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-[#FED7B8]" aria-hidden="true" />
              <kbd className="font-mono text-[10px] uppercase tracking-[0.16em]">⌘K</kbd>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdminUser && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#FED7B8]/40 bg-gradient-to-r from-[#59171B] to-[#7B1F25] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-all hover:scale-105 hover:border-[#FED7B8]"
                    title="Admin Control Center"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#FED7B8]" aria-hidden="true" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#52141A] bg-[#2D0A0E] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-colors duration-200 hover:bg-[#3A0E11]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#18A957]" aria-hidden="true" />
                  <span>Dashboard</span>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="ml-1 h-4 w-4 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="ml-0.5 h-3.5 w-3.5 text-[#FED7B8]" aria-hidden="true" />
                  )}
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openSqueeze('login')}
                  className="rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#B89B8D] transition-colors duration-200 hover:text-[#FFF5ED] cursor-pointer"
                >
                  Sign In
                </button>
                <Link
                  href="/contact"
                  className="btn-primary text-xs py-2 px-4 shadow-glow-burgundy"
                >
                  <span>Start A Project</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FED7B8]" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="rounded-lg border border-[#52141A] bg-[#240709] p-2 text-[#FED7B8] cursor-pointer"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="rounded-lg border border-[#52141A] bg-[#240709] p-2 text-[#FED7B8] cursor-pointer"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-[#1C0507] lg:hidden"
          >
            {/* Burgundy Atmosphere */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-radial from-[#59171B]/50 to-transparent blur-3xl pointer-events-none" />

            <div className="px-6 py-6 flex items-center justify-between border-b border-[#3D0D13]">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FED7B8]">
                NATURESTUDIOS // MENU
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                autoFocus
                className="rounded-lg border border-[#52141A] bg-[#240709] p-2 text-[#FED7B8] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="px-6 flex flex-1 flex-col justify-center gap-2 pb-10 relative z-10"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="group flex items-baseline justify-between border-b border-[#3D0D13] py-4"
                  >
                    <span
                      className={`text-2xl sm:text-3xl font-black uppercase leading-none tracking-tight transition-colors duration-200 ${
                        isActive(item.href) ? 'text-[#FED7B8]' : 'text-[#FFF5ED] group-hover:text-[#FED7B8]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#B89B8D]">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="btn-primary justify-center text-xs py-3.5"
                >
                  <span>Start A Project</span>
                  <ArrowRight className="h-4 w-4 text-[#FED7B8]" />
                </Link>

                {user ? (
                  <div className="flex flex-col gap-2.5">
                    {isAdminUser && (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#FED7B8]/40 bg-gradient-to-r from-[#59171B] to-[#7B1F25] px-4 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-[#FED7B8] shadow-glow-burgundy transition-all"
                      >
                        <Shield className="h-4 w-4 text-[#FED7B8]" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="btn-secondary justify-center text-xs py-3.5"
                    >
                      <span>Dashboard Command Center</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        openSqueeze('login');
                      }}
                      className="btn-secondary justify-center text-xs py-3"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        openSqueeze('register');
                      }}
                      className="btn-beige justify-center text-xs py-3"
                    >
                      Join Studio
                    </button>
                  </div>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
