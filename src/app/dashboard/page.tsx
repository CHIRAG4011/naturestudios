'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Bell,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { formatTimeAgo } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */

function Counter({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 120 });
  const rounded = useTransform(spring, (v) => Math.round(v).toString());
  const [display, setDisplay] = React.useState('0');

  React.useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  React.useEffect(() => rounded.on('change', setDisplay), [rounded]);

  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Pipeline                                                            */
/* ------------------------------------------------------------------ */

const PIPELINE = [
  { key: 'RECEIVED', label: 'Received' },
  { key: 'REVIEWING', label: 'In Review' },
  { key: 'IN_DISCUSSION', label: 'In Discussion' },
  { key: 'IN_PRODUCTION', label: 'In Production' },
  { key: 'COMPLETED', label: 'Completed' },
];

/* ------------------------------------------------------------------ */

export default function DashboardOverviewPage() {
  const { user, unreadCount } = useAuth();
  const { projects, requests, loadingData, openNewProject } = useDashboard();

  const activeProjects = projects.filter((p) => p.status !== 'COMPLETED').length;
  const messageCount = projects.reduce((total, p) => total + (p.messages?.length ?? 0), 0);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: FolderKanban,
      accent: 'text-forest-light',
      href: '/dashboard/projects',
    },
    {
      label: 'Open Requests',
      value: requests.length,
      icon: FileText,
      accent: 'text-ember-light',
      href: '/dashboard/requests',
    },
    {
      label: 'Messages',
      value: messageCount,
      icon: MessageSquare,
      accent: 'text-cream-dim',
      href: '/dashboard/messages',
    },
    {
      label: 'Unread Alerts',
      value: unreadCount,
      icon: Bell,
      accent: unreadCount > 0 ? 'text-ember-bright' : 'text-cream-dim',
      href: '/dashboard/notifications',
    },
  ];

  const pipelineCounts = PIPELINE.map((stage) => ({
    ...stage,
    count: projects.filter((p) => p.status === stage.key).length,
  }));
  const pipelineTotal = projects.length || 1;

  const recentProjects = projects.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- */}
      {/* Greeting                                                    */}
      {/* ---------------------------------------------------------- */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-rim bg-gradient-to-br from-surface-card via-midnight to-surface-card p-6 shadow-card-lg sm:p-8"
      >
        <div className="hud-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="orb-forest pointer-events-none absolute -right-16 -top-24 h-64 w-64" aria-hidden="true" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <span className="section-label">Client Portal</span>
            <h1 className="text-display-sm font-black uppercase leading-[0.95] tracking-tight text-cream sm:text-display-md">
              Welcome back,
              <br />
              <span className="text-gradient-forest">{user?.name || 'Explorer'}</span>
            </h1>
            <p className="max-w-xl text-xs leading-relaxed text-cream-dim sm:text-sm">
              Track production milestones, review briefs, and talk to the studio team
              directly from one workspace.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {user?.emailVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest/10 px-2.5 py-1 font-mono text-label-sm uppercase tracking-[0.16em] text-forest-light">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Email Verified
                </span>
              )}
              {user?.providers?.includes('google') && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-steel/40 bg-steel/10 px-2.5 py-1 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-dim">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Google Connected
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={openNewProject}
            className="btn-primary shrink-0 self-start px-5 py-3 md:self-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Start a Project</span>
          </button>
        </div>
      </motion.section>

      {/* ---------------------------------------------------------- */}
      {/* Stats                                                       */}
      {/* ---------------------------------------------------------- */}
      <section aria-label="Workspace summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={stat.href}
                className="group flex h-full flex-col justify-between rounded-xl border border-rim bg-surface-card/60 p-4 transition-colors duration-200 hover:border-edge hover:bg-surface-card sm:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <span className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
                    {stat.label}
                  </span>
                  <Icon className={`h-4 w-4 shrink-0 ${stat.accent}`} aria-hidden="true" />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-stat font-black leading-none tracking-tight text-cream">
                    {loadingData ? '—' : <Counter value={stat.value} />}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-cream-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-light"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Pipeline                                                    */}
      {/* ---------------------------------------------------------- */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-rim bg-surface-card/60 p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="section-label">Pipeline</span>
            <h2 className="mt-1.5 text-base font-black uppercase tracking-tight text-cream">
              Where your work stands
            </h2>
          </div>
          <Link
            href="/dashboard/projects"
            className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted transition-colors duration-200 hover:text-forest-light"
          >
            View all projects
          </Link>
        </div>

        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {pipelineCounts.map((stage, i) => (
            <li key={stage.key} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-lg font-black leading-none text-cream">{stage.count}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-deep">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / pipelineTotal) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${
                    stage.key === 'COMPLETED'
                      ? 'bg-forest-bright'
                      : stage.key === 'IN_PRODUCTION'
                        ? 'bg-ember'
                        : 'bg-frame'
                  }`}
                />
              </div>
              <p className="font-mono text-label-sm uppercase tracking-[0.14em] text-cream-dim">
                {stage.label}
              </p>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* ---------------------------------------------------------- */}
      {/* Recent activity                                             */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-cream">
              Recent Projects
            </h2>
            <Link
              href="/dashboard/projects"
              className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted transition-colors duration-200 hover:text-forest-light"
            >
              All
            </Link>
          </div>

          {loadingData ? (
            <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-10">
              <Loader2 className="h-5 w-5 animate-spin text-forest-light" aria-hidden="true" />
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="space-y-3 rounded-xl border border-rim bg-surface-card/40 p-8 text-center">
              <FolderKanban className="mx-auto h-9 w-9 text-rim" aria-hidden="true" />
              <h3 className="text-sm font-bold text-cream">No projects yet</h3>
              <p className="mx-auto max-w-xs text-xs leading-relaxed text-cream-muted">
                Submit your first brief to start a collaboration with the studio.
              </p>
              <button type="button" onClick={openNewProject} className="btn-primary mt-1 px-4 py-2">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>New Brief</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpenChat={() => {}} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-cream">
              Recent Requests
            </h2>
            <Link
              href="/dashboard/requests"
              className="font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted transition-colors duration-200 hover:text-ember-light"
            >
              All
            </Link>
          </div>

          {loadingData ? (
            <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-10">
              <Loader2 className="h-5 w-5 animate-spin text-ember-light" aria-hidden="true" />
            </div>
          ) : requests.length === 0 ? (
            <div className="space-y-2 rounded-xl border border-rim bg-surface-card/40 p-8 text-center">
              <FileText className="mx-auto h-9 w-9 text-rim" aria-hidden="true" />
              <h3 className="text-sm font-bold text-cream">No inquiries logged</h3>
              <p className="mx-auto max-w-xs text-xs leading-relaxed text-cream-muted">
                Anything you send through the contact form shows up here with its review status.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-rim overflow-hidden rounded-xl border border-rim bg-surface-card/60">
              {requests.slice(0, 4).map((r) => (
                <li key={r.id} className="p-4">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-cream">{r.projectType}</span>
                    <span className="shrink-0 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-label-sm uppercase tracking-[0.16em] text-ember-light">
                      {r.status}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-cream-dim">{r.message}</p>
                  <p className="mt-1.5 font-mono text-label-sm uppercase tracking-[0.16em] text-cream-muted">
                    {formatTimeAgo(r.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
