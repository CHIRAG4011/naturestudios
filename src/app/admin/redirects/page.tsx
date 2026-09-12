'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  SearchCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function AdminRedirectsPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/redirects');
      if (res.ok) {
        const data = await res.json();
        setRedirects(data.redirects || []);
      }
    } catch (err) {
      console.error('Failed to load redirects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;
    if (source.trim() === destination.trim()) {
      alert('Redirect loop detected: source cannot match destination.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: source.trim(),
          destination: destination.trim(),
          statusCode,
          enabled: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create redirect');
      }

      setShowCreateModal(false);
      setSource('');
      setDestination('');
      setToastMessage('Redirect created successfully.');
      fetchRedirects();
    } catch (err: any) {
      alert(err.message || 'Error creating redirect');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return;
    try {
      const res = await fetch(`/api/admin/redirects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete redirect');
      setToastMessage('Redirect deleted.');
      fetchRedirects();
    } catch (err: any) {
      alert(err.message || 'Error deleting redirect');
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
              URL Redirect Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              Loop-Protected
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Configure 301 Permanent and 302 Temporary redirects for legacy route migrations.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('seo.edit')) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#FED7B8]" />
            <span>Add Redirect Rule</span>
          </button>
        )}
      </div>

      {/* Redirects Table */}
      <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#150304] border-b border-[#3D0D13] text-[#FED7B8]/70 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Source URL</th>
                <th className="px-5 py-3.5">Destination URL</th>
                <th className="px-4 py-3.5">Status Code</th>
                <th className="px-4 py-3.5">State</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D0D13]/60 text-[#FFF5ED]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    Loading redirect rules...
                  </td>
                </tr>
              ) : redirects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                    No redirect rules configured.
                  </td>
                </tr>
              ) : (
                redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-[#240709]/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#FED7B8]">{r.source}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#FFF5ED]">
                      {r.destination}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#150304] text-[#FED7B8] border border-[#3D0D13]">
                        {r.statusCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                          r.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#150304] text-[#B89B8D]'
                        }`}
                      >
                        {r.enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {(isSuperAdmin || hasPermission('seo.edit')) && (
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-[#B89B8D] hover:text-[#E63946] hover:bg-[#240709] transition-colors"
                          title="Delete Redirect"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
              <h3 className="font-syne text-base font-bold text-[#FFF5ED]">
                Create Redirect Rule
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#B89B8D] hover:text-[#FFF5ED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRedirect} className="space-y-3">
              <div>
                <label className="text-[#B89B8D] block mb-1">Source Path</label>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="/old-portfolio-path"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FED7B8] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">Destination URL or Path</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="/portfolio"
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#B89B8D] block mb-1">HTTP Status Code</label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}
                  className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                >
                  <option value={301}>301 (Moved Permanently)</option>
                  <option value={302}>302 (Found / Temporary)</option>
                </select>
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
                  {saving ? 'Creating...' : 'Create Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
