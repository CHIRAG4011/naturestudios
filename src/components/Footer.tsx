'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Selected Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio Builder', href: '/portfolio' },
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
    <footer className="border-t border-[#3D0D13] bg-[#150304] text-[#FFF5ED]" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-[#2D0A0E] border border-[#52141A] p-1.5 flex items-center justify-center shadow-glow-burgundy group-hover:scale-105 group-hover:border-[#FED7B8]/50 transition-all duration-200">
                <Image
                  src="/logo.png"
                  alt="NatureStudios Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(255,107,0,0.4)]"
                />
              </div>
              <span className="font-black tracking-wider text-base text-[#FFF5ED] uppercase group-hover:text-[#FED7B8] transition-colors duration-200">
                NatureStudios
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#B89B8D] leading-relaxed max-w-sm font-light">
              Engineering the intersection of organic worldbuilding, stadium architecture, and high-velocity esports production worldwide.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="btn-primary text-xs py-2.5 px-4 shadow-glow-burgundy inline-flex items-center gap-2"
              >
                <span>Start A Project</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#FED7B8]" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-4">
              Explore
            </span>
            <nav aria-label="Footer explore links">
              <ul className="space-y-2.5 text-xs font-mono">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#B89B8D] hover:text-[#FED7B8] transition-colors duration-200"
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
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-4">
              Creator &amp; Client Portal
            </span>
            <ul className="space-y-2.5 text-xs font-mono">
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="text-[#FED7B8] hover:underline">
                      Workspace Dashboard →
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-[#B89B8D] hover:text-[#FFF5ED]">
                      My Portfolio Subdomain
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/projects" className="text-[#B89B8D] hover:text-[#FFF5ED]">
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
                      className="text-[#B89B8D] hover:text-[#FED7B8] transition-colors cursor-pointer text-left"
                    >
                      Client Login
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openSqueeze('register')}
                      className="text-[#B89B8D] hover:text-[#FED7B8] transition-colors cursor-pointer text-left"
                    >
                      Register Workspace
                    </button>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-[#FED7B8] hover:underline">
                      Portfolio Platform →
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#3D0D13]">
              <div className="badge-live">LIVE TRANSMISSION</div>
              <p className="text-[10px] font-mono text-[#B89B8D] mt-2 tracking-widest uppercase">
                PRODUCTION DOMAIN // NATURESTUDIO.IN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3D0D13] bg-[#0E0203]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#7A6158]">
          <p>© {year} NatureStudios. All rights reserved.</p>
          <nav className="flex items-center gap-6" aria-label="Legal links">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#FED7B8] transition-colors"
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
