'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    yearLevel: '',
    course: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          username: form.username.trim().toLowerCase(),
          email: form.email.trim().toLowerCase(),
          yearLevel: form.yearLevel,
          course: form.course.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card glass-card--elevated auth-card animate-scale-in" style={{ maxWidth: 480 }}>
        <div className="auth-card__logo">
          <h1>Create Account</h1>
          <p>Join SRA SkillTrack</p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: 'var(--space-4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="fullName" className="input-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="input"
              placeholder="Juan Dela Cruz"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="juandc"
                value={form.username}
                onChange={(e) => updateField('username', e.target.value)}
                required
                pattern="[a-zA-Z0-9_]+"
                title="Letters, numbers, and underscores only"
              />
            </div>

            <div className="input-group">
              <label htmlFor="yearLevel" className="input-label">Year Level</label>
              <select
                id="yearLevel"
                className="input select"
                value={form.yearLevel}
                onChange={(e) => updateField('yearLevel', e.target.value)}
                required
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="course" className="input-label">Course / Program</label>
            <input
              id="course"
              type="text"
              className="input"
              placeholder="e.g. BS Computer Science"
              value={form.course}
              onChange={(e) => updateField('course', e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
