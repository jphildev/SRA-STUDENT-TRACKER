'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { formatDate } from '@/lib/utils';

interface ProfileData {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  profile: {
    fullName: string;
    yearLevel: string;
    course: string;
  } | null;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    yearLevel: '',
    course: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/account');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm({
            fullName: data.profile?.fullName || '',
            username: data.username || '',
            yearLevel: data.profile?.yearLevel || '',
            course: data.profile?.course || '',
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChangingPassword(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Password changed successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
        Loading account...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Account</h1>
        <p>Manage your profile and settings</p>
      </div>

      {message.text && (
        <div className={`alert alert--${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 'var(--space-6)', maxWidth: 600 }}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="glass-card" style={{ maxWidth: 600, marginBottom: 'var(--space-6)' }}>
        {editing ? (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label htmlFor="acc-name" className="input-label">Full Name</label>
                <input
                  id="acc-name"
                  type="text"
                  className="input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="acc-username" className="input-label">Username</label>
                <input
                  id="acc-username"
                  type="text"
                  className="input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  pattern="[a-zA-Z0-9_]+"
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="acc-year" className="input-label">Year Level</label>
                  <select
                    id="acc-year"
                    className="input select"
                    value={form.yearLevel}
                    onChange={(e) => setForm({ ...form, yearLevel: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="acc-course" className="input-label">Course</label>
                  <input
                    id="acc-course"
                    type="text"
                    className="input"
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xl)', fontWeight: 700,
              }}>
                {(profile?.profile?.fullName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>{profile?.profile?.fullName}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>@{profile?.username}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {[
                { label: 'Email', value: profile?.email },
                { label: 'Year Level', value: profile?.profile?.yearLevel },
                { label: 'Course', value: profile?.profile?.course },
                { label: 'Member Since', value: profile?.createdAt ? formatDate(profile.createdAt) : 'N/A' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button className="btn btn--primary" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn btn--secondary" onClick={() => setChangingPassword(!changingPassword)}>
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      {changingPassword && (
        <div className="glass-card" style={{ maxWidth: 600, marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label htmlFor="cur-pass" className="input-label">Current Password</label>
                <input
                  id="cur-pass"
                  type="password"
                  className="input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="new-pass" className="input-label">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    className="input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="confirm-pass" className="input-label">Confirm Password</label>
                  <input
                    id="confirm-pass"
                    type="password"
                    className="input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
              <button type="button" className="btn btn--secondary" onClick={() => setChangingPassword(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Sign Out */}
      <div className="glass-card glass-card--subtle" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Sign Out</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>End your current session</div>
          </div>
          <button className="btn btn--danger" onClick={() => signOut({ callbackUrl: '/login' })}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
