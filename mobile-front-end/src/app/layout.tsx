import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'AdNU SRA SkillTrack',
  description: 'Reading Comprehension Monitoring System — mobile web app for Ateneo de Naga University students.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SRA SkillTrack',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // viewport-fit=cover lets the app extend under the notch / Dynamic Island
  // so we can pad with env(safe-area-inset-*) ourselves.
  viewportFit: 'cover',
  themeColor: '#ededef',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
