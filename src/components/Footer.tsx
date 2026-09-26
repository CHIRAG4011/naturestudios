'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, Sparkles, Mail, Instagram } from 'lucide-react';
import { DiscordIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';

const EXPLORE_LINKS = [
  { label: 'Selected Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
  { label: 'GFX & Jersey Suite', href: '/portfolio/gfx' },
  { label: 'Clipping & VFX Hub', href: '/portfolio/vfx' },
  { label: 'Creator Directory', href: '/global-portfolio' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

export function Footer() {
  const { openSqueeze, user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#172554] bg-[#030712] text-[#F8FAFC]" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-[#0F1D38] border border-[#1E3A8A] p-1.5 flex items-center justify-center shadow-glow-burgundy group-hover:scale-105 group-hover:border-[#38BDF8]/50 transition-all duration-200">
                <Image
                  src="/logo.png"
                  alt="NatureStudios Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]"
                />
              </div>
              <span className="font-black tracking-wider text-base text-[#F8FAFC] uppercase group-hover:text-[#38BDF8] transition-colors duration-200">
                NatureStudios
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm font-light">
              Engineering the intersection of organic worldbuilding, stadium architecture, and high-velocity esports production worldwide.
            </p>

            {/* Direct Contact & Socials */}
            <div className="pt-2 space-y-2.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#38BDF8] block">
                Direct Contact &amp; Community
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="mailto:naturestudio05@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B132B] border border-[#1E3A8A] hover:border-[#38BDF8]/50 px-3 py-2 text-xs font-mono text-[#38BDF8] hover:text-[#F8FAFC] transition-all group"
                  title="Send email to naturestudio05@gmail.com"
                >
                  <Mail className="h-3.5 w-3.5 text-[#38BDF8] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">naturestudio05@gmail.com</span>
                </a>

                <a
                  href="https://wa.me/917480066539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B132B] border border-[#1E3A8A] hover:border-emerald-500/50 px-3 py-2 text-xs font-mono text-emerald-300 hover:text-white transition-all group"
                  title="WhatsApp: +91 7480 066 539"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>+91 7480 066 539</span>
                  <ArrowUpRight className="h-3 w-3 text-emerald-400/70 ml-auto shrink-0" />
                </a>

                <a
                  href="https://discord.gg/PTVReHZp4n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B132B] border border-[#1E3A8A] hover:border-indigo-500/50 px-3 py-2 text-xs font-mono text-indigo-300 hover:text-white transition-all group"
                  title="Join NatureStudios Discord Community"
                >
                  <DiscordIcon className="h-3.5 w-3.5 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>Discord Community</span>
                  <ArrowUpRight className="h-3 w-3 text-indigo-400/70 ml-auto shrink-0" />
                </a>

                <a
                  href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B132B] border border-[#1E3A8A] hover:border-pink-500/50 px-3 py-2 text-xs font-mono text-pink-300 hover:text-white transition-all group"
                  title="Follow NatureStudios on Instagram"
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>@naturestudio.in</span>
                  <ArrowUpRight className="h-3 w-3 text-pink-400/70 ml-auto shrink-0" />
                </a>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/contact"
                className="btn-primary text-xs py-2.5 px-4 shadow-glow-burgundy inline-flex items-center gap-2"
              >
                <span>Start A Project</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#38BDF8]" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8] block mb-4">
              Explore
            </span>
            <nav aria-label="Footer explore links">
              <ul className="space-y-2.5 text-xs font-mono">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Client Command Center */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8] block mb-4">
              Creator &amp; Client Portal
            </span>
            <ul className="space-y-2.5 text-xs font-mono">
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="text-[#38BDF8] hover:underline">
                      Workspace Dashboard →
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                      My Portfolio Subdomain
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/projects" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                      Production Projects
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => openSqueeze('login')}
                      className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer text-left"
                    >
                      Client Login
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openSqueeze('register')}
                      className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer text-left"
                    >
                      Register Workspace
                    </button>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-[#38BDF8] hover:underline">
                      Portfolio Platform →
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#172554]">
              <div className="badge-live">LIVE TRANSMISSION</div>
              <p className="text-[10px] font-mono text-[#94A3B8] mt-2 tracking-widest uppercase">
                PRODUCTION DOMAIN // NATURESTUDIO.IN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#172554] bg-[#0E0203]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#64748B]">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {year} NatureStudios. All rights reserved.</p>
            <span className="text-[#172554] hidden sm:inline">•</span>
            <a
              href="mailto:naturestudio05@gmail.com"
              className="hover:text-[#38BDF8] transition-colors inline-flex items-center gap-1 text-[#94A3B8]"
              title="naturestudio05@gmail.com"
            >
              <Mail className="h-3 w-3 text-[#38BDF8]" />
              <span>naturestudio05@gmail.com</span>
            </a>
            <span className="text-[#172554] hidden sm:inline">•</span>
            <a
              href="https://wa.me/917480066539"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[#94A3B8]"
              title="WhatsApp: +91 7480 066 539"
            >
              <WhatsAppIcon className="h-3 w-3 text-emerald-400" />
              <span>+91 7480 066 539</span>
            </a>
            <span className="text-[#172554] hidden sm:inline">•</span>
            <a
              href="https://discord.gg/PTVReHZp4n"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1 text-[#94A3B8]"
              title="Join NatureStudios Discord"
            >
              <DiscordIcon className="h-3 w-3 text-indigo-400" />
              <span>Discord</span>
            </a>
            <span className="text-[#172554] hidden sm:inline">•</span>
            <a
              href="https://www.instagram.com/naturestudio.in?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors inline-flex items-center gap-1 text-[#94A3B8]"
              title="Instagram @naturestudio.in"
            >
              <Instagram className="h-3 w-3 text-pink-400" />
              <span>@naturestudio.in</span>
            </a>
          </div>

          <nav className="flex items-center gap-6" aria-label="Legal links">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#38BDF8] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
