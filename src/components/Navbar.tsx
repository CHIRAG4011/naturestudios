'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Globe, Menu, Search, Shield, Sparkles, User as UserIcon, X, Instagram, Mail } from 'lucide-react';
import { DiscordIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';
import { useAuth } from '@/context/AuthContext';
import { useCommandPalette } from '@/context/CommandPaletteContext';

const NAV_ITEMS = [
  { label: 'Cinema', href: '/cinema' },
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
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
            ? 'border-b border-[#1E3A8A] bg-[#0B132B]/85 py-3 shadow-xl backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="NatureStudios home">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F1D38] border border-[#1E3A8A] p-1.5 shadow-glow-burgundy transition-transform duration-300 group-hover:scale-105 group-hover:border-[#38BDF8]/50">
              <Image
                src="/logo.png"
                alt="NatureStudios Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]"
                priority
              />
            </div>
            <span className="flex flex-col">
              <span className="text-sm font-black uppercase leading-tight tracking-wider text-[#F8FAFC] transition-colors duration-300 group-hover:text-[#38BDF8]">
                NatureStudios
              </span>
              <span className="font-mono text-[9px] uppercase leading-none tracking-[0.22em] text-[#38BDF8]/70">
                ESPORTS • CREATIVE • DIGITAL
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              if (item.label === 'Portfolio') {
                const portfolioActive = isActive('/portfolio') || isActive('/global-portfolio');
                return (
                  <div
                    key="portfolio-dropdown"
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                      setPortfolioOpen(true);
                    }}
                    onMouseLeave={() => {
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setPortfolioOpen(false);
                      }, 200);
                    }}
                  >
                    <Link
                      href="/portfolio"
                      aria-current={portfolioActive ? 'page' : undefined}
                      className={`relative inline-flex items-center gap-1 rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                        portfolioActive ? 'text-[#38BDF8]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {portfolioActive && !reduced && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-lg border border-[#2563EB] bg-[#1E40AF]/60"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                      {portfolioActive && reduced && (
                        <span className="absolute inset-0 -z-10 rounded-lg border border-[#2563EB] bg-[#1E40AF]/60" />
                      )}
                      <span>Portfolio</span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          portfolioOpen ? 'rotate-180 text-[#38BDF8]' : 'text-[#94A3B8]'
                        }`}
                      />
                    </Link>

                    {/* Popover Dropdown */}
                    <AnimatePresence>
                      {portfolioOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-[#1E3A8A] bg-[#1E0507]/95 p-2 shadow-2xl backdrop-blur-xl z-50"
                        >
                          <Link
                            href="/portfolio"
                            onClick={() => setPortfolioOpen(false)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                              isActive('/portfolio')
                                ? 'bg-[#1E40AF] border border-[#38BDF8]/30'
                                : 'hover:bg-[#0F1D38] border border-transparent'
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/50 border border-[#38BDF8]/20 text-[#38BDF8] group-hover:scale-105 transition-transform">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F8FAFC] group-hover:text-[#38BDF8]">
                                  Studio Portfolio
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
                                  STUDIO
                                </span>
                              </div>
                              <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">
                                Official studio work — GFX tournaments & VFX reels
                              </p>
                            </div>
                          </Link>

                          <div className="my-1 border-t border-[#172554]" />

                          <Link
                            href="/global-portfolio"
                            onClick={() => setPortfolioOpen(false)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition-all ${
                              isActive('/global-portfolio')
                                ? 'bg-[#1E40AF] border border-[#38BDF8]/30'
                                : 'hover:bg-[#0F1D38] border border-transparent'
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B132B] border border-[#1E3A8A] text-[#38BDF8] group-hover:scale-105 transition-transform">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F8FAFC] group-hover:text-[#38BDF8]">
                                  Global Portfolio
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#030712] text-[#94A3B8] border border-[#172554]">
                                  COMMUNITY
                                </span>
                              </div>
                              <p className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">
                                Community member directory & user portfolios
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? 'text-[#38BDF8]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {active && !reduced && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-lg border border-[#2563EB] bg-[#1E40AF]/60"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  {active && reduced && (
                    <span className="absolute inset-0 -z-10 rounded-lg border border-[#2563EB] bg-[#1E40AF]/60" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <div className="flex items-center gap-1.5">
              <a
                href="https://discord.gg/PTVReHZp4n"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NatureStudios Discord Community"
                title="Join NatureStudios Discord Community"
                className="group inline-flex items-center justify-center rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#94A3B8] transition-all duration-200 hover:border-indigo-500/50 hover:text-indigo-400 cursor-pointer"
              >
                <DiscordIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <a
                href="https://wa.me/917480066539"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NatureStudios WhatsApp"
                title="Chat on WhatsApp: +91 7480 066 539"
                className="group inline-flex items-center justify-center rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#94A3B8] transition-all duration-200 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <a
                href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NatureStudios Instagram"
                title="Follow @naturestudio.in on Instagram"
                className="group inline-flex items-center justify-center rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#94A3B8] transition-all duration-200 hover:border-pink-500/50 hover:text-pink-400 cursor-pointer"
              >
                <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="group inline-flex items-center gap-2 rounded-lg border border-[#1E3A8A] bg-[#0B132B] px-3 py-2 text-[#94A3B8] transition-colors duration-200 hover:border-[#38BDF8] hover:text-[#F8FAFC] cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
              <kbd className="font-mono text-[10px] uppercase tracking-[0.16em]">⌘K</kbd>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdminUser && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#38BDF8]/40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#38BDF8] shadow-glow-burgundy transition-all hover:scale-105 hover:border-[#38BDF8]"
                    title="Admin Control Center"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1E3A8A] bg-[#0F1D38] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#38BDF8] shadow-glow-burgundy transition-colors duration-200 hover:bg-[#1E40AF]"
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
                    <UserIcon className="ml-0.5 h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                  )}
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openSqueeze('login')}
                  className="rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#94A3B8] transition-colors duration-200 hover:text-[#F8FAFC] cursor-pointer"
                >
                  Sign In
                </button>
                <Link
                  href="/contact"
                  className="btn-primary text-xs py-2 px-4 shadow-glow-burgundy"
                >
                  <span>Start A Project</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#38BDF8]" />
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
              className="rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#38BDF8] cursor-pointer"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#38BDF8] cursor-pointer"
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
            className="fixed inset-0 z-50 flex flex-col bg-[#050B17] lg:hidden"
          >
            {/* Burgundy Atmosphere */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-radial from-[#2563EB]/50 to-transparent blur-3xl pointer-events-none" />

            <div className="px-6 py-6 flex items-center justify-between border-b border-[#172554]">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#38BDF8]">
                NATURESTUDIOS // MENU
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                autoFocus
                className="rounded-lg border border-[#1E3A8A] bg-[#0B132B] p-2 text-[#38BDF8] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="px-6 flex flex-1 flex-col justify-center gap-2 pb-10 relative z-10"
            >
              {NAV_ITEMS.map((item, i) => {
                if (item.label === 'Portfolio') {
                  return (
                    <motion.div
                      key="mobile-portfolio-group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE }}
                      className="border-b border-[#172554] py-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#94A3B8]">
                          PORTFOLIO SYSTEM
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                          0{i + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pl-2">
                        <Link
                          href="/portfolio"
                          onClick={closeMenu}
                          className="flex items-center justify-between py-1.5 group"
                        >
                          <span
                            className={`text-xl font-black uppercase tracking-tight transition-colors duration-200 ${
                              isActive('/portfolio')
                                ? 'text-[#38BDF8]'
                                : 'text-[#F8FAFC] group-hover:text-[#38BDF8]'
                            }`}
                          >
                            Studio Portfolio
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
                            OFFICIAL
                          </span>
                        </Link>
                        <Link
                          href="/global-portfolio"
                          onClick={closeMenu}
                          className="flex items-center justify-between py-1.5 group"
                        >
                          <span
                            className={`text-xl font-black uppercase tracking-tight transition-colors duration-200 ${
                              isActive('/global-portfolio')
                                ? 'text-[#38BDF8]'
                                : 'text-[#F8FAFC] group-hover:text-[#38BDF8]'
                            }`}
                          >
                            Global Portfolio
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#030712] text-[#94A3B8] border border-[#172554]">
                            CREATORS
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="group flex items-baseline justify-between border-b border-[#172554] py-4"
                    >
                      <span
                        className={`text-2xl sm:text-3xl font-black uppercase leading-none tracking-tight transition-colors duration-200 ${
                          isActive(item.href) ? 'text-[#38BDF8]' : 'text-[#F8FAFC] group-hover:text-[#38BDF8]'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

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
                  <ArrowRight className="h-4 w-4 text-[#38BDF8]" />
                </Link>

                {user ? (
                  <div className="flex flex-col gap-2.5">
                    {isAdminUser && (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#38BDF8]/40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-[#38BDF8] shadow-glow-burgundy transition-all"
                      >
                        <Shield className="h-4 w-4 text-[#38BDF8]" />
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

                {/* Mobile Direct Contact Channels */}
                <div className="pt-4 mt-2 border-t border-[#172554] flex flex-col gap-2 font-mono text-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#94A3B8]">
                    Direct Support &amp; Community
                  </span>
                  <a
                    href="mailto:naturestudio05@gmail.com"
                    className="flex items-center gap-2 text-[#38BDF8] hover:text-[#F8FAFC] transition-colors py-1"
                    title="Send email to naturestudio05@gmail.com"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                    <span>naturestudio05@gmail.com</span>
                  </a>
                  <a
                    href="https://wa.me/917480066539"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors py-1"
                    title="WhatsApp: +91 7480 066 539"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>+91 7480 066 539 (WhatsApp)</span>
                  </a>
                  <a
                    href="https://discord.gg/PTVReHZp4n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors py-1"
                    title="Discord Community"
                  >
                    <DiscordIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>Join Discord Community</span>
                  </a>
                  <a
                    href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-300 hover:text-white transition-colors py-1"
                    title="Instagram @naturestudio.in"
                  >
                    <Instagram className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span>@naturestudio.in (Instagram)</span>
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
