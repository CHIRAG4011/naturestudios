'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  RefreshCw,
  Eye,
  Image as ImageIcon,
  Upload,
  Loader2,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('BROADCAST');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load studio projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
      setImageUrl(data.url);
      setToastMessage('Project showcase image uploaded.');
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          client: client || 'NatureStudios Commission',
          category,
          description: desc,
          imageUrl: imageUrl.trim() || null,
          featured: true,
          status: 'PUBLISHED',
        }),
      });

      if (!res.ok) throw new Error('Failed to create project');
      setShowCreateModal(false);
      setTitle('');
      setClient('');
      setDesc('');
      setImageUrl('');
      setToastMessage('Studio project created and published.');
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Error creating project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#0B132B] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Studio Portfolio Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {projects.length} Showcases
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Official agency portfolio entries displayed on the public NatureStudios homepage and work index.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('projects.create')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#38BDF8]" />
            <span>Add Studio Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            Loading studio project showcases...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            No studio projects found.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all overflow-hidden flex flex-col justify-between group"
            >
              {proj.imageUrl && (
                <div className="h-36 w-full overflow-hidden bg-[#030712] relative">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E] via-transparent to-transparent opacity-80" />
                </div>
              )}
              <div className="p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/projects/${proj.id}`}
                    className="font-syne font-bold text-sm text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1"
                  >
                    {proj.title}
                  </Link>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2563EB] text-[#38BDF8]">
                    {proj.category || proj.projectType || 'ESPORTS'}
                  </span>
                </div>

                <div className="text-[11px] text-[#38BDF8]/70 font-mono">{proj.client || proj.user?.name || 'Studio Commission'}</div>
                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {proj.description || 'Cinematic esports broadcast packaging & visual identity.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#172554] flex items-center justify-between text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{proj.status || 'PUBLISHED'}</span>
                  </div>
                  {proj.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Featured
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/projects/${proj.id}`}
                  className="px-2.5 py-1 rounded-lg bg-[#2563EB]/50 hover:bg-[#2563EB] border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 text-[11px] text-[#38BDF8] font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3 h-3" />
                  <span>View & Edit</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070D1E] border border-[#2563EB] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#172554]">
              <h3 className="font-syne text-base font-bold text-[#F8FAFC]">
                Add Studio Project Showcase
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-[#94A3B8] block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VCT Championship 2026 Graphics"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Client / Partner</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Riot Games / ESL"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
                >
                  <option value="BROADCAST">Broadcast & Live Stream</option>
                  <option value="BRANDING">Visual Identity & Motion</option>
                  <option value="STAGE">Stage VFX & Arena Packaging</option>
                  <option value="TOURNAMENT">Tournament Overlay Suite</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Key creative achievements..."
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#94A3B8] block text-xs">Project Cover Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] text-xs focus:outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-xs font-semibold text-[#38BDF8] cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUrl && (
                  <div className="h-20 w-32 rounded-lg overflow-hidden border border-[#172554] bg-[#030712]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#2563EB] font-semibold text-[#F8FAFC]"
                >
                  {saving ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
