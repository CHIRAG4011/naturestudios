'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt?: string;
  providers?: string[];
  /** True when the account has a password set (vs. OAuth-only). Never the hash itself. */
  hasPassword?: boolean;
  isAdmin?: boolean;
  roles?: string[];
  status?: string;
  suspendedReason?: string | null;
  suspendedAt?: string | null;
  isSuspended?: boolean;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  unreadCount: number;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  isSqueezeOpen: boolean;
  squeezeView: 'login' | 'register';
  openSqueeze: (view?: 'login' | 'register') => void;
  closeSqueeze: () => void;
  setSqueezeView: (view: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSqueezeOpen, setIsSqueezeOpen] = useState(false);
  const [squeezeView, setSqueezeView] = useState<'login' | 'register'>('register');
  const router = useRouter();

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setUnreadCount(data.unreadCount || 0);
          // Mark registered in localStorage so squeeze page is never shown
          if (typeof window !== 'undefined') {
            localStorage.setItem('ns_user_registered', 'true');
          }
          return data.user;
        }
      }
      setUser(null);
      return null;
    } catch (err) {
      console.error('Failed to fetch auth status:', err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const openSqueeze = (view: 'login' | 'register' = 'register') => {
    setSqueezeView(view);
    setIsSqueezeOpen(true);
  };

  const closeSqueeze = () => {
    setIsSqueezeOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadCount,
        refreshUser,
        logout,
        isSqueezeOpen,
        squeezeView,
        openSqueeze,
        closeSqueeze,
        setSqueezeView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
