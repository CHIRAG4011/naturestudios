'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [adminFilter, setAdminFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '25',
        ...(adminFilter && { adminEmail: adminFilter }),
        ...(actionFilter && { action: actionFilter }),
        ...(resourceFilter && { resource: resourceFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleExportCsv = () => {
    if (!isSuperAdmin && !hasPermission('audit.export')) {
      alert('You lack audit.export authority.');
      return;
    }

    const headers = ['Timestamp', 'Admin', 'Action', 'Resource', 'ResourceID', 'Status', 'IP'];
    const rows = logs.map((l) => [
      l.createdAt,
      l.adminEmail,
      l.action,
      l.resource,
      l.resourceId || '',
      l.status,
      l.ip || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `naturestudios-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1D0608] border border-[#59171B]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5ED]">
              Immutable Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Cryptographically Sanitized
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Tamper-resistant historical ledger of all administrative decisions, RBAC alterations, and security operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isSuperAdmin || hasPermission('audit.export')) && (
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-xs font-medium text-[#FED7B8] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={adminFilter}
          onChange={(e) => setAdminFilter(e.target.value)}
          placeholder="Filter admin email..."
          className="px-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] placeholder-[#B89B8D]/50 focus:outline-none focus:border-[#59171B]"
        />

        <input
          type="text"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          placeholder="Filter action (e.g. ROLE_CHANGED)..."
          className="px-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] placeholder-[#B89B8D]/50 focus:outline-none focus:border-[#59171B]"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#150304] border border-[#3D0D13] text-xs text-[#FFF5ED] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-[#59171B] hover:bg-[#6D1C22] text-xs font-semibold text-[#FFF5ED] transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Audit Table */}
      <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#150304] border-b border-[#3D0D13] text-[#FED7B8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Action & Resource</th>
                <th className="px-4 py-3.5">Admin Staff</th>
                <th className="px-4 py-3.5">Details</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D0D13]/60 text-[#FFF5ED]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    Loading audit events...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#240709]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#FED7B8] font-mono text-[11px]">
                        {log.action}
                      </div>
                      <div className="text-[10px] text-[#B89B8D] font-mono">
                        Resource: {log.resource} {log.resourceId ? `(${log.resourceId})` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#FFF5ED]">
                      {log.adminEmail}
                    </td>
                    <td className="px-4 py-3.5 text-[#B89B8D] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-[11px] text-[#B89B8D] font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-[#150304] border-t border-[#3D0D13] flex items-center justify-between text-xs text-[#B89B8D]">
          <div>
            Showing Page <span className="font-semibold text-[#FFF5ED]">{page}</span> of{' '}
            <span className="font-semibold text-[#FFF5ED]">{totalPages}</span> ({total} records)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg bg-[#240709] hover:bg-[#320B0F] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFF5ED]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg bg-[#240709] hover:bg-[#320B0F] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFF5ED]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
