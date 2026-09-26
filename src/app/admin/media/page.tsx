'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Plus,
  X,
  Loader2,
} from 'lucide-react';

export default function AdminMediaPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // URL modal
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [folderInput, setFolderInput] = useState('general');
  const [registering, setRegistering] = useState(false);

  // Preview modal
  const [previewAsset, setPreviewAsset] = useState<any | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.media || data.assets || []);
      }
    } catch (err) {
      console.error('Failed to load media assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety checks: reject executables, html, scripts
    const forbidden = ['.exe', '.sh', '.bat', '.js', '.html', '.php', '.dll'];
    if (forbidden.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      alert('Executable or dangerous file types are rejected by media security.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);
      formData.append('folder', 'general');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setToastMessage(`Media asset "${file.name}" uploaded successfully.`);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRegisterUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !nameInput.trim()) return;

    setRegistering(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.trim(),
          url: urlInput.trim(),
          folder: folderInput,
          altText: nameInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register image URL');

      setToastMessage(`Image "${nameInput.trim()}" registered to library.`);
      setShowUrlModal(false);
      setUrlInput('');
      setNameInput('');
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Error registering image');
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteAsset = async (id: string, name: string) => {
    const confirm = window.confirm(`Delete media asset "${name}" permanently?`);
    if (!confirm) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete asset');

      setToastMessage(`Asset "${name}" removed.`);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Error deleting asset');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-[#0B132B] border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070D1E] border border-[#2563EB]/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Media Asset Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2563EB] text-[#38BDF8] border border-[#38BDF8]/20">
              {assets.length} Stored Assets
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Studio branding imagery, hero assets, tournament logos, and creator media. Direct upload or CDN URL registration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isSuperAdmin || hasPermission('media.upload')) && (
            <>
              <button
                onClick={() => setShowUrlModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-xs font-semibold text-[#38BDF8] flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add by URL</span>
              </button>

              <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] border border-[#38BDF8]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-2 shadow-lg cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-[#38BDF8]" />
                <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              </label>
            </>
          )}

          <button
            onClick={fetchMedia}
            className="p-2 rounded-xl bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#38BDF8]" />
            <span>Loading media library assets...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#94A3B8]">
            No uploaded media assets found in database.
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl bg-[#070D1E] border border-[#172554] hover:border-[#2563EB] overflow-hidden transition-all group space-y-2 p-2 flex flex-col justify-between"
            >
              <div
                onClick={() => setPreviewAsset(asset)}
                className="aspect-square rounded-xl bg-[#030712] flex items-center justify-center overflow-hidden relative cursor-pointer"
              >
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#38BDF8]/40" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#38BDF8] text-[11px] font-mono">
                  Click to Zoom
                </div>
              </div>

              <div className="px-1 text-xs space-y-1">
                <div className="font-semibold text-[#F8FAFC] truncate" title={asset.name}>
                  {asset.name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
                  <span>{(asset.size ? asset.size / 1024 : 150).toFixed(0)} KB</span>
                  <span className="uppercase text-[#38BDF8]/70">{asset.folder || 'general'}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[#172554]/60 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset.url)}
                  className="flex-1 py-1 px-2 rounded-lg bg-[#0B132B] hover:bg-[#111C35] border border-[#172554] text-[10px] font-mono text-[#38BDF8] flex items-center justify-center gap-1 transition-colors"
                  title="Copy image URL"
                >
                  {copiedUrl === asset.url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                {(isSuperAdmin || hasPermission('media.delete')) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(asset.id, asset.name)}
                    className="p-1.5 rounded-lg bg-[#E63946]/10 hover:bg-[#E63946]/20 text-[#E63946] transition-colors"
                    title="Delete image asset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add by URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md bg-[#070D1E] border border-[#2563EB] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#172554] pb-3">
              <h3 className="font-syne text-base font-bold text-[#F8FAFC]">
                Register External Image URL
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterUrl} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#38BDF8] font-mono mb-1 uppercase text-[10px]">
                  Asset Name / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valorant Champions Hero Plate"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#38BDF8] font-mono mb-1 uppercase text-[10px]">
                  Direct Image URL (HTTPS)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or CDN link"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#38BDF8] font-mono mb-1 uppercase text-[10px]">
                  Folder Category
                </label>
                <select
                  value={folderInput}
                  onChange={(e) => setFolderInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-[#172554] text-[#F8FAFC]"
                >
                  <option value="general">General Media</option>
                  <option value="hero">Hero Backgrounds</option>
                  <option value="studio">Studio Plates</option>
                  <option value="work">Project Showcases</option>
                  <option value="branding">Brand Identity</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B132B] text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#721C22] text-[#38BDF8] font-semibold"
                >
                  {registering ? 'Registering...' : 'Save to Media Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewAsset && (
        <div
          onClick={() => setPreviewAsset(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-100"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl max-h-[85vh] bg-[#070D1E] border border-[#2563EB] rounded-3xl overflow-hidden p-4 space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between border-b border-[#172554] pb-2 text-xs">
              <span className="font-semibold text-[#F8FAFC]">{previewAsset.name}</span>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-hidden rounded-2xl flex items-center justify-center bg-black">
              <img
                src={previewAsset.url}
                alt={previewAsset.altText || previewAsset.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-1">
              <span className="truncate max-w-md">{previewAsset.url}</span>
              <button
                onClick={() => handleCopyUrl(previewAsset.url)}
                className="px-3 py-1 rounded-lg bg-[#2563EB] text-[#38BDF8] font-bold"
              >
                {copiedUrl === previewAsset.url ? 'Copied URL!' : 'Copy Direct Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
