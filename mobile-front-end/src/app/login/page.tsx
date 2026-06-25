'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthBackground from '@/components/AuthBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    // Front-end only for now — a back-end can be wired in here later.
    router.push('/');
  };

  return (
    // Full-bleed wrapper: cancels the content padding so the animated
    // background reaches every edge of the screen, then re-adds it inside.
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        margin: '-4px -20px -28px',
        padding: '4px 20px 28px',
        minHeight: 'calc(100% + 32px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <AuthBackground />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          className="card"
          style={{
            padding: '34px 26px',
            background: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div className="avatar" style={{ width: 72, height: 72, margin: '0 auto 18px' }} aria-hidden />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em' }}>AdNU SRA SkillTrack</div>
            <div className="muted small" style={{ marginTop: 6 }}>Reading Comprehension Monitoring System</div>
          </div>

          {error && <div className="alert alert--error" style={{ marginTop: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} className="col gap-5" style={{ marginTop: 24 }}>
            <div className="field">
              <label htmlFor="email" className="field-label">AdNU Gbox Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="name@gbox.adnu.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 4 }}>
              Sign In
            </button>
          </form>

          <div className="muted small" style={{ textAlign: 'center', marginTop: 18 }}>
            Use your official AdNU Gbox account to continue
          </div>
        </div>
      </div>
    </div>
  );
}
