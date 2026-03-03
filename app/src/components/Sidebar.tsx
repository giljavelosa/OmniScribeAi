'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBillingEntitlements } from '@/lib/billing/client';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { href: '/patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/visit/new', label: 'New Visit', icon: 'M12 4v16m8-8H4' },
  { href: '/frameworks', label: 'Frameworks', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/templates', label: 'Templates', icon: 'M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { href: '/account/billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

const adminNav = [
  { href: '/admin', label: 'Overview', icon: 'M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h7v7H3v-7zm11-3h7v10h-7V11z' },
  { href: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
  { href: '/admin/orgs', label: 'Organizations', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
];

function NavLinks({ isAdmin, pathname, onNavigate }: { isAdmin: boolean; pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#1e3a5f]/5 text-[#1e3a5f]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        );
      })}

      {isAdmin && (
        <>
          <div className="pt-4 pb-2"><div className="text-xs font-semibold text-gray-400 uppercase px-3">Admin</div></div>
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#1e3a5f]/5 text-[#1e3a5f]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'SUPER_ADMIN';
  const [mobileOpen, setMobileOpen] = useState(false);
  const { snapshot } = useBillingEntitlements();
  const monthlyNotesUsed = snapshot?.usage?.monthly_notes;
  const monthlyNotesLimit = snapshot?.quotas?.monthly_notes;

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Listen for toggle event from Header hamburger button
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    document.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  // Close on ESC
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMobile(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen, closeMobile]);

  // Close when route changes
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white fixed top-16 bottom-0 left-0 z-40">
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks isAdmin={isAdmin} pathname={pathname} />
        </nav>
        {snapshot && (
          <div className="px-3 pb-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Current Plan</div>
              <div className="text-sm font-semibold text-gray-900">{snapshot.planLabel}</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Notes: {typeof monthlyNotesUsed === 'number' ? monthlyNotesUsed : 0}
                {monthlyNotesLimit === null
                  ? " / Unlimited"
                  : typeof monthlyNotesLimit === 'number'
                    ? ` / ${monthlyNotesLimit}`
                    : " / --"}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30" onClick={closeMobile} aria-hidden="true" />
          {/* Drawer */}
          <aside className="fixed top-16 bottom-0 left-0 w-72 bg-white border-r border-gray-200 z-50 overflow-y-auto shadow-xl">
            <nav className="px-3 py-4 space-y-1">
              <NavLinks isAdmin={isAdmin} pathname={pathname} onNavigate={closeMobile} />
            </nav>
            {snapshot && (
              <div className="px-3 pb-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Current Plan</div>
                  <div className="text-sm font-semibold text-gray-900">{snapshot.planLabel}</div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
