'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Key,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  HelpCircle,
  AlertTriangle,
  Lock,
  Layers,
  Check,
  X,
} from 'lucide-react';

export default function AdminPermissionsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const [permRes, roleRes] = await Promise.all([
        fetch('/api/admin/permissions'),
        fetch('/api/admin/roles'),
      ]);

      if (permRes.ok) {
        const pData = await permRes.json();
        setPermissions(pData.permissions || []);
        const rawCats = pData.categories;
        const catList: string[] = Array.isArray(rawCats)
          ? rawCats
          : typeof rawCats === 'object' && rawCats !== null
          ? Object.keys(rawCats)
          : [];
        setCategories(catList);

        let loadedRoles: any[] = [];
        if (roleRes.ok) {
          try {
            const rData = await roleRes.json();
            if (Array.isArray(rData.roles) && rData.roles.length > 0) {
              loadedRoles = rData.roles;
            }
          } catch {
            // ignore
          }
        }
        if (loadedRoles.length === 0 && Array.isArray(pData.roles)) {
          loadedRoles = pData.roles;
        }
        setRoles(loadedRoles);
      }
    } catch (err) {
      console.error('Failed to load permission matrix', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  useEffect(() => {
    if (roles.length > 0 && !roles.some((r) => r.slug === selectedRole)) {
      setSelectedRole(roles[0].slug);
    }
  }, [roles, selectedRole]);

  const currentRoleObj = roles.find((r) => r?.slug === selectedRole);
  const currentRolePerms: string[] = Array.isArray(currentRoleObj?.permissions)
    ? currentRoleObj.permissions
    : [];

  const handleTogglePermission = async (permKey: string) => {
    if (!isSuperAdmin && !hasPermission('permissions.assign')) {
      alert('You lack permissions.assign authority.');
      return;
    }

    if (selectedRole === 'SUPER_ADMIN') {
      alert('SUPER_ADMIN maintains immutable wildcard (*) permissions.');
      return;
    }

    if (!currentRoleObj) return;

    const has = currentRolePerms.includes(permKey);
    const updated = has
      ? currentRolePerms.filter((p) => p !== permKey)
      : [...currentRolePerms, permKey];

    setSaving(true);
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: currentRoleObj.slug || selectedRole,
          permissions: updated,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update role permissions');
      }

      setRoles((prev) =>
        prev.map((r) => (r.slug === selectedRole ? { ...r, permissions: updated } : r))
      );
      setToastMessage(`Updated ${permKey} for ${selectedRole}`);
    } catch (err: any) {
      alert(err.message || 'Error updating permission');
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = permissions.filter((p) => {
    if (!p) return false;
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const keyStr = (p.key || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const query = (search || '').toLowerCase().trim();
    const matchesSearch = !query || keyStr.includes(query) || descStr.includes(query);
    return matchesCategory && matchesSearch;
  });


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
              50+ Granular Permissions Matrix
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Precedence Model: DENY &gt; ALLOW
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Deterministic evaluation engine. Explicit User DENY strictly overrides inherited role ALLOWs.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#B89B8D] font-mono uppercase">Target Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#150304] border border-[#59171B] text-xs font-mono font-semibold text-[#FED7B8] focus:outline-none"
          >
            {roles.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} ({r.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-medium uppercase transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#59171B] text-[#FFF5ED] font-semibold'
                : 'bg-[#1D0608] text-[#B89B8D] hover:text-[#FFF5ED]'
            }`}
          >
            All Categories ({permissions.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium uppercase whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#59171B] text-[#FFF5ED] font-semibold'
                  : 'bg-[#1D0608] text-[#B89B8D] hover:text-[#FFF5ED]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#B89B8D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permission key or desc..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] placeholder-[#B89B8D]/50 focus:outline-none focus:border-[#59171B] w-64"
          />
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#150304] border-b border-[#3D0D13] text-[#FED7B8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Permission Key</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-4 py-3.5">Classification</th>
                <th className="px-5 py-3.5 text-right">{selectedRole} Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D0D13]/60 text-[#FFF5ED]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    Loading permission definitions...
                  </td>
                </tr>
              ) : filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    No permissions match your filter.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((p) => {
                  const isGranted =
                    selectedRole === 'SUPER_ADMIN' || currentRolePerms.includes(p.key);

                  return (
                    <tr key={p.key} className="hover:bg-[#240709]/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#FED7B8] font-semibold">
                        {p.key}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] text-[#B89B8D] border border-[#3D0D13]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#B89B8D] max-w-md">{p.description}</td>
                      <td className="px-4 py-3.5">
                        {p.dangerous ? (
                          <span className="inline-flex items-center gap-1 text-[#E63946] text-[10px] font-mono font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#B89B8D]">STANDARD</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {selectedRole === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                            <Check className="w-3 h-3" />
                            ALL (SUPER)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTogglePermission(p.key)}
                            disabled={saving}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all inline-flex items-center gap-1.5 ${
                              isGranted
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                                : 'bg-[#150304] text-[#B89B8D] hover:bg-[#240709] border border-[#3D0D13]'
                            }`}
                          >
                            {isGranted ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>ALLOW</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                <span>DENIED</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
