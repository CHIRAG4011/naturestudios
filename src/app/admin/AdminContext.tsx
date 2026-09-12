'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminContextType {
  user: AdminUser | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  environment: string;
  loading: boolean;
  unauthorized: boolean;
  unauthorizedMessage: string;
  hasPermission: (key: string) => boolean;
  refreshAdmin: () => Promise<void>;
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  systemHealth: {
    mongo: { status: string; latencyMs?: number };
    api: { status: string };
    resend: { status: string };
    googleOAuth: { status: string };
  };
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [environment, setEnvironment] = useState('PRODUCTION');
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState('');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    mongo: { status: 'OPERATIONAL', latencyMs: 12 },
    api: { status: 'OPERATIONAL' },
    resend: { status: 'OPERATIONAL' },
    googleOAuth: { status: 'OPERATIONAL' },
  });

  const fetchAdminAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/auth/me', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.status === 401) {
        // Not logged in -> redirect to login
        router.push(`/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
        return;
      }

      if (res.status === 403) {
        const data = await res.json();
        setUnauthorized(true);
        setUnauthorizedMessage(data.message || 'ADMIN ACCESS REQUIRED — Your account lacks staff authorization.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to verify administrative clearance');
      }

      const data = await res.json();
      setUser(data.user);
      setRoles(data.roles || []);
      const rawPerms = data.permissions;
      let permsList: string[] = [];
      if (Array.isArray(rawPerms)) {
        permsList = rawPerms;
      } else if (typeof rawPerms === 'object' && rawPerms !== null) {
        permsList = Object.entries(rawPerms)
          .filter(([_, allowed]) => Boolean(allowed))
          .map(([k]) => k);
      }
      setPermissions(permsList);
      setIsSuperAdmin(Boolean(data.isSuperAdmin));
      setEnvironment(data.environment || 'PRODUCTION');
      setUnauthorized(false);
    } catch (err: any) {
      setUnauthorized(true);
      setUnauthorizedMessage(err.message || 'Network or server error validating administrative credentials');
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    fetchAdminAuth();
  }, [fetchAdminAuth]);

  // Global shortcut for Command Palette Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasPermission = useCallback(
    (key: string): boolean => {
      if (isSuperAdmin) return true;
      if (!permissions) return false;
      if (Array.isArray(permissions)) {
        return permissions.includes(key) || permissions.includes('*');
      }
      if (typeof permissions === 'object') {
        return Boolean((permissions as Record<string, boolean>)[key]);
      }
      return false;
    },
    [isSuperAdmin, permissions]
  );

  return (
    <AdminContext.Provider
      value={{
        user,
        roles,
        permissions,
        isSuperAdmin,
        environment,
        loading,
        unauthorized,
        unauthorizedMessage,
        hasPermission,
        refreshAdmin: fetchAdminAuth,
        showCommandPalette,
        setShowCommandPalette,
        systemHealth,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
