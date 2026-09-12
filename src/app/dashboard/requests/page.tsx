'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Loader2, ArrowUpRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { formatDate } from '@/lib/utils';

export default function DashboardRequestsPage() {
  const { requests, loadingData } = useDashboard();

  return (
    <div className="space-y-6">
      <header>
        <span className="section-label">Workspace</span>
        <h1 className="mt-1.5 text-display-sm font-black uppercase leading-none tracking-tight text-cream">
          Requests
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-dim">
          Inquiries you have submitted through the contact form, with their current review status.
        </p>
      </header>

      {loadingData ? (
        <div className="flex justify-center rounded-xl border border-rim bg-surface-card/40 p-16">
          <Loader2 className="h-6 w-6 animate-spin text-ember-light" aria-hidden="true" />
        </div>
      ) : requests.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-rim bg-surface-card/40 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-rim" aria-hidden="true" />
          <h2 className="text-sm font-bold text-cream">No inquiries logged yet</h2>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-cream-muted">
            Anything sent through the contact form appears here once the studio receives it.
          </p>
          <Link href="/contact" className="btn-secondary mt-1 inline-flex px-4 py-2">
            <span>Open Contact Form</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          {/* Table — medium screens and up */}
          <div className="hidden overflow-hidden rounded-xl border border-rim bg-surface-card/60 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-cream">
                <caption className="sr-only">Your submitted project inquiries</caption>
                <thead className="border-b border-rim bg-deep/70 font-mono text-label-sm uppercase tracking-[0.18em] text-cream-muted">
                  <tr>
                    <th scope="col" className="p-4">Discipline</th>
                    <th scope="col" className="p-4">Budget</th>
                    <th scope="col" className="p-4">Timeline</th>
                    <th scope="col" className="p-4">Status</th>
                    <th scope="col" className="p-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rim">
                  {requests.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                      className="transition-colors duration-150 hover:bg-deep/40"
                    >
                      <td className="p-4">
                        <span className="block font-bold text-cream">{r.projectType}</span>
                        <span className="mt-0.5 block max-w-sm truncate text-cream-muted">
                          {r.message}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-cream-dim">{r.budget || 'Flexible'}</td>
                      <td className="p-4 font-mono text-cream-dim">{r.timeline || 'Standard'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 font-mono text-label-sm uppercase tracking-[0.16em] text-ember-light">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-cream-muted">{formatDate(r.createdAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards — small screens */}
          <ul className="space-y-3 md:hidden">
            {requests.map((r) => (
              <li key={r.id} className="rounded-xl border border-rim bg-surface-card/60 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-cream">{r.projectType}</span>
                  <span className="shrink-0 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-label-sm uppercase tracking-[0.16em] text-ember-light">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-cream-dim">{r.message}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-rim pt-3 font-mono text-label-sm uppercase tracking-[0.14em] text-cream-muted">
                  <div>
                    <dt className="sr-only">Budget</dt>
                    <dd>{r.budget || 'Flexible'}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Timeline</dt>
                    <dd>{r.timeline || 'Standard'}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="sr-only">Submitted</dt>
                    <dd>{formatDate(r.createdAt)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
