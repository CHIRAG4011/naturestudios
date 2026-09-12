'use client';

import React from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForms } from '@/components/auth/AuthForms';

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join NatureStudios"
      title="Create Account"
      subtitle="Access your creative workspace and project pipeline."
      accent="forest"
    >
      <AuthForms initialView="register" redirectOnSuccess />
    </AuthShell>
  );
}
