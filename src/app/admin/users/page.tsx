'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  UserCheck,
  UserX,
  LogOut,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Eye,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states for dangerous actions
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionType, setActionType] = useState<
    'SUSPEND' | 'UNSUSPEND' | 'VERIFY' | 'FORCE_LOGOUT' | 'DELETE' | 'CHANGE_ROLE' | null
  >(null);
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [targetRole, setTargetRole] = useState('ADMIN');
  const [suspendReason, setSuspendReason] = useState('Violation of Terms of Service');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleExecuteAction = async () => {
    if (!selectedUser || !actionType) return;
    setActionLoading(true);

    try {
      if (actionType === 'DELETE') {
        if (typedConfirmation !== 'DELETE USER') {
          alert('Please type "DELETE USER" exactly to confirm.');
          setActionLoading(false);
          return;
        }

        const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirmationPhrase: typedConfirmation }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to delete user');
        }

        setToastMessage(`User ${selectedUser.email} deleted permanently.`);
      } else if (actionType === 'CHANGE_ROLE') {
        const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: targetRole }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to update role');
        }

        setToastMessage(`Role for ${selectedUser.email} updated to ${targetRole}.`);
      } else {
        // SUSPEND, UNSUSPEND, VERIFY, FORCE_LOGOUT
        const bodyMap: Record<string, any> = {
          SUSPEND: { status: 'SUSPENDED', reason: suspendReason },
          UNSUSPEND: { status: 'ACTIVE' },
          VERIFY: { emailVerified: true },
          FORCE_LOGOUT: { forceLogout: true },
        };

        const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyMap[actionType]),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Operation failed');
        }

        if (actionType === 'SUSPEND') {
          setToastMessage(`Account for ${selectedUser.email} suspended. Suspension email dispatched.`);
        } else if (actionType === 'UNSUSPEND') {
          setToastMessage(`Account for ${selectedUser.email} reinstated. Notification email dispatched.`);
        } else {
          setToastMessage(`Action ${actionType} completed successfully.`);
        }
      }

      setActionType(null);
      setSelectedUser(null);
      setTypedConfirmation('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-[#0B132B] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              User Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {total} Accounts
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage user accounts, RBAC assignments, security statuses, and active sessions.
          </p>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#2563EB] w-48 sm:w-60"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
            <option value="USER_ADMIN">USER_ADMIN</option>
            <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
            <option value="USER">USER</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="DISABLED">DISABLED</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#6D1C22] text-xs font-semibold text-[#F8FAFC] transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* User Table */}
      <div className="rounded-3xl bg-[#070D1E] border border-[#172554] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030712] border-b border-[#172554] text-[#38BDF8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Verified</th>
                <th className="px-4 py-3.5">Portfolio</th>
                <th className="px-4 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172554]/60 text-[#F8FAFC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#94A3B8]">
                    Loading user records from MongoDB Atlas...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#94A3B8]">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0B132B]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-[#2563EB] border border-[#38BDF8]/20 flex items-center justify-center font-bold text-xs text-[#38BDF8] group-hover:scale-105 transition-transform">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">{u.name || 'Unnamed Creator'}</div>
                          <div className="text-[11px] text-[#94A3B8] font-mono">{u.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/30'
                            : u.role === 'ADMIN'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-[#030712] text-[#94A3B8] border border-[#172554]'
                        }`}
                      >
                        {u.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20'
                        }`}
                      >
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {u.emailVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#38BDF8]/80">
                      {u.portfolioSlug ? `@${u.portfolioSlug}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-[#94A3B8] text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#2563EB]/50 hover:bg-[#2563EB] border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 text-[11px] text-[#38BDF8] font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View & Edit</span>
                        </Link>

                        {(isSuperAdmin || hasPermission('users.change_role')) && (
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole(u.role || 'ADMIN');
                              setActionType('CHANGE_ROLE');
                            }}
                            className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-[#38BDF8] transition-colors"
                            title="Assign Role"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(isSuperAdmin || hasPermission('users.suspend')) && (
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType(u.status === 'SUSPENDED' ? 'UNSUSPEND' : 'SUSPEND');
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === 'SUSPENDED'
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            }`}
                            title={u.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
                          >
                            {u.status === 'SUSPENDED' ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserX className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        {(isSuperAdmin || hasPermission('users.force_logout')) && (
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType('FORCE_LOGOUT');
                            }}
                            className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] text-amber-400 transition-colors"
                            title="Force Logout"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(isSuperAdmin || hasPermission('users.delete')) && (
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType('DELETE');
                            }}
                            className="p-1.5 rounded-lg bg-[#E63946]/10 hover:bg-[#E63946]/20 text-[#E63946] transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-[#030712] border-t border-[#172554] flex items-center justify-between text-xs text-[#94A3B8]">
          <div>
            Showing Page <span className="font-semibold text-[#F8FAFC]">{page}</span> of{' '}
            <span className="font-semibold text-[#F8FAFC]">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] disabled:opacity-40 disabled:cursor-not-allowed text-[#F8FAFC]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg bg-[#0B132B] hover:bg-[#111C35] disabled:opacity-40 disabled:cursor-not-allowed text-[#F8FAFC]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dangerous Action Modal */}
      {actionType && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-[#070D1E] border border-[#2563EB] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-[#38BDF8]">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#E63946]" />
              </div>
              <div>
                <h3 className="font-syne text-base font-bold text-[#F8FAFC]">
                  Confirm {actionType.replace('_', ' ')}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Target: <span className="text-[#38BDF8]">{selectedUser.email}</span>
                </p>
              </div>
            </div>

            {actionType === 'DELETE' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-[#030712] border border-[#E63946]/30 text-xs">
                <p className="text-[#E63946] font-semibold">
                  WARNING: This action is permanent and irreversible.
                </p>
                <p className="text-[#94A3B8]">
                  To prevent accidental deletions, please type the confirmation phrase below:
                </p>
                <div className="font-mono text-[#38BDF8] font-bold">DELETE USER</div>
                <input
                  type="text"
                  value={typedConfirmation}
                  onChange={(e) => setTypedConfirmation(e.target.value)}
                  placeholder="Type DELETE USER"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B132B] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#E63946]"
                />
              </div>
            )}

            {actionType === 'CHANGE_ROLE' && (
              <div className="space-y-2">
                <label className="text-xs text-[#94A3B8]">Select New Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC]"
                >
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                  <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
            )}

            {actionType === 'SUSPEND' && (
              <div className="space-y-3">
                <p className="text-xs text-[#94A3B8]">
                  Suspended accounts will lose creative access and public portfolio publishing. An official notification email with the suspension reason and appeal ticket instructions will be dispatched to this creator.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8]">
                    Select Suspension Reason
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setSuspendReason(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#E63946]"
                  >
                    <option value="Violation of Terms of Service">Violation of Terms of Service</option>
                    <option value="Inappropriate or copyright-infringing content">Inappropriate or copyright-infringing content</option>
                    <option value="Suspicious, spam, or automated bot activity">Suspicious, spam, or automated bot activity</option>
                    <option value="Abusive conduct or harassment toward other users/staff">Abusive conduct or harassment toward other users/staff</option>
                    <option value="Payment or billing dispute">Payment or billing dispute</option>
                    <option value="custom">Custom Reason (Type below)...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8]">
                    Reason Details / Note for Creator
                  </label>
                  <textarea
                    rows={3}
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Describe the reason for suspension (sent in user notification email)..."
                    className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#E63946] leading-relaxed"
                  />
                </div>
              </div>
            )}

            {actionType === 'FORCE_LOGOUT' && (
              <p className="text-xs text-[#94A3B8]">
                This will invalidate all active sessions for this user across all browsers and devices.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionType(null);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] text-xs text-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#E63946] hover:bg-[#C92A36] text-xs font-semibold text-white transition-colors"
              >
                {actionLoading ? 'Executing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
