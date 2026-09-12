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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              RBAC Role Architecture
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Database-Backed
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            System & custom role hierarchies governing administrative actions across the platform.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('roles.create')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#FED7B8]" />
            <span>Create Custom Role</span>
          </button>
        )}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading RBAC role definitions...
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id || role.slug}
              className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-sm text-[#FFF5ED]">{role.name}</span>
                  {role.systemRole ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#59171B]/60 text-[#FED7B8] border border-[#FED7B8]/20">
                      <Lock className="w-2.5 h-2.5" />
                      System
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] text-[#B89B8D] border border-[#3D0D13]">
                      Custom
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#FED7B8]/80">{role.slug}</div>
                <p className="text-xs text-[#B89B8D] leading-relaxed line-clamp-2">
                  {role.description || 'Custom administrative role configured for specialized staff operations.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3D0D13] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#FED7B8]">
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
                      className="p-1.5 rounded-lg text-[#B89B8D] hover:text-[#E63946] hover:bg-[#240709] transition-colors"
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
          <div className="w-full max-w-md bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <h3 className="font-syne text-base font-bold text-[#FFF5ED]">
                Create Custom RBAC Role
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#B89B8D] hover:text-[#FFF5ED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="text-[#B89B8D] block mb-1">Role Display Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!formSlug) setFormSlug(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                  }}
                  placeholder="e.g. Broadcast Lead"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#59171B]"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Machine Slug Key</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. BROADCAST_LEAD"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] font-mono focus:outline-none focus:border-[#59171B]"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Operational remit and staff privileges for this role..."
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] focus:outline-none focus:border-[#59171B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
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
