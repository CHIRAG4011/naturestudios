'use client';

import React, { Suspense } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForms } from '@/components/auth/AuthForms';

function VerifyContent() {
  return <AuthForms initialView="verify" redirectOnSuccess />;
}

export default function VerifyPage() {
  return (
    <AuthShell eyebrow="Secure Access" accent="forest">
      <Suspense
        fallback={
          <p className="text-xs text-cream-muted text-center py-8 font-mono uppercase tracking-[0.2em]">
            Loading verification…
          </p>
        }
      >
        <VerifyContent />
      </Suspense>
    </AuthShell>
  );
}
