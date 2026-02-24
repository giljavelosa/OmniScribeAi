'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { sweepExpiredPhiItems } from '@/lib/phi-storage';
import SessionTimeout from './SessionTimeout';
import ExtendedSessionDisclaimer from './ExtendedSessionDisclaimer';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Sweep expired PHI on app startup (catches stale data from previous sessions)
  useEffect(() => {
    sweepExpiredPhiItems();
  }, []);

  return (
    <SessionProvider>
      {children}
      <SessionTimeout />
      <ExtendedSessionDisclaimer />
    </SessionProvider>
  );
}
