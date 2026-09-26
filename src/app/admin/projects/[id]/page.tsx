'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  RefreshCw,
  User,
  MessageSquare,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';

const STATUSES = [
  'RECEIVED',
  'REVIEWING',
  'IN_DISCUSSION',
  'IN_PRODUCTION',
  'COMPLETED',
  'CANCELLED',
];

const PROJECT_TYPES = [
  'ESPORTS / BROADCAST',
  'BRANDING & IDENTITY',
  'TOURNAMENT OVERLAY SUITE',
  'STAGE VFX PACKAGING',
  'CUSTOM COMMISSION',
];

export default function AdminProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { hasPermission, isSuperAdmin } = useAdmin();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('ESPORTS / BROADCAST');
  const [status, setStatus] = useState('IN_PRODUCTION');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects/${projectId}`);
      if (!res.ok) {
        throw new Error('Project not found or access restricted.');
      }
      const data = await res.json();
      setProject(data.project);

      setTitle(data.project.title || '');
      setProjectType(data.project.projectType || 'ESPORTS / BROADCAST');
      setStatus(data.project.status || 'IN_PRODUCTION');
      setBudget(data.project.budget || '');
      setTimeline(data.project.timeline || '');
      setDescription(data.project.description || '');
      setImageUrl(data.project.imageUrl || '');
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isSuperAdmin && !hasPermission('projects.edit')) {
      alert('You lack projects.edit authorization.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          projectType,
          status,
          budget,
          timeline,
          description,
          imageUrl: imageUrl.trim() || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to update project.');
      setToast({ message: 'Project specifications updated successfully.', type: 'success' });
      fetchProject();
    } catch (err: any) {
      setToast({ message: err.message || 'Error updating project.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isSuperAdmin && !hasPermission('projects.delete')) {
      alert('You lack projects.delete authorization.');
      return;
    }

    if (!confirm('Are you sure you want to permanently delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project.');
      alert('Project deleted successfully.');
      router.push('/admin/projects');
    } catch (err: any) {
      alert(err.message || 'Error deleting project.');
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#38BDF8]" />
        <div className="text-xs font-mono text-[#94A3B8]">Loading project specifications and client data...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="text-sm font-semibold text-[#E63946]">{error || 'Project not found.'}</div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] text-xs text-[#38BDF8] border border-[#172554]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xl ${
            toast.type === 'success'
              ? 'bg-[#030712] border border-emerald-500/50 text-emerald-400'
              : 'bg-[#030712] border border-[#E63946]/50 text-[#E63946]'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio Projects</span>
          </Link>
          <span className="text-[#172554]">/</span>
          <span className="text-[#38BDF8] font-semibold truncate max-w-xs">{title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/40 text-xs font-semibold text-[#38BDF8] shadow-glow-burgundy transition-all hover:scale-105"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Edit Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#38BDF8]" />
              <h1 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                Project Specifications & Scope
              </h1>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#2563EB] text-[#38BDF8]">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Creative Category
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] font-mono text-xs focus:outline-none"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Lifecycle Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] font-mono text-xs focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Contract Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $15,000 USD"
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Production Timeline
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 4-6 Weeks"
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px]">
                Project Scope & Creative Brief
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter scope, deliverables, motion packaging details..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-[#38BDF8] font-mono uppercase text-[10px]">
                Project Cover / Hero Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload local image"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
                />
                <label className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-xs font-semibold text-[#38BDF8] cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
                        const uploadData = await uploadRes.json();
                        if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
                        setImageUrl(uploadData.url);
                        setToast({ message: 'Cover image uploaded. Click Save Changes to commit.', type: 'success' });
                      } catch (uErr: any) {
                        setToast({ message: uErr.message || 'Upload failed', type: 'error' });
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="h-32 w-full max-w-sm rounded-xl overflow-hidden border border-[#172554] bg-[#030712]">
                  <img src={imageUrl} alt="Project Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Client Info & Metadata */}
        <div className="space-y-6">
          {/* Client Account Card */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 text-xs shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
              <User className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">
                Client Information
              </h2>
            </div>

            {project.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] border border-[#38BDF8]/30 flex items-center justify-center font-bold text-sm text-[#38BDF8]">
                    {project.user.name ? project.user.name[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div className="font-semibold text-[#F8FAFC]">
                      {project.user.name || 'Private Client'}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-mono">{project.user.email}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/admin/users/${project.user.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline"
                  >
                    <span>View User Detailed Profile →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-[#94A3B8]">Internal NatureStudios production (no external client).</p>
            )}
          </div>

          {/* Project Timestamps */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-3 text-xs shadow-xl font-mono text-[11px]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#172554] font-sans">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="font-semibold uppercase tracking-wider text-[#F8FAFC]">Metadata</h2>
            </div>
            <div className="flex justify-between py-1 border-b border-[#172554]/40">
              <span className="text-[#94A3B8]">Created</span>
              <span className="text-[#F8FAFC]">{new Date(project.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#172554]/40">
              <span className="text-[#94A3B8]">Updated</span>
              <span className="text-[#F8FAFC]">{new Date(project.updatedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Messages</span>
              <span className="text-[#38BDF8]">{project.messages?.length || 0}</span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#E63946]/30 space-y-3 text-xs shadow-xl">
            <div className="text-[#E63946] font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone</span>
            </div>
            <p className="text-[#94A3B8] text-[11px]">
              Permanently delete this project showcase and associated records.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-1.5 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 border border-[#E63946]/30 text-[#E63946] font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
