'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Lock,
  Users,
  Key,
} from 'lucide-react';

export default function AdminRolesPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/roles');
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles || []);
      }
    } catch (err) {
      console.error('Failed to load roles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug.toUpperCase().replace(/\s+/g, '_'),
          description: formDesc,
          permissions: [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create role');
      }

      setShowCreateModal(false);
      setFormName('');
      setFormSlug('');
      setFormDesc('');
      fetchRoles();
    } catch (err: any) {
      alert(err.message || 'Error creating role');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.systemRole) {
      alert('System-critical roles cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete role "${role.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete role');
      }
      fetchRoles();
    } catch (err: any) {
      alert(err.message || 'Error deleting role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              RBAC Role Architecture
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              Database-Backed
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            System & custom role hierarchies governing administrative actions across the platform.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('roles.create')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#38BDF8]" />
            <span>Create Custom Role</span>
          </button>
        )}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#94A3B8]">
            Loading RBAC role definitions...
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id || role.slug}
              className="p-5 rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-sm text-[#F8FAFC]">{role.name}</span>
                  {role.systemRole ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2563EB]/60 text-[#38BDF8] border border-[#38BDF8]/20">
                      <Lock className="w-2.5 h-2.5" />
                      System
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#030712] text-[#94A3B8] border border-[#172554]">
                      Custom
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#38BDF8]/80">{role.slug}</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                  {role.description || 'Custom administrative role configured for specialized staff operations.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#172554] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#38BDF8]">
                  <Key className="w-3.5 h-3.5" />
                  <span>
                    {role.slug === 'SUPER_ADMIN'
                      ? 'ALL PERMISSIONS (*)'
                      : `${role.permissions?.length || 0} permissions`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {!role.systemRole && (isSuperAdmin || hasPermission('roles.delete')) && (
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#E63946] hover:bg-[#0B132B] transition-colors"
                      title="Delete Role"
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

      {/* Create Custom Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070D1E] border border-[#2563EB] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#172554]">
              <h3 className="font-syne text-base font-bold text-[#F8FAFC]">
                Create Custom RBAC Role
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Role Display Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!formSlug) setFormSlug(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                  }}
                  placeholder="e.g. Broadcast Lead"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Machine Slug Key</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. BROADCAST_LEAD"
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] font-mono focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Operational remit and staff privileges for this role..."
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
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
                  {saving ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
