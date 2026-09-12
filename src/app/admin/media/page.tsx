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
} from 'lucide-react';

export default function AdminMediaPage() {
  const { hasPermission, isSuperAdmin } = useAdmin();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
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

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      setToastMessage(`Media asset ${file.name} uploaded successfully.`);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
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
              Media Asset Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/20">
              {assets.length} Stored Assets
            </span>
          </div>
          <p className="text-xs text-[#B89B8D] mt-1">
            Studio branding imagery, hero background assets, tournament logos, and creator media.
          </p>
        </div>

        {(isSuperAdmin || hasPermission('media.upload')) && (
          <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#59171B] to-[#7B1F25] hover:from-[#6A1B20] hover:to-[#8E242B] border border-[#FED7B8]/30 text-xs font-semibold text-[#FFF5ED] flex items-center gap-2 shadow-lg cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-[#FED7B8]" />
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            Loading media assets...
          </div>
        ) : assets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#B89B8D]">
            No uploaded media assets yet.
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl bg-[#1D0608] border border-[#3D0D13] hover:border-[#59171B] overflow-hidden transition-all group space-y-2 p-2"
            >
              <div className="aspect-square rounded-xl bg-[#150304] flex items-center justify-center overflow-hidden relative">
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#FED7B8]/40" />
                )}
              </div>

              <div className="px-1 text-xs">
                <div className="font-semibold text-[#FFF5ED] truncate">{asset.name}</div>
                <div className="text-[10px] text-[#B89B8D] font-mono">
                  {(asset.size ? asset.size / 1024 : 12).toFixed(1)} KB
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
