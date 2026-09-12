'use client';

import React from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForms } from '@/components/auth/AuthForms';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Welcome Back"
      subtitle="Log in to access your projects, messages, and studio updates."
      accent="ember"
    >
      <AuthForms initialView="login" redirectOnSuccess />
    </AuthShell>
  );
}
