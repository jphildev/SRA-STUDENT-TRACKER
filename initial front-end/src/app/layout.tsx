import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import AuthLayout from './auth-layout';

export const metadata: Metadata = {
  title: 'AdNU SRA SkillTrack',
  description: 'Reading Comprehension Monitoring and Performance Grading System for Ateneo de Naga University students.',
  keywords: ['SRA', 'reading comprehension', 'AdNU', 'SkillTrack', 'Power Builders'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('sra-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <AuthLayout>{children}</AuthLayout>
        </Providers>
      </body>
    </html>
  );
}
