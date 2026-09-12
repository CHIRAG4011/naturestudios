'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  FileText,
  Save,
  CheckCircle2,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

const SECTIONS = [
  { slug: 'homepage', label: 'Homepage Hero & Narrative' },
  { slug: 'services', label: 'Services & Capabilities' },
  { slug: 'studio', label: 'Studio Philosophy & Tech' },
  { slug: 'contact', label: 'Contact Inquiries & Booking' },
  { slug: 'footer', label: 'Footer & Legal Copy' },
];

export default function AdminContentPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [selectedSlug, setSelectedSlug] = useState('homepage');
  const [contentDoc, setContentDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchContent = async (slug: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/content?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setContentDoc(data.content);
      }
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(selectedSlug);
  }, [selectedSlug]);

  const handleSectionFieldChange = (field: string, value: string) => {
    setContentDoc((prev: any) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [field]: value,
      },
    }));
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!isSuperAdmin && !hasPermission('content.edit')) {
      alert('You lack content.edit authority.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          title: contentDoc?.title || selectedSlug,
          status,
          sections: contentDoc?.sections || {},
        }),
      });

      if (!res.ok) throw new Error('Failed to save content');
      const data = await res.json();
      setContentDoc(data.content);
      setToastMessage(
        status === 'PUBLISHED'
          ? `Section /${selectedSlug} published live to website!`
          : `Section /${selectedSlug} saved as draft.`
      );
    } catch (err: any) {
      alert(err.message || 'Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const sections = contentDoc?.sections || {};

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#240709] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Site Content CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              {contentDoc?.status || 'PUBLISHED'} • v{contentDoc?.version || 1}
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Database-backed site copy editor. Modify public headlines, body copy, and CTA text without code deploys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isSuperAdmin || hasPermission('content.edit')) && (
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs font-medium text-[#FFF5ED] transition-colors"
            >
              Save Draft
            </button>
          )}

          {(isSuperAdmin || hasPermission('content.publish')) && (
            <button
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FED7B8]" />
              <span>Publish Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {SECTIONS.map((sec) => (
          <button
            key={sec.slug}
            onClick={() => setSelectedSlug(sec.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedSlug === sec.slug
                ? 'bg-[#59171B] text-[#FFF5ED] font-semibold shadow-md'
                : 'bg-[#1D0608] text-[#B89B8D] hover:text-[#FFF5ED] border border-[#3D0D13]'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Section Content Editor Form */}
      <div className="p-6 rounded-3xl bg-[#1D0608] border border-[#3D0D13] space-y-5">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#B89B8D]">
            Loading content block from MongoDB Atlas...
          </div>
        ) : selectedSlug === 'homepage' ? (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={sections.heroHeadline || 'WE CREATE THE NEXT LEVEL OF ESPORTS.'}
                onChange={(e) => handleSectionFieldChange('heroHeadline', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-sm text-[#FFF5ED] font-semibold focus:outline-none focus:border-[#59171B]"
              />
            </div>

            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">
                Hero Subtitle / Mission Statement
              </label>
              <textarea
                rows={3}
                value={
                  sections.heroSubtitle ||
                  'Cinematic broadcasts, tournament packaging, and multi-tenant creator portfolio infrastructure built for premier competitive gaming.'
                }
                onChange={(e) => handleSectionFieldChange('heroSubtitle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] leading-relaxed focus:outline-none focus:border-[#59171B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#B89B8D] block mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={sections.primaryCtaText || 'Explore Projects'}
                  onChange={(e) => handleSectionFieldChange('primaryCtaText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED]"
                />
              </div>
              <div>
                <label className="text-[#B89B8D] block mb-1">Secondary CTA Button Text</label>
                <input
                  type="text"
                  value={sections.secondaryCtaText || 'Create Portfolio'}
                  onChange={(e) => handleSectionFieldChange('secondaryCtaText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">
                Manifesto Ticker Quote
              </label>
              <input
                type="text"
                value={
                  sections.tickerText ||
                  'GROWING INSIDE A CINEMATIC BURGUNDY WORLD • ESPORTS CREATIVE EXCELLENCE • REVOLUTIONIZING COMPETITIVE BROADCAST'
                }
                onChange={(e) => handleSectionFieldChange('tickerText', e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">Page Title</label>
              <input
                type="text"
                value={sections.pageTitle || contentDoc?.title || ''}
                onChange={(e) => handleSectionFieldChange('pageTitle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-sm text-[#FFF5ED] font-semibold focus:outline-none focus:border-[#59171B]"
              />
            </div>

            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">Introductory Copy</label>
              <textarea
                rows={4}
                value={sections.introCopy || ''}
                onChange={(e) => handleSectionFieldChange('introCopy', e.target.value)}
                placeholder="Narrative copy for this page..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] leading-relaxed focus:outline-none focus:border-[#59171B]"
              />
            </div>

            <div>
              <label className="text-[#FED7B8] font-semibold block mb-1">
                Contact Routing Recipient
              </label>
              <input
                type="email"
                value={sections.routingEmail || 'inquiries@naturestudio.in'}
                onChange={(e) => handleSectionFieldChange('routingEmail', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
