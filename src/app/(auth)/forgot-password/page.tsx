'use client';

import React from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForms } from '@/components/auth/AuthForms';

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Account Recovery" accent="ember">
      <AuthForms initialView="forgot" redirectOnSuccess={false} />
    </AuthShell>
  );
}
