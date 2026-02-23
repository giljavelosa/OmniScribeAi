'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { clearAllPhiItems, sweepExpiredPhiItems } from '@/lib/phi-storage';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLanding = pathname === '/';

  if (isLanding) return null;

  // Sweep stale PHI from localStorage on every page load
  sweepExpiredPhiItems();

  const userName = session?.user?.name || 'Clinician';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-[#1e3a5f]">OmniScribe</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/visit/new"
          className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          New Visit
        </Link>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{userName}</div>
            <div className="text-xs text-gray-500">{session?.user?.email || ''}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-sm font-medium">
            {userInitials}
          </div>
          <button
            onClick={() => { clearAllPhiItems(); signOut({ callbackUrl: '/login' }); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Sign out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
