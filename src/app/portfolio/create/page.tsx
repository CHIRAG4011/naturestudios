'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioCreatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portfolio/edit');
  }, [router]);

  return null;
}
