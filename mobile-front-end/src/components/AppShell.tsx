'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './AppShell.module.css';

const TITLES: Record<string, string> = {
  '/': 'Home',
  '/levels': 'Levels',
  '/log': 'Log',
  '/awards': 'Awards',
  '/guide': 'Guide',
  '/login': 'Sign In',
};

const tabs = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: '/levels',
    label: 'Levels',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="13" width="5" height="8" rx="1.2" />
        <rect x="9.5" y="8" width="5" height="13" rx="1.2" />
        <rect x="16" y="3" width="5" height="18" rx="1.2" />
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Log',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    href: '/awards',
    label: 'Awards',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
      </svg>
    ),
  },
  {
    href: '/guide',
    label: 'Guide',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h7v16H6a2 2 0 0 1-2-2z" />
        <path d="M20 4h-7v16h5a2 2 0 0 0 2-2z" />
      </svg>
    ),
  },
];

function StatusBar() {
  return (
    <div className={styles.statusbar}>
      <span className={styles.clock}>9:41</span>

      {/* Dynamic Island / front-camera cutout — the header is padded with
          safe-area insets so real content never sits under it. */}
      <span className={styles.island} aria-hidden />

      <span className={styles.statusIcons} aria-hidden>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.2c2.6 0 5 1 6.8 2.7l1.2-1.3A11 11 0 0 0 8 .3 11 11 0 0 0 0 3.6l1.2 1.3A9.4 9.4 0 0 1 8 2.2Z" />
          <path d="M8 5.6c1.6 0 3.1.6 4.2 1.7l1.2-1.3A7.6 7.6 0 0 0 8 3.7a7.6 7.6 0 0 0-5.4 2.3l1.2 1.3A6 6 0 0 1 8 5.6Z" />
          <path d="M8 9c.8 0 1.5.3 2 .9L8 12l-2-2.1c.5-.6 1.2-.9 2-.9Z" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? 'SRA SkillTrack';
  const isAuth = pathname === '/login';

  return (
    <div className={styles.frame}>
      <div className={styles.phone}>
        <header className={styles.chrome}>
          <StatusBar />
          <div className={styles.titlebar}>{title}</div>
        </header>

        <main className={styles.content}>{children}</main>

        {!isAuth && (
          <nav className={styles.tabbar} aria-label="Primary">
            {tabs.map((tab) => {
              const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
