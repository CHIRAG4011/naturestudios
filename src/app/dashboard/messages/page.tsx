'use client';

import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { MessageThread } from '@/components/dashboard/MessageThread';

export default function DashboardMessagesPage() {
  const { user } = useAuth();
  const { projects, loadingData, selectedProject, setSelectedProject } = useDashboard();

  return (
    <div className="space-y-6">
      <header>
        <span className="section-label">Workspace</span>
        <h1 className="mt-1.5 text-display-sm font-black uppercase leading-none tracking-tight text-cream">
          Messages
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-dim">
          Each project has its own channel to the studio team. Pick one to open the thread.
        </p>
      </header>

      {loadingData ? (
        <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-16">
          <Loader2 className="h-6 w-6 animate-spin text-forest-light" aria-hidden="true" />
        </div>
      ) : projects.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-rim bg-surface-card/40 p-12 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-rim" aria-hidden="true" />
          <h2 className="text-sm font-bold text-cream">No channels yet</h2>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-cream-muted">
            Channels open automatically once you register your first project brief.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Channel list */}
          <nav aria-label="Project channels" className="lg:col-span-4">
            <ul className="divide-y divide-rim overflow-hidden rounded-xl border border-rim bg-surface-card/60">
              {projects.map((p) => {
                const active = selectedProject?.id === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(p)}
                      aria-current={active ? 'true' : undefined}
                      className={`w-full px-4 py-3.5 text-left transition-colors duration-200 cursor-pointer ${
                        active
                          ? 'border-l-2 border-forest bg-deep/60'
                          : 'border-l-2 border-transparent hover:bg-deep/40'
                      }`}
                    >
                      <span className="block truncate text-xs font-bold text-cream">{p.title}</span>
                      <span className="mt-0.5 block font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
                        {p.projectType}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lg:col-span-8">
            <MessageThread project={selectedProject} currentUserId={user?.id || ''} />
          </div>
        </div>
      )}
    </div>
  );
}
