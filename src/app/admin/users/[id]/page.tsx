'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminContext';
import {
  User as UserIcon,
  Shield,
  ArrowLeft,
  Mail,
  Calendar,
  Layers,
  Activity,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  Save,
  Trash2,
  ExternalLink,
  Briefcase,
  Inbox,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Globe,
  Radio,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const { hasPermission, isSuperAdmin } = useAdmin();

  // Data state
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'projects' | 'portfolio' | 'security'>('profile');

  // Form editable states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('ACTIVE');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [overrides, setOverrides] = useState<Record<string, 'ALLOW' | 'DENY' | 'RESET'>>({});
  const [permSearch, setPermSearch] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchUserDetails = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        throw new Error('User account not found or administrative access restricted.');
      }
      const json = await res.json();
      setData(json);

      // Populate form fields
      setName(json.user.name || '');
      setEmail(json.user.email || '');
      setAvatarUrl(json.user.avatarUrl || '');
      setStatus(json.user.status || 'ACTIVE');
      setSuspendReason(json.user.suspendedReason || '');
      setEmailVerified(Boolean(json.user.emailVerified));
      setRole(json.roles?.[0] || 'USER');
      setPortfolioSlug(json.portfolio?.slug || '');

      // Existing overrides map
      const initialOverrides: Record<string, 'ALLOW' | 'DENY' | 'RESET'> = {};
      if (Array.isArray(json.overrides)) {
        json.overrides.forEach((o: any) => {
          initialOverrides[o.permissionKey] = o.effect;
        });
      }
      setOverrides(initialOverrides);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOverrideToggle = (permKey: string, currentEffect?: 'ALLOW' | 'DENY') => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (!currentEffect) {
        next[permKey] = 'ALLOW';
      } else if (currentEffect === 'ALLOW') {
        next[permKey] = 'DENY';
      } else {
        next[permKey] = 'RESET';
      }
      return next;
    });
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;

    if (!isSuperAdmin && !hasPermission('users.edit')) {
      alert('You lack users.edit authorization to modify user accounts.');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name,
        email,
        avatarUrl,
        role,
        status,
        reason: suspendReason,
        emailVerified,
        portfolioSlug,
        permissionOverrides: Object.entries(overrides).map(([permissionKey, effect]) => ({
          permissionKey,
          effect,
        })),
      };

      if (newPassword && newPassword.trim().length >= 6) {
        payload.newPassword = newPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to update user record.');
      }

      setToast({ message: 'User profile, credentials, and access policies updated successfully.', type: 'success' });
      setNewPassword('');
      fetchUserDetails();
    } catch (err: any) {
      setToast({ message: err.message || 'Error updating user.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!isSuperAdmin && !hasPermission('users.delete')) {
      alert('You lack users.delete authorization.');
      return;
    }

    if (deleteConfirmPhrase !== 'DELETE USER') {
      alert('Please type DELETE USER to confirm.');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to delete user.');
      }

      alert('User account permanently deleted.');
      router.push('/admin/users');
    } catch (err: any) {
      alert(err.message || 'Error deleting user.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#38BDF8]" />
        <div className="text-xs font-mono text-[#94A3B8]">
          Retrieving complete cryptographic, project, and session profile...
        </div>
      </div>
    );
  }

  if (error || !data || !data.user) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#E63946]/20 border border-[#E63946]/40 flex items-center justify-center mx-auto text-[#E63946]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="font-syne text-lg font-bold text-[#F8FAFC]">User Account Not Found</div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          {error || 'This user ID does not match an active or archived record.'}
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] text-xs text-[#38BDF8] border border-[#172554] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to User Directory</span>
        </Link>
      </div>
    );
  }

  const u = data.user;
  const filteredAvailablePerms = (data.availablePermissions || []).filter((p: any) => {
    const q = permSearch.toLowerCase().trim();
    if (!q) return true;
    return p.key.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xl transition-all ${
            toast.type === 'success'
              ? 'bg-[#030712] border border-emerald-500/50 text-emerald-400'
              : 'bg-[#030712] border border-[#E63946]/50 text-[#E63946]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#E63946]" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>User Directory</span>
          </Link>
          <span className="text-[#172554]">/</span>
          <span className="text-[#38BDF8] font-semibold truncate max-w-xs">{u.name || u.email}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070D1E] hover:bg-[#0B132B] border border-[#172554] text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
            title="Click to copy User ID"
          >
            {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>ID: {userId.slice(0, 10)}...</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveChanges()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/40 text-xs font-semibold text-[#38BDF8] shadow-glow-burgundy transition-all hover:scale-105"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Master User Card Overview */}
      <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Preview */}
            <div className="relative">
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={name || 'Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#38BDF8]/40 shadow-xl"
                  onError={(e) => {
                    // Fallback on broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#8C2329] border-2 border-[#38BDF8]/30 flex items-center justify-center font-bold text-3xl text-[#38BDF8] shadow-xl">
                  {name ? name[0].toUpperCase() : u.email[0].toUpperCase()}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#070D1E] ${
                  status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-[#E63946]'
                }`}
                title={`Status: ${status}`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                  {name || 'Unnamed Creator'}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/30">
                  {role}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                    status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="text-xs text-[#94A3B8] font-mono flex flex-wrap items-center gap-3">
                <span>{email}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {emailVerified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span className="text-[#94A3B8]">Unverified</span>
                    </>
                  )}
                </span>
                {u.accounts && u.accounts.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-[#38BDF8]/70">OAuth: {u.accounts.map((a: any) => a.provider).join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-[#172554] pt-4 md:pt-0 md:pl-6">
            <div className="p-2.5 rounded-xl bg-[#030712]/80 border border-[#172554]">
              <div className="font-mono text-lg font-bold text-[#38BDF8]">
                {u.projects?.length || 0}
              </div>
              <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Projects</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030712]/80 border border-[#172554]">
              <div className="font-mono text-lg font-bold text-[#38BDF8]">
                {u.projectRequests?.length || 0}
              </div>
              <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Requests</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#030712]/80 border border-[#172554]">
              <div className="font-mono text-lg font-bold text-[#38BDF8]">
                {data.portfolio ? 'Active' : 'None'}
              </div>
              <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Portfolio</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#172554] overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-bold border border-[#38BDF8]/30 shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
            }`}
          >
            Profile & Credentials
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-bold border border-[#38BDF8]/30 shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
            }`}
          >
            Role & Permissions ({Object.keys(overrides).length} Overrides)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-bold border border-[#38BDF8]/30 shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
            }`}
          >
            Projects & Requests ({u.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-bold border border-[#38BDF8]/30 shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
            }`}
          >
            Creator Portfolio
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#2563EB] text-[#F8FAFC] font-bold border border-[#38BDF8]/30 shadow-md'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B132B]'
            }`}
          >
            Security & Sessions ({u.sessions?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: Profile & Credentials */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Editable User Account Information
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">All changes committed to DB</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or public path"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] font-mono text-xs focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Full Platform Access)</option>
                  <option value="SUSPENDED">SUSPENDED (Sessions Revoked)</option>
                  <option value="DISABLED">DISABLED (Administrative Lock)</option>
                </select>
              </div>

              {status === 'SUSPENDED' && (
                <div className="sm:col-span-2 space-y-1.5 p-3 rounded-xl bg-[#030712] border border-[#E63946]/30">
                  <label className="block text-[#E63946] font-mono uppercase text-[10px] tracking-wider font-bold">
                    Suspension Reason (Sent in notification email and shown on user dashboard)
                  </label>
                  <textarea
                    rows={2}
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="e.g. Violation of Terms of Service — Inappropriate content"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-[#172554] focus:border-[#E63946] text-[#F8FAFC] focus:outline-none text-xs leading-relaxed"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Email Verification Status
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailVerified(!emailVerified)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      emailVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-[#0B132B] text-[#94A3B8] border-[#172554]'
                    }`}
                  >
                    {emailVerified ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{emailVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                  </button>
                  <span className="text-[11px] text-[#94A3B8]">
                    {emailVerified ? 'Can access client workspace' : 'Pending OTP verification'}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-[#172554]">
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider flex items-center justify-between">
                  <span>Reset / Change Password</span>
                  <span className="text-[#94A3B8] text-[10px]">Leave blank to retain current password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)..."
                    className="w-full px-3.5 py-2 pr-10 rounded-xl bg-[#030712] border border-[#172554] focus:border-[#2563EB] text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="button"
                onClick={() => handleSaveChanges()}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/40 text-xs font-semibold text-[#38BDF8] flex items-center gap-2 shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>

          {/* Account Metadata & Timestamps */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-3.5 text-xs shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
                <Clock className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
                  Platform Timestamps
                </h3>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-[#172554]/40">
                  <span className="text-[#94A3B8]">Account Created</span>
                  <span className="text-[#F8FAFC]">{new Date(u.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#172554]/40">
                  <span className="text-[#94A3B8]">Last Updated</span>
                  <span className="text-[#F8FAFC]">
                    {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#172554]/40">
                  <span className="text-[#94A3B8]">Internal UUID</span>
                  <span className="text-[#38BDF8]">{userId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Password Set</span>
                  <span className="text-emerald-400">Argon2 / Bcrypt Hashed</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-3 text-xs shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-[#172554]">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#F8FAFC]">
                  Linked Identity Providers
                </h3>
              </div>

              {u.accounts && u.accounts.length > 0 ? (
                <div className="space-y-2">
                  {u.accounts.map((acc: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between font-mono text-[11px]"
                    >
                      <span className="text-[#38BDF8] font-semibold uppercase">{acc.provider}</span>
                      <span className="text-[#94A3B8]">{new Date(acc.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#94A3B8] text-[11px]">
                  Standard NatureStudios email and password credentials.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Role & Permissions Overrides */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Primary Role Selector */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Administrative System Role Assignment
                </h2>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Precedence: DENY &gt; ALLOW &gt; INHERITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                  Primary Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#2563EB] text-[#38BDF8] font-mono font-bold text-xs focus:outline-none"
                >
                  <option value="USER">USER (Standard Client / Creator)</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER (Projects & Briefs)</option>
                  <option value="CONTENT_ADMIN">CONTENT_ADMIN (CMS, Media, Theme)</option>
                  <option value="USER_ADMIN">USER_ADMIN (User Directory & Roles)</option>
                  <option value="SUPPORT">SUPPORT (Support Tickets & Inquiries)</option>
                  <option value="ADMIN">ADMIN (Full Platform Operations)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Wildcard Clearance)</option>
                </select>
                <p className="text-[11px] text-[#94A3B8] mt-1.5">
                  Determines the baseline set of platform permissions inherited by this user.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#030712] border border-[#172554] flex flex-col justify-center text-xs space-y-1">
                <div className="text-[#38BDF8] font-mono font-semibold">Security Enforcement:</div>
                <p className="text-[#94A3B8] text-[11px]">
                  Demoting or suspending the final Super Administrator is permanently blocked by platform policy.
                </p>
              </div>
            </div>
          </div>

          {/* Granular Permission Overrides Table */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#172554]">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                    Granular User Permission Overrides
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Explicitly grant or deny specific privileges for this user, regardless of assigned role.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  placeholder="Filter permissions..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none w-56"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-xl border border-[#172554] divide-y divide-[#172554]/60 scrollbar-thin">
              {filteredAvailablePerms.map((perm: any) => {
                const overrideVal = overrides[perm.key];
                return (
                  <div
                    key={perm.key}
                    className="p-3 bg-[#030712]/60 hover:bg-[#030712] flex items-center justify-between gap-4 text-xs transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#38BDF8]">
                          {perm.key}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#0B132B] text-[#94A3B8] border border-[#172554]">
                          {perm.category}
                        </span>
                        {perm.dangerous && (
                          <span className="text-[9px] font-mono text-[#E63946] flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] truncate max-w-xl">
                        {perm.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOverrideToggle(perm.key, overrideVal === 'RESET' ? undefined : overrideVal)}
                        className={`px-3 py-1 rounded-lg font-mono text-[10px] font-semibold border transition-all ${
                          overrideVal === 'ALLOW'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : overrideVal === 'DENY'
                            ? 'bg-[#E63946]/20 text-[#E63946] border-[#E63946]/30'
                            : 'bg-[#0B132B] text-[#94A3B8] border-[#172554] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {overrideVal === 'ALLOW'
                          ? 'ALLOW (OVERRIDE)'
                          : overrideVal === 'DENY'
                          ? 'DENY (OVERRIDE)'
                          : 'INHERITED'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveChanges()}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#6D1C22] text-xs font-semibold text-[#38BDF8] flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Role & Overrides</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Projects & Requests */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Column */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Associated Client Projects ({u.projects?.length || 0})
                </h3>
              </div>
            </div>

            {u.projects && u.projects.length > 0 ? (
              <div className="space-y-3">
                {u.projects.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#030712] border border-[#172554] space-y-2 text-xs hover:border-[#2563EB] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#F8FAFC]">{p.title}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2563EB] text-[#38BDF8]">
                        {p.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
                      <span>{p.projectType || 'Broadcast Packaging'}</span>
                      <span className="text-[#38BDF8]">{p.budget || 'Custom Budget'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No agency client projects associated with this account.
              </div>
            )}
          </div>

          {/* Requests Column */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Project Briefs & Inquiries ({u.projectRequests?.length || 0})
                </h3>
              </div>
            </div>

            {u.projectRequests && u.projectRequests.length > 0 ? (
              <div className="space-y-3">
                {u.projectRequests.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-[#030712] border border-[#172554] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#38BDF8]">{r.projectType}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#0B132B] text-[#F8FAFC]">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2">{r.message || 'No description provided'}</p>
                    <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono pt-1">
                      <span>Budget: {r.budget}</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No incoming inquiries or briefs from this user.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Creator Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-5 shadow-xl max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                Creator Multi-Tenant Portfolio Profile
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#38BDF8] font-mono mb-1.5 uppercase text-[10px] tracking-wider">
                Portfolio Subdomain / Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#94A3B8]">https://naturestudio.in/portfolio-render/</span>
                <input
                  type="text"
                  value={portfolioSlug}
                  onChange={(e) => setPortfolioSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="username"
                  className="px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#38BDF8] font-mono text-xs focus:outline-none flex-1"
                />
              </div>
            </div>

            {data.portfolio ? (
              <div className="p-4 rounded-2xl bg-[#030712] border border-[#172554] space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Publication Status:</span>
                  <span className="text-emerald-400 font-bold">{data.portfolio.status || 'PUBLISHED'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Selected Theme:</span>
                  <span className="text-[#38BDF8]">{data.portfolio.themeId || 'BURGUNDY_PRO'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Total Page Views:</span>
                  <span className="text-[#F8FAFC]">{data.portfolio.views || 0}</span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/portfolio-render/${data.portfolio.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline"
                  >
                    <span>Open Live Portfolio Render</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#030712] border border-[#172554] text-xs text-[#94A3B8]">
                This user has not yet initialized a custom portfolio page. Setting a slug above will reserve it for them.
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSaveChanges()}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#6D1C22] text-xs font-semibold text-[#38BDF8]"
              >
                Save Portfolio Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Active Sessions */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Active Authentication Sessions ({u.sessions?.length || 0})
                </h3>
              </div>
            </div>

            {u.sessions && u.sessions.length > 0 ? (
              <div className="divide-y divide-[#172554] border border-[#172554] rounded-2xl overflow-hidden">
                {u.sessions.map((sess: any) => (
                  <div
                    key={sess.id}
                    className="p-3.5 bg-[#030712] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="text-[#F8FAFC]">{sess.userAgent || 'Unknown Device'}</div>
                      <div className="text-[#94A3B8] text-[11px]">
                        IP: {sess.ipAddress || '127.0.0.1'} • Created: {new Date(sess.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#94A3B8]">
                No active web sessions recorded for this user.
              </div>
            )}
          </div>

          {/* Audit History Associated with User */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#172554] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#172554]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-[#F8FAFC]">
                  Associated Administrative Audit Trail
                </h3>
              </div>
            </div>

            {data.recentAudits && data.recentAudits.length > 0 ? (
              <div className="space-y-2">
                {data.recentAudits.map((a: any) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-[#030712] border border-[#172554] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#0B132B] text-[#38BDF8]">
                        {a.action}
                      </span>
                      <span className="text-[#94A3B8]">{a.resourceType}</span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-[#94A3B8]">
                No administrative audit actions recorded yet.
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-3xl bg-[#070D1E] border border-[#E63946]/40 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E63946]/30 text-[#E63946]">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-syne font-bold text-sm uppercase tracking-wider">
                Danger Zone & Permanent Deletion
              </h3>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Permanently delete this user account, their active sessions, and multi-tenant portfolio. This operation is immediate and irreversible.
            </p>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-[#E63946]/10 hover:bg-[#E63946]/20 border border-[#E63946]/30 text-xs font-semibold text-[#E63946] flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete User Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070D1E] border border-[#E63946] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#E63946]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-syne font-bold text-base">Confirm Destructive Action</h3>
            </div>

            <p className="text-[#94A3B8] leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-[#F8FAFC]">{email}</strong>?
            </p>

            <div>
              <label className="block text-[#94A3B8] mb-1 font-mono">
                Type <span className="text-[#F8FAFC] font-bold">DELETE USER</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmPhrase}
                onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                placeholder="DELETE USER"
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting || deleteConfirmPhrase !== 'DELETE USER'}
                className="px-4 py-2 rounded-xl bg-[#E63946] hover:bg-[#D62839] disabled:opacity-40 text-[#F8FAFC] font-semibold"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
