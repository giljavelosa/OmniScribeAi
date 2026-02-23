'use client';

import { SessionProvider } from 'next-auth/react';
import SessionTimeout from './SessionTimeout';
import ExtendedSessionDisclaimer from './ExtendedSessionDisclaimer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <SessionTimeout />
      <ExtendedSessionDisclaimer />
    </SessionProvider>
  );
}
