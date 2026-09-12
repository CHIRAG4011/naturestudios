'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, MessageSquare, Layers } from 'lucide-react';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  projectType: string;
  budget: string;
  timeline: string;
  status: 'RECEIVED' | 'REVIEWING' | 'IN_DISCUSSION' | 'IN_PRODUCTION' | 'COMPLETED' | string;
  createdAt: string;
  updatedAt: string;
  messages?: unknown[];
}

interface ProjectCardProps {
  project: ProjectData;
  onOpenChat: (project: ProjectData) => void;
  isSelected?: boolean;
}

/** Pipeline stages — status is communicated by label + dot + progress, never colour alone. */
const STATUS_MAP: Record<string, { label: string; chip: string; dot: string; progress: number }> = {
  RECEIVED:       { label: 'Received',      chip: 'status-received',   dot: 'bg-blue-300',            progress: 15  },
  REVIEWING:      { label: 'In Review',     chip: 'status-reviewing',  dot: 'bg-amber-300',           progress: 35  },
  IN_DISCUSSION:  { label: 'In Discussion', chip: 'status-discussion', dot: 'bg-forest-bright',       progress: 55  },
  IN_PRODUCTION:  { label: 'In Production', chip: 'status-production', dot: 'bg-ember-bright animate-pulse', progress: 80 },
  COMPLETED:      { label: 'Completed',     chip: 'status-completed',  dot: 'bg-forest-bright',       progress: 100 },
};

export function ProjectCard({ project, onOpenChat, isSelected }: ProjectCardProps) {
  const status =
    STATUS_MAP[project.status] ?? {
      label: project.status,
      chip: 'status-received',
      dot: 'bg-cream-muted',
      progress: 25,
    };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-xl border p-5 sm:p-6 transition-colors duration-200 ${
        isSelected
          ? 'border-forest/60 bg-surface-card shadow-glow-forest'
          : 'border-rim bg-surface-card/60 hover:border-edge hover:bg-surface-card'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-label-sm font-mono tracking-[0.2em] uppercase text-cream-muted flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-ember-light" aria-hidden="true" />
          {project.projectType}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-mono uppercase tracking-[0.18em] ${status.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <h3 className="text-base font-bold text-cream tracking-tight mb-2">{project.title}</h3>

      <p className="text-xs text-cream-dim leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Pipeline progress */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-label-sm font-mono uppercase tracking-[0.2em] text-cream-muted">
          <span>Pipeline Stage</span>
          <span>{status.progress}%</span>
        </div>
        <div
          className="h-1.5 w-full bg-deep rounded-full overflow-hidden border border-rim"
          role="progressbar"
          aria-valuenow={status.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Project progress: ${status.label}`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${status.progress}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-forest via-forest-light to-ember"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-cream-dim border-t border-rim pt-3 mb-4">
        <div className="flex items-center gap-1.5 min-w-0">
          <DollarSign className="h-3.5 w-3.5 text-forest-light shrink-0" aria-hidden="true" />
          <span className="truncate">{project.budget}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="h-3.5 w-3.5 text-ember-light shrink-0" aria-hidden="true" />
          <span className="truncate">{project.timeline}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenChat(project)}
        className="w-full rounded-lg border border-rim bg-deep hover:bg-surface-hover hover:border-edge py-2 px-3 text-label font-mono uppercase tracking-[0.2em] text-cream hover:text-forest-light transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        <MessageSquare className="h-3.5 w-3.5 text-forest-light" aria-hidden="true" />
        <span>Studio Channel</span>
      </button>
    </motion.div>
  );
}
