'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { NewProjectModal } from '@/components/dashboard/NewProjectModal';
import { EditProfileModal } from '@/components/dashboard/EditProfileModal';

function DashboardModals() {
  const {
    isNewProjectOpen,
    closeNewProject,
    isEditProfileOpen,
    closeEditProfile,
    refresh,
  } = useDashboard();

  return (
    <>
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={closeNewProject}
        onProjectCreated={refresh}
      />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfile} />
    </>
  );
}

/**
 * The interactive half of the dashboard layout.
 *
 * This lives in a component rather than in `app/dashboard/layout.tsx` so that
 * the route's `layout.tsx` can stay a server component and export `metadata`
 * (a client component cannot). Behaviour is unchanged.
 */
export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Client-side guard. Real authorization is enforced server-side on every /api route.
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void text-cream">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-forest-light" aria-hidden="true" />
          <span className="font-mono text-label uppercase tracking-[0.24em] text-cream-muted">
            Opening Workspace
          </span>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
      <DashboardModals />
    </DashboardProvider>
  );
}
