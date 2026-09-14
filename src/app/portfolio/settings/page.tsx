'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PortfolioData } from '@/lib/portfolio-service';
import {
  Globe,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trash2,
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
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const checkSlugAvailability = async (candidate: string) => {
    if (!candidate || candidate.length < 3) return;
    setSlugStatus('checking');

    try {
      const res = await fetch(`/api/portfolio/check-slug?slug=${encodeURIComponent(candidate)}`);
      const data = await res.json();
      setSlugStatus(data.available ? 'available' : 'taken');
    } catch {
      setSlugStatus('idle');
    }
  };

  const handleSaveSlug = async () => {
    if (!portfolio || !slug) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update username slug');
      }

      setPortfolio(data.portfolio);
      setMessage({ type: 'success', text: `Subdomain successfully set to https://${data.portfolio.slug}.naturestudio.in` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating slug' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FED7B8] animate-spin" />
      </div>
    );
  }

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
            Manage your unique subdomain, publishing status, and security options.
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
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
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
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
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
              {slugStatus === 'available' && <span className="text-[#18A957]">✓ Username available</span>}
              {slugStatus === 'taken' && <span className="text-[#E63946]">✗ Username already taken or reserved</span>}
            </div>
          </div>

          <button
            onClick={handleSaveSlug}
            disabled={saving || slugStatus === 'taken'}
            className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Subdomain'}
          </button>
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
