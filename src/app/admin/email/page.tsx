'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Mail,
  Send,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  RefreshCw,
  Edit2,
  Save,
} from 'lucide-react';

export default function AdminEmailPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [emailData, setEmailData] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'logs'>('overview');
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchEmailData = async () => {
    try {
      setLoading(true);
      const [res1, res2, res3] = await Promise.all([
        fetch('/api/admin/email'),
        fetch('/api/admin/email/templates'),
        fetch('/api/admin/email/logs'),
      ]);

      if (res1.ok) setEmailData(await res1.json());
      if (res2.ok) {
        const d = await res2.json();
        setTemplates(d.templates || []);
      }
      if (res3.ok) {
        const d = await res3.json();
        setLogs(d.logs || []);
      }
    } catch (err) {
      console.error('Failed to load email telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    try {
      const res = await fetch('/api/admin/email/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingTemplate.slug,
          subject: editingTemplate.subject,
          bodyHtml: editingTemplate.bodyHtml,
          enabled: editingTemplate.enabled,
        }),
      });

      if (!res.ok) throw new Error('Failed to update template');
      setToastMessage(`Template "${editingTemplate.name}" updated successfully.`);
      setEditingTemplate(null);
      fetchEmailData();
    } catch (err: any) {
      alert(err.message || 'Error updating template');
    }
  };

  const mailboxes = [
    { label: 'Inquiries Mailbox', email: 'inquiries@naturestudio.in', purpose: 'Studio client project bookings' },
    { label: 'Administrative Mailbox', email: 'admin@naturestudio.in', purpose: 'Platform security & alerts' },
    { label: 'General / Hello', email: 'hello@naturestudio.in', purpose: 'General community contact' },
    { label: 'Creator Support', email: 'support@naturestudio.in', purpose: 'Portfolio & account assistance' },
    { label: 'Transactional / Noreply', email: 'noreply@naturestudio.in', purpose: 'OTP codes & verification' },
    { label: 'Portfolio Contact', email: 'portfolio@naturestudio.in', purpose: 'Subdomain creator inquiry routing' },
  ];

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
              Resend Email Infrastructure
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              naturestudio.in Verified
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            DKIM/SPF authenticated mailboxes, transactional templates, and real delivery audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchEmailData}
            className="p-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] border border-[#3D0D13] text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#3D0D13] text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-[#FED7B8] text-[#FED7B8]'
              : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Routing & Mailboxes</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'border-[#FED7B8] text-[#FED7B8]'
              : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Transactional Templates ({templates.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-[#FED7B8] text-[#FED7B8]'
              : 'border-transparent text-[#B89B8D] hover:text-[#FFF5ED]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Delivery Logs</span>
        </button>
      </div>

      {/* Tab 1: Overview & Routing */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mailboxes.map((box) => (
              <div
                key={box.email}
                className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#FFF5ED]">{box.label}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-mono text-xs text-[#FED7B8] font-semibold">{box.email}</div>
                <p className="text-[11px] text-[#B89B8D]">{box.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.slug}
                className="p-5 rounded-2xl bg-[#1D0608] border border-[#3D0D13] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-[#FFF5ED]">{tpl.name}</div>
                    <div className="font-mono text-[10px] text-[#FED7B8]">{tpl.slug}</div>
                  </div>
                  {(isSuperAdmin || hasPermission('email.templates.edit')) && (
                    <button
                      onClick={() => setEditingTemplate({ ...tpl })}
                      className="p-1.5 rounded-lg bg-[#240709] hover:bg-[#320B0F] text-[#FED7B8] transition-colors"
                      title="Edit Template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#B89B8D]">
                  Subject: <span className="text-[#FFF5ED]">{tpl.subject}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {(tpl.variables || []).map((v: string) => (
                    <span
                      key={v}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#150304] text-[#FED7B8] border border-[#3D0D13]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Template Edit Modal */}
          {editingTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-[#1D0608] border border-[#59171B] rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#3D0D13]">
                  <h3 className="font-syne text-base font-bold text-[#FFF5ED]">
                    Edit Template: {editingTemplate.name}
                  </h3>
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="text-[#B89B8D] hover:text-[#FFF5ED]"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="text-[#B89B8D] block mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) =>
                      setEditingTemplate((prev: any) => ({ ...prev, subject: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED]"
                  />
                </div>

                <div>
                  <label className="text-[#B89B8D] block mb-1">HTML Body</label>
                  <textarea
                    rows={6}
                    value={editingTemplate.bodyHtml}
                    onChange={(e) =>
                      setEditingTemplate((prev: any) => ({ ...prev, bodyHtml: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#150304] border border-[#3D0D13] text-[#FFF5ED] font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 rounded-xl bg-[#240709] hover:bg-[#320B0F] text-[#FFF5ED]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 rounded-xl bg-[#59171B] hover:bg-[#6E1C23] font-semibold text-[#FFF5ED]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl bg-[#1D0608] border border-[#3D0D13] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#150304] border-b border-[#3D0D13] text-[#FED7B8]/70 uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-4 py-3.5">Template</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D0D13]/60 text-[#FFF5ED]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#B89B8D]">
                      No transactional emails dispatched yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log: any, i: number) => (
                    <tr key={i} className="hover:bg-[#240709]/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-[#FED7B8]">
                        {log.recipient}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[10px] text-[#B89B8D]">
                        {log.templateSlug}
                      </td>
                      <td className="px-4 py-3.5 text-[#FFF5ED] max-w-xs truncate">{log.subject}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold ${
                            log.status === 'SENT'
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
        </div>
      )}
    </div>
  );
}
