'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { MessageThread } from '@/components/dashboard/MessageThread';

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'RECEIVED', label: 'Received' },
  { key: 'REVIEWING', label: 'In Review' },
  { key: 'IN_DISCUSSION', label: 'In Discussion' },
  { key: 'IN_PRODUCTION', label: 'In Production' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function DashboardProjectsPage() {
  const { user } = useAuth();
  const { projects, loadingData, selectedProject, setSelectedProject, openNewProject } =
    useDashboard();
  const [filter, setFilter] = useState('ALL');

  const visible = filter === 'ALL' ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-label">Workspace</span>
          <h1 className="mt-1.5 text-display-sm font-black uppercase leading-none tracking-tight text-cream">
            Projects
          </h1>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-dim">
            Every brief you have registered with the studio, and its position in the pipeline.
          </p>
        </div>

        <button type="button" onClick={openNewProject} className="btn-primary px-4 py-2.5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New Brief</span>
        </button>
      </header>

      {/* Filters */}
      <div
        role="group"
        aria-label="Filter projects by status"
        className="flex flex-wrap gap-1.5 border-b border-rim pb-4"
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count =
            f.key === 'ALL'
              ? projects.length
              : projects.filter((p) => p.status === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`relative rounded-lg px-3 py-1.5 font-mono text-label-sm uppercase tracking-[0.16em] transition-colors duration-200 cursor-pointer ${
                active
                  ? 'text-midnight'
                  : 'text-cream-muted hover:bg-surface-card/60 hover:text-cream'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-forest"
                  transition={{ type: 'spring', damping: 30, stiffness: 380 }}
                />
              )}
              <span className="relative">
                {f.label} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {loadingData ? (
        <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-16">
          <Loader2 className="h-6 w-6 animate-spin text-forest-light" aria-hidden="true" />
        </div>
      ) : projects.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-rim bg-surface-card/40 p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-rim" aria-hidden="true" />
          <h2 className="text-sm font-bold text-cream">No projects yet</h2>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-cream-muted">
            Submit your first creative brief to start a collaboration with NatureStudios.
          </p>
          <button type="button" onClick={openNewProject} className="btn-primary mt-1 px-4 py-2">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Submit a Brief</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            {visible.length === 0 ? (
              <p className="rounded-xl border border-rim bg-surface-card/40 p-10 text-center text-xs text-cream-muted">
                No projects at this stage.
              </p>
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectCard
                      project={p}
                      isSelected={selectedProject?.id === p.id}
                      onOpenChat={setSelectedProject}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="lg:sticky lg:top-20 lg:col-span-5">
            <MessageThread project={selectedProject} currentUserId={user?.id || ''} />
          </div>
        </div>
      )}
    </div>
  );
}
