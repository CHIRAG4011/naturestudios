'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PortfolioData, sanitizeSlug } from '@/lib/portfolio-service';
import {
  Globe,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Copy,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PortfolioSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);
  const [showDnsHelp, setShowDnsHelp] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/portfolio/settings');
      return;
    }

    if (user && (user.isSuspended || user.status === 'SUSPENDED')) {
      router.replace('/dashboard/tickets?type=appeal');
      return;
    }

    if (user) {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          if (data.portfolio) {
            setPortfolio(data.portfolio);
            setSlug(data.portfolio.slug);
            setSlugStatus('available');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const checkSlugAvailability = async (candidate: string) => {
    const clean = sanitizeSlug(candidate);
    if (!clean || clean.length < 3) {
      setSlugStatus('idle');
      return;
    }

    if (portfolio && clean === portfolio.slug) {
      setSlugStatus('available');
      return;
    }

    setSlugStatus('checking');

    try {
      const res = await fetch(`/api/portfolio/check-slug?slug=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setSlugStatus(data.available ? 'available' : 'taken');
    } catch {
      setSlugStatus('idle');
    }
  };

  const handleSaveSlug = async () => {
    if (!portfolio) return;
    const cleanSlug = sanitizeSlug(slug);
    if (!cleanSlug || cleanSlug.length < 3) {
      setMessage({ type: 'error', text: 'Subdomain slug must be at least 3 characters long.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedPayload = {
        ...portfolio,
        slug: cleanSlug,
        personalInfo: {
          ...portfolio.personalInfo,
          username: cleanSlug,
        },
      };

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update username slug');
      }

      setPortfolio(data.portfolio);
      setSlug(data.portfolio.slug);
      setSlugStatus('available');
      setMessage({
        type: 'success',
        text: `Subdomain successfully updated to "${data.portfolio.slug}.naturestudio.in"!`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating slug' });
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = (url: string, type: 'subdomain' | 'direct') => {
    navigator.clipboard.writeText(url);
    if (type === 'subdomain') {
      setCopiedSubdomain(true);
      setTimeout(() => setCopiedSubdomain(false), 2000);
    } else {
      setCopiedDirect(true);
      setTimeout(() => setCopiedDirect(false), 2000);
    }
  };

  if (authLoading || loading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FED7B8] animate-spin" />
      </div>
    );
  }

  const subdomainUrl = `https://${portfolio.slug}.naturestudio.in`;
  const directUrl = `https://naturestudio.in/p/${portfolio.slug}`;

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8]">
      <header className="border-b border-[#3D0D13] bg-[#1C0507] px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portfolio" className="text-xs font-mono uppercase text-[#FED7B8] hover:underline flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>
          <span className="text-[#52141A]">/</span>
          <span className="text-xs font-mono uppercase text-[#B89B8D]">Subdomain & Security</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
            Configuration
          </span>
          <h1 className="text-3xl font-black uppercase text-[#FFF5ED]">Portfolio Settings</h1>
          <p className="text-xs text-[#B89B8D] mt-1">
            Manage your unique subdomain, publishing URLs, and security options.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-[#150304] border border-[#18A957] text-[#18A957]'
                : 'bg-[#3A0E11] border border-[#E63946] text-[#E63946]'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Subdomain Management Card */}
        <div className="p-8 rounded-2xl bg-[#240709] border border-[#52141A] space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#FED7B8]" />
            <h3 className="text-lg font-bold uppercase text-[#FFF5ED]">Custom Subdomain Slug</h3>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">
              Creator Subdomain
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  const val = sanitizeSlug(e.target.value);
                  setSlug(val);
                  checkSlugAvailability(val);
                }}
                className="field font-mono text-sm max-w-xs"
                placeholder="creator"
              />
              <span className="font-mono text-xs text-[#FED7B8]">.naturestudio.in</span>
            </div>

            <div className="mt-2 text-xs font-mono">
              {slugStatus === 'checking' && <span className="text-[#FED7B8]">Checking availability...</span>}
              {slugStatus === 'available' && <span className="text-[#18A957]">✓ Subdomain available</span>}
              {slugStatus === 'taken' && <span className="text-[#E63946]">✗ Subdomain already taken or reserved</span>}
            </div>
          </div>

          <button
            onClick={handleSaveSlug}
            disabled={saving || slugStatus === 'taken' || !slug || slug.length < 3}
            className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Subdomain
          </button>

          {/* Live Links Section */}
          <div className="pt-6 border-t border-[#3D0D13] space-y-4">
            <span className="text-xs font-mono uppercase text-[#FED7B8] font-bold block">
              Active Portfolio Links
            </span>

            {/* Direct Instant URL (Guaranteed to work without wildcard DNS) */}
            <div className="p-4 rounded-xl bg-[#1C0507] border border-[#52141A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18A957]/20 border border-[#18A957]/40 text-[#18A957] font-bold">
                    RECOMMENDED / DIRECT
                  </span>
                  <span className="text-xs font-bold text-[#FFF5ED]">Instant Direct Link</span>
                </div>
                <p className="text-[11px] font-mono text-[#FED7B8] mt-1 break-all">{directUrl}</p>
                <p className="text-[10px] text-[#B89B8D] mt-0.5">Works instantly anywhere without waiting for DNS propagation.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyUrl(directUrl, 'direct')}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedDirect ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>

            {/* Custom Subdomain URL */}
            <div className="p-4 rounded-xl bg-[#1C0507] border border-[#3D0D13] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#52141A] text-[#FED7B8] font-bold">
                    WILDCARD SUBDOMAIN
                  </span>
                  <span className="text-xs font-bold text-[#FFF5ED]">Custom Subdomain</span>
                </div>
                <p className="text-[11px] font-mono text-[#B89B8D] mt-1 break-all">{subdomainUrl}</p>
                <p className="text-[10px] text-[#7D6B62] mt-0.5">Requires wildcard DNS (*.naturestudio.in) configured in your DNS provider.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyUrl(subdomainUrl, 'subdomain')}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedSubdomain ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={subdomainUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>

            {/* Collapsible DNS Setup Guide */}
            <div className="pt-2">
              <button
                onClick={() => setShowDnsHelp(!showDnsHelp)}
                className="text-xs font-mono text-[#FED7B8] hover:underline flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>How to enable custom subdomains on Cloudflare & Vercel</span>
                {showDnsHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDnsHelp && (
                <div className="mt-3 p-4 rounded-xl bg-[#150304] border border-[#52141A] text-xs space-y-3 text-[#B89B8D]">
                  <p className="text-[#FFF5ED] font-bold">To make any subdomain (like {portfolio.slug}.naturestudio.in) open worldwide:</p>
                  <ol className="list-decimal list-inside space-y-1.5 font-mono text-[11px]">
                    <li>Open your Cloudflare Dashboard for <span className="text-[#FED7B8]">naturestudio.in</span>.</li>
                    <li>Go to <span className="text-[#FED7B8]">DNS Records</span> &gt; Click <span className="text-[#FED7B8]">Add Record</span>.</li>
                    <li>Type: <span className="text-[#18A957]">CNAME</span>, Name: <span className="text-[#18A957]">*</span>, Target: <span className="text-[#18A957]">cname.vercel-dns.com</span> (or your Vercel domain alias).</li>
                    <li>In your Vercel Dashboard &gt; Project Settings &gt; <span className="text-[#FED7B8]">Domains</span> &gt; Add <span className="text-[#18A957]">*.naturestudio.in</span>.</li>
                  </ol>
                  <p className="text-[11px] text-[#FED7B8]">
                    In the meantime, the <span className="text-[#18A957]">Direct Link</span> ({directUrl}) works 100% reliably right now with no DNS configuration needed!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security & Multi-Tenant Protection */}
        <div className="p-8 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#18A957]" />
            <h3 className="text-lg font-bold uppercase text-[#FFF5ED]">Security & Ownership</h3>
          </div>
          <p className="text-xs text-[#B89B8D] leading-relaxed">
            Your portfolio is strictly protected by server-side session authorization. No other user can modify your projects, clone your configuration, or claim your published username slug.
          </p>
        </div>
      </main>
    </div>
  );
}
