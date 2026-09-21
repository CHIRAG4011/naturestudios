'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import type { StudioWorkType, GfxSubsection } from '@/lib/portfolio-shared';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  RefreshCw,
  Eye,
  Image as ImageIcon,
  Video,
  Upload,
  Loader2,
  Search,
  ExternalLink,
  Play,
  Film,
  Layers,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface StudioItem {
  id: string;
  type: StudioWorkType;
  gfxCategory?: GfxSubsection;
  title: string;
  client: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt?: string;
  updatedAt?: string;
}

const GFX_SUBSECTIONS: GfxSubsection[] = [
  'Tournament',
  'Roster',
  'Thumbnail',
  'Logo/Banners',
];

export default function AdminStudioPortfolioPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [items, setItems] = useState<StudioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search state
  const [activeTab, setActiveTab] = useState<'ALL' | 'GFX' | 'VFX'>('ALL');
  const [activeGfxSub, setActiveGfxSub] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formType, setFormType] = useState<StudioWorkType>('GFX');
  const [formGfxCategory, setFormGfxCategory] = useState<GfxSubsection>('Tournament');
  const [formTitle, setFormTitle] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formOrder, setFormOrder] = useState(0);
  const [formStatus, setFormStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  // Media upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video preview player modal in admin
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/studio-portfolio');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load studio portfolio items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Upload handler for image
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormImageUrl(data.url);
      setToastMessage('Image uploaded successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload handler for video
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Video upload failed');
      setFormVideoUrl(data.url);
      setToastMessage('Video reel uploaded successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = (initialType: StudioWorkType = 'GFX') => {
    setIsEditing(false);
    setEditingId(null);
    setFormType(initialType);
    setFormGfxCategory('Tournament');
    setFormTitle('');
    setFormClient('');
    setFormDescription('');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormThumbnailUrl('');
    setFormDuration('');
    setFormTags('');
    setFormFeatured(true);
    setFormOrder(items.length);
    setFormStatus('PUBLISHED');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: StudioItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormType(item.type);
    setFormGfxCategory(item.gfxCategory || 'Tournament');
    setFormTitle(item.title);
    setFormClient(item.client || '');
    setFormDescription(item.description || '');
    setFormImageUrl(item.imageUrl || '');
    setFormVideoUrl(item.videoUrl || '');
    setFormThumbnailUrl(item.thumbnailUrl || '');
    setFormDuration(item.duration || '');
    setFormTags(item.tags ? item.tags.join(', ') : '');
    setFormFeatured(item.featured !== false);
    setFormOrder(item.order || 0);
    setFormStatus(item.status || 'PUBLISHED');
    setShowModal(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Title is required');
      return;
    }

    if (formType === 'GFX' && !formImageUrl.trim()) {
      alert('Image is required for GFX items');
      return;
    }

    if (formType === 'VFX' && !formVideoUrl.trim() && !formImageUrl.trim()) {
      alert('A video URL/upload or thumbnail image is required for VFX items');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type: formType,
        gfxCategory: formType === 'GFX' ? formGfxCategory : undefined,
        title: formTitle.trim(),
        client: formClient.trim() || 'NatureStudios Commission',
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim() || formThumbnailUrl.trim() || '/media/work-valorant-championship.jpg',
        videoUrl: formVideoUrl.trim() || undefined,
        thumbnailUrl: formThumbnailUrl.trim() || formImageUrl.trim() || undefined,
        duration: formDuration.trim() || undefined,
        tags: formTags ? formTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        featured: formFeatured,
        order: Number(formOrder) || 0,
        status: formStatus,
      };

      if (isEditing && editingId) {
        const res = await fetch(`/api/admin/studio-portfolio/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update item');
        }
        setToastMessage(`Updated "${formTitle}" in Studio Portfolio.`);
      } else {
        const res = await fetch('/api/admin/studio-portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create item');
        }
        setToastMessage(`Created new ${formType} entry "${formTitle}".`);
      }

      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from Studio Portfolio?`)) return;

    try {
      const res = await fetch(`/api/admin/studio-portfolio/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete item');
      }
      setToastMessage(`Deleted "${title}".`);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error deleting item');
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    if (activeTab === 'GFX' && item.type !== 'GFX') return false;
    if (activeTab === 'VFX' && item.type !== 'VFX') return false;
    if (activeTab === 'GFX' && activeGfxSub !== 'ALL' && item.gfxCategory !== activeGfxSub) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesClient = item.client?.toLowerCase().includes(q);
      const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesSub = item.gfxCategory?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesClient && !matchesTag && !matchesSub) return false;
    }
    return true;
  });

  const gfxCount = items.filter((i) => i.type === 'GFX').length;
  const vfxCount = items.filter((i) => i.type === 'VFX').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#240709] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#1D0608] border border-[#59171B]/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#59171B]/60 border border-[#FED7B8]/30 flex items-center justify-center text-[#FED7B8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Studio Portfolio CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              GFX & VFX Tracks
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] max-w-2xl leading-relaxed">
            Manage the official showcase items displayed on the public <Link href="/portfolio" target="_blank" className="text-[#FED7B8] underline hover:text-white">Studio Portfolio (/portfolio)</Link>. Add high-impact GFX (Tournament, Roster, Thumbnail, Logo/Banners) and playable VFX video reels.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/portfolio"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#150304] hover:bg-[#250608] border border-[#59171B] text-xs font-mono uppercase tracking-wider text-[#FED7B8] flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Page</span>
            <ExternalLink className="w-3 h-3 text-[#FED7B8]/60" />
          </Link>

          {(isSuperAdmin || hasPermission('content.create')) && (
            <button
              onClick={() => handleOpenCreate('GFX')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-[#FED7B8]" />
              <span>Add Portfolio Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="text-[10px] font-mono uppercase text-[#B89B8D] tracking-wider mb-1">Total Showcases</div>
          <div className="text-2xl font-bold font-syne text-[#FFF5ED]">{items.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="text-[10px] font-mono uppercase text-[#B89B8D] tracking-wider mb-1">GFX Designs</div>
          <div className="text-2xl font-bold font-syne text-[#FED7B8]">{gfxCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="text-[10px] font-mono uppercase text-[#B89B8D] tracking-wider mb-1">VFX Video Reels</div>
          <div className="text-2xl font-bold font-syne text-purple-400">{vfxCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          <div className="text-[10px] font-mono uppercase text-[#B89B8D] tracking-wider mb-1">Featured Items</div>
          <div className="text-2xl font-bold font-syne text-amber-400">
            {items.filter((i) => i.featured).length}
          </div>
        </div>
      </div>

      {/* Controls: Tabs, Subsections & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#1D0608] border border-[#3D0D13]">
          {/* Main Track Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#150304] rounded-xl border border-[#3D0D13]">
            <button
              onClick={() => {
                setActiveTab('ALL');
                setActiveGfxSub('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'ALL'
                  ? 'bg-[#59171B] text-[#FED7B8] shadow-sm'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('GFX')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'GFX'
                  ? 'bg-[#59171B] text-[#FED7B8] shadow-sm'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>GFX Track ({gfxCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('VFX')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'VFX'
                  ? 'bg-[#59171B] text-[#FED7B8] shadow-sm'
                  : 'text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>VFX Video Reels ({vfxCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#B89B8D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, client, tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#150304] border border-[#3D0D13] rounded-xl text-[#FFF5ED] placeholder:text-[#B89B8D]/50 focus:outline-none focus:border-[#FED7B8]/40"
            />
          </div>
        </div>

        {/* GFX Subsections bar when viewing GFX or ALL */}
        {activeTab !== 'VFX' && (
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-[11px] font-mono uppercase text-[#B89B8D] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#FED7B8]" />
              GFX Categories:
            </span>
            <button
              onClick={() => setActiveGfxSub('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors ${
                activeGfxSub === 'ALL'
                  ? 'bg-[#FED7B8]/20 text-[#FED7B8] border border-[#FED7B8]/40'
                  : 'text-[#B89B8D] hover:text-white bg-[#1D0608] border border-[#3D0D13]'
              }`}
            >
              All GFX
            </button>
            {GFX_SUBSECTIONS.map((sub) => {
              const count = items.filter((i) => i.type === 'GFX' && i.gfxCategory === sub).length;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveTab('GFX');
                    setActiveGfxSub(sub);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors flex items-center gap-1.5 ${
                    activeTab === 'GFX' && activeGfxSub === sub
                      ? 'bg-[#FED7B8]/20 text-[#FED7B8] border border-[#FED7B8]/40'
                      : 'text-[#B89B8D] hover:text-white bg-[#1D0608] border border-[#3D0D13]'
                  }`}
                >
                  <span>{sub}</span>
                  <span className="text-[9px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-xs text-[#B89B8D] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#FED7B8]" />
            <span>Loading Studio Portfolio items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#B89B8D] bg-[#1D0608] rounded-3xl border border-[#3D0D13]">
            No portfolio items found matching your filters.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all overflow-hidden flex flex-col justify-between group shadow-lg"
            >
              {/* Media Preview Box */}
              <div className="h-44 w-full overflow-hidden bg-[#150304] relative group/media">
                <img
                  src={item.imageUrl || item.thumbnailUrl || '/media/work-valorant-championship.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608] via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      item.type === 'VFX'
                        ? 'bg-purple-600/90 text-white'
                        : 'bg-[#59171B]/90 text-[#FED7B8] border border-[#FED7B8]/30'
                    }`}
                  >
                    {item.type}
                  </span>
                  {item.gfxCategory && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-[#FFF5ED] border border-white/10">
                      {item.gfxCategory}
                    </span>
                  )}
                </div>

                {/* VFX Play trigger */}
                {item.type === 'VFX' && item.videoUrl && (
                  <button
                    onClick={() => setPreviewVideoUrl(item.videoUrl!)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#FED7B8] text-[#1C0507] flex items-center justify-center shadow-glow-amber hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </button>
                )}

                {item.duration && (
                  <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/70 font-mono text-[9px] text-[#FED7B8]">
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-syne font-bold text-sm text-[#FFF5ED] line-clamp-1 group-hover:text-[#FED7B8] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-[11px] text-[#FED7B8]/80 font-mono mb-2 line-clamp-1">
                    {item.client}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[#B89B8D] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] border border-[#3D0D13] text-[#B89B8D]"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-1 py-0.5 text-[9px] font-mono text-[#B89B8D]">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-3 border-t border-[#3D0D13] flex items-center justify-between text-xs bg-[#150304]/40">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {(isSuperAdmin || hasPermission('content.edit')) && (
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-[#59171B]/50 hover:bg-[#59171B] border border-[#FED7B8]/20 hover:border-[#FED7B8]/40 text-[#FED7B8] transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {(isSuperAdmin || hasPermission('content.delete')) && (
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-[#FFF5ED]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3D0D13]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#59171B] flex items-center justify-center text-[#FED7B8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-syne text-lg font-bold text-[#FFF5ED]">
                    {isEditing ? 'Edit Studio Portfolio Item' : 'Add Studio Portfolio Item'}
                  </h3>
                  <p className="text-[11px] text-[#B89B8D]">
                    Upload and manage high-end assets for official agency showcase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#150304] border border-[#3D0D13] flex items-center justify-center text-[#B89B8D] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-5">
              {/* Type Switcher: GFX vs VFX */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#150304] rounded-2xl border border-[#3D0D13]">
                <button
                  type="button"
                  onClick={() => setFormType('GFX')}
                  className={`py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formType === 'GFX'
                      ? 'bg-[#59171B] text-[#FED7B8] font-bold shadow-md'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>GFX Showcase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('VFX')}
                  className={`py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formType === 'VFX'
                      ? 'bg-purple-900/80 text-purple-200 font-bold shadow-md border border-purple-500/40'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>VFX Video Reel</span>
                </button>
              </div>

              {/* If GFX: Subsection Selector */}
              {formType === 'GFX' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block">
                    GFX Subsection Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GFX_SUBSECTIONS.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setFormGfxCategory(sub)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                          formGfxCategory === sub
                            ? 'bg-[#FED7B8]/20 border-[#FED7B8] text-[#FED7B8] font-bold'
                            : 'bg-[#150304] border-[#3D0D13] text-[#B89B8D] hover:text-white'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                    Project / Asset Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. VCT Champions Master Visual"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#FED7B8]/40"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                    Client or Brand
                  </label>
                  <input
                    type="text"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Riot Games / Red Bull / Team Liquid"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#FED7B8]/40"
                  />
                </div>
              </div>

              {/* Media Upload & URL Section */}
              <div className="space-y-4 p-4 rounded-2xl bg-[#150304] border border-[#3D0D13]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#FED7B8] font-bold tracking-wider">
                    {formType === 'GFX' ? 'GFX Image Asset' : 'VFX Video & Cover'}
                  </span>
                  <span className="text-[10px] text-[#B89B8D]">
                    {formType === 'GFX' ? 'Supports JPG, PNG, WEBP up to 15MB' : 'Supports MP4, WEBM up to 50MB or YouTube/Vimeo'}
                  </span>
                </div>

                {/* GFX Image Upload */}
                {formType === 'GFX' && (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#59171B]/70 hover:bg-[#59171B] border border-[#FED7B8]/30 cursor-pointer flex items-center justify-center gap-2 text-xs font-mono text-[#FED7B8] transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-[#B89B8D]">or direct URL:</span>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://... or /media/..."
                        className="flex-1 w-full px-3 py-2 rounded-xl bg-[#1D0608] border border-[#3D0D13] text-[#FFF5ED] text-xs focus:outline-none"
                      />
                    </div>

                    {formImageUrl && (
                      <div className="mt-3 relative h-40 w-full rounded-xl overflow-hidden border border-[#3D0D13] bg-[#110203]">
                        <img
                          src={formImageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* VFX Video Upload & Video URL */}
                {formType === 'VFX' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-[#B89B8D] block mb-1">
                        Video Source (Direct File or YouTube / Vimeo URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-500/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-mono text-purple-200 transition-colors">
                          {uploadingVideo ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Film className="w-4 h-4" />
                          )}
                          <span>{uploadingVideo ? 'Uploading Video...' : 'Upload MP4 Video'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            disabled={uploadingVideo}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-[#B89B8D]">or URL:</span>
                        <input
                          type="text"
                          value={formVideoUrl}
                          onChange={(e) => setFormVideoUrl(e.target.value)}
                          placeholder="https://youtu.be/... or https://domain.com/video.mp4"
                          className="flex-1 w-full px-3 py-2 rounded-xl bg-[#1D0608] border border-[#3D0D13] text-[#FFF5ED] text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-[#B89B8D] block mb-1">
                          Poster / Thumbnail Image URL
                        </label>
                        <input
                          type="text"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          placeholder="Poster image URL for video card"
                          className="w-full px-3 py-2 rounded-xl bg-[#1D0608] border border-[#3D0D13] text-[#FFF5ED] text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-[#B89B8D] block mb-1">
                          Reel Duration (e.g. 0:45)
                        </label>
                        <input
                          type="text"
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          placeholder="0:45"
                          className="w-full px-3 py-2 rounded-xl bg-[#1D0608] border border-[#3D0D13] text-[#FFF5ED] text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                  Description & Creative Details
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Creative direction, software used (After Effects, Cinema 4D, Photoshop), tournament highlights..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#FED7B8]/40 leading-relaxed"
                />
              </div>

              {/* Tags, Status & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Broadcast, 3D, Overlay"
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#FED7B8] tracking-wider block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Featured Checkbox */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#150304] border border-[#3D0D13] cursor-pointer hover:border-[#FED7B8]/30 transition-colors">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded bg-[#1D0608] border-[#3D0D13] text-[#59171B] focus:ring-0 w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-[#FFF5ED]">Featured Spotlight</div>
                  <div className="text-[10px] text-[#B89B8D]">Highlight this piece prominently at the top of the Studio Portfolio.</div>
                </div>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D0D13]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#150304] hover:bg-[#250608] border border-[#3D0D13] text-xs font-mono uppercase text-[#B89B8D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage || uploadingVideo}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{isEditing ? 'Save Changes' : 'Publish Item'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VFX PREVIEW PLAYER MODAL */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#1D0608] border border-[#59171B] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <span className="font-mono text-xs uppercase text-[#FED7B8] flex items-center gap-2">
                <Film className="w-4 h-4" />
                VFX Reel Playback Preview
              </span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-[#150304] border border-[#3D0D13] flex items-center justify-center text-[#B89B8D] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={
                    previewVideoUrl.includes('watch?v=')
                      ? previewVideoUrl.replace('watch?v=', 'embed/')
                      : previewVideoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                  }
                  title="VFX Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : previewVideoUrl.includes('vimeo.com') ? (
                <iframe
                  src={previewVideoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  title="VFX Video"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
