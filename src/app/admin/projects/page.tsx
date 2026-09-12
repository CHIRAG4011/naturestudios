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
          featured: true,
          status: 'PUBLISHED',
        }),
      });

      if (!res.ok) throw new Error('Failed to create project');
      setShowCreateModal(false);
      setTitle('');
      setClient('');
      setDesc('');
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
              Studio Portfolio Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              {projects.length} Showcases
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Official agency portfolio entries displayed on the public NatureStudios homepage and work index.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('projects.create')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#FED7B8]" />
            <span>Add Studio Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading studio project showcases...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No studio projects found.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/projects/${proj.id}`}
                    className="font-syne font-bold text-sm text-[#FFF5ED] group-hover:text-[#FED7B8] transition-colors"
                  >
                    {proj.title}
                  </Link>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#59171B] text-[#FED7B8]">
                    {proj.category || proj.projectType || 'ESPORTS'}
                  </span>
                </div>

                <div className="text-[11px] text-[#FED7B8]/70 font-mono">{proj.client || proj.user?.name || 'Studio Commission'}</div>
                <p className="text-xs text-[#B89B8D] line-clamp-2 leading-relaxed">
                  {proj.description || 'Cinematic esports broadcast packaging & visual identity.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3D0D13] flex items-center justify-between text-xs text-[#B89B8D]">
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
                  className="px-2.5 py-1 rounded-lg bg-[#59171B]/50 hover:bg-[#59171B] border border-[#FED7B8]/20 hover:border-[#FED7B8]/40 text-[11px] text-[#FED7B8] font-semibold transition-colors inline-flex items-center gap-1.5"
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
          <div className="w-full max-w-md bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <h3 className="font-syne text-base font-bold text-[#FFF5ED]">
                Add Studio Project Showcase
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#B89B8D] hover:text-[#FFF5ED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-[#B89B8D] block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VCT Championship 2026 Graphics"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Client / Partner</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Riot Games / ESL"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                >
                  <option value="BROADCAST">Broadcast & Live Stream</option>
                  <option value="BRANDING">Visual Identity & Motion</option>
                  <option value="STAGE">Stage VFX & Arena Packaging</option>
                  <option value="TOURNAMENT">Tournament Overlay Suite</option>
                </select>
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Key creative achievements..."
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] text-[#FFF5ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#59171B] hover:bg-[#6E1C23] font-semibold text-[#FFF5ED]"
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
