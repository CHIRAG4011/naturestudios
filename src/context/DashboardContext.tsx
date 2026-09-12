'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { ProjectData } from '@/components/dashboard/ProjectCard';
import { useAuth } from '@/context/AuthContext';

export interface ProjectRequestData {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface DashboardContextValue {
  projects: ProjectData[];
  requests: ProjectRequestData[];
  loadingData: boolean;
  selectedProject: ProjectData | null;
  setSelectedProject: (p: ProjectData | null) => void;
  refresh: () => Promise<void>;
  openNewProject: () => void;
  openEditProfile: () => void;
  isNewProjectOpen: boolean;
  isEditProfileOpen: boolean;
  closeNewProject: () => void;
  closeEditProfile: () => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [requests, setRequests] = useState<ProjectRequestData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pRes, rRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/project-requests'),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        const list: ProjectData[] = pData.projects || [];
        setProjects(list);
        // Keep the selection valid across refreshes; default to the first project.
        setSelectedProject((prev) => {
          if (!prev) return list[0] ?? null;
          return list.find((p) => p.id === prev.id) ?? list[0] ?? null;
        });
      }

      if (rRes.ok) {
        const rData = await rRes.json();
        setRequests(rData.requests || []);
      }
    } catch {
      // Non-fatal — each surface renders its own empty state
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      projects,
      requests,
      loadingData,
      selectedProject,
      setSelectedProject,
      refresh,
      openNewProject: () => setIsNewProjectOpen(true),
      openEditProfile: () => setIsEditProfileOpen(true),
      isNewProjectOpen,
      isEditProfileOpen,
      closeNewProject: () => setIsNewProjectOpen(false),
      closeEditProfile: () => setIsEditProfileOpen(false),
    }),
    [projects, requests, loadingData, selectedProject, refresh, isNewProjectOpen, isEditProfileOpen]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
}
