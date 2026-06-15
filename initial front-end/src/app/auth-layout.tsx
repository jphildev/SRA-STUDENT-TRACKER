'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/nav/Navbar';
import AccountButton from '@/components/account/AccountButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

const publicPaths = ['/login', '/register'];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();
  const isPublicPage = publicPaths.includes(pathname);

  // On auth pages, render without nav chrome
  if (isPublicPage) {
    return (
      <>
        {children}
        <ThemeToggle />
      </>
    );
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--text-sm)',
      }}>
        Loading...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className="app-layout">
      <Navbar />
      {status === 'authenticated' && <AccountButton />}
      {status === 'unauthenticated' && (
        <div style={{
          position: 'fixed', top: 'var(--space-4)', right: 'var(--space-6)',
          zIndex: 100, display: 'flex', gap: 'var(--space-2)',
        }}>
          <a href="/login" className="btn btn--secondary btn--sm">Sign In</a>
          <a href="/register" className="btn btn--primary btn--sm">Register</a>
        </div>
      )}
      <main className="main-content">
        {children}
      </main>
      <ThemeToggle />
    </div>
  );
}
