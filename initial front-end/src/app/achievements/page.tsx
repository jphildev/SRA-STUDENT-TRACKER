'use client';

import { useEffect, useState } from 'react';
import type { AchievementData, ProgressStats } from '@/types';
import { formatDate, getGradeColor, getGradeLabel } from '@/lib/utils';

const ACHIEVEMENT_ICONS: Record<string, string> = {
  FIRST_STEPS: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  GETTING_STARTED: 'M12 20V10M18 20V4M6 20v-4',
  DEDICATED_READER: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  CENTURY_MARK: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z',
  SHARP_MIND: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  PERFECT_SCORE: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  ON_A_ROLL: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  LEVEL_UP: 'M12 19V5M5 12l7-7 7 7',
  DOUBLE_JUMP: 'M17 11l-5-5-5 5M17 18l-5-5-5 5',
  CONSISTENT: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
  GOAL_CRUSHER: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  RISING_AVERAGE: 'M23 6l-9.5 9.5-5-5L1 18',
  SPEED_DEMON: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

const LOCKED_ACHIEVEMENTS = [
  { type: 'FIRST_STEPS', title: 'First Steps', description: 'Complete your first Power Builder entry' },
  { type: 'GETTING_STARTED', title: 'Getting Started', description: 'Complete 5 Power Builder entries' },
  { type: 'DEDICATED_READER', title: 'Dedicated Reader', description: 'Complete 25 Power Builder entries' },
  { type: 'CENTURY_MARK', title: 'Century Mark', description: 'Complete 100 Power Builder entries' },
  { type: 'SHARP_MIND', title: 'Sharp Mind', description: 'Score 90%+ on a Power Builder' },
  { type: 'PERFECT_SCORE', title: 'Perfect Score', description: 'Achieve a perfect score' },
  { type: 'ON_A_ROLL', title: 'On a Roll', description: 'Score 80%+ on 5 consecutive Power Builders' },
  { type: 'LEVEL_UP', title: 'Level Up', description: 'Advance to a new SRA color level' },
  { type: 'DOUBLE_JUMP', title: 'Double Jump', description: 'Advance 2+ color levels within a week' },
  { type: 'CONSISTENT', title: 'Consistent Learner', description: 'Log progress for 7 consecutive days' },
  { type: 'GOAL_CRUSHER', title: 'Goal Crusher', description: 'Reach target level within timeframe' },
  { type: 'RISING_AVERAGE', title: 'Rising Average', description: 'Improve average score by 10%+ over 2 weeks' },
  { type: 'SPEED_DEMON', title: 'Speed Demon', description: 'Complete 5+ Power Builders in a single day' },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [achRes, progressRes] = await Promise.all([
          fetch('/api/achievements'),
          fetch('/api/progress'),
        ]);
        if (achRes.ok) setAchievements(await achRes.json());
        if (progressRes.ok) {
          const data = await progressRes.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const earnedTypes = new Set(achievements.map((a) => a.type));

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
        Loading achievements...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Performance & Achievements</h1>
        <p>Your earned achievements and performance analytics</p>
      </div>

      {/* Performance Summary */}
      {stats && stats.totalEntries > 0 && (
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-card__label">Total Entries</div>
            <div className="stat-card__value">{stats.totalEntries}</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Average Score</div>
            <div className="stat-card__value" style={{ color: getGradeColor(stats.averageScore) }}>
              {stats.averageScore}%
            </div>
            <div className="stat-card__sub">{getGradeLabel(stats.averageScore)}</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Achievements Earned</div>
            <div className="stat-card__value" style={{ color: 'var(--color-primary)' }}>
              {achievements.length}
            </div>
            <div className="stat-card__sub">of {LOCKED_ACHIEVEMENTS.length} total</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Completion</div>
            <div className="stat-card__value">
              {Math.round((achievements.length / LOCKED_ACHIEVEMENTS.length) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Earned Achievements */}
      {achievements.length > 0 && (
        <section className="section">
          <h3 className="section__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            Earned
          </h3>
          <div className="achievement-grid">
            {achievements.map((ach, i) => (
              <div key={ach.id} className="glass-card achievement-card animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="achievement-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ACHIEVEMENT_ICONS[ach.type] || 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z'} />
                  </svg>
                </div>
                <div className="achievement-card__content">
                  <div className="achievement-card__title">{ach.title}</div>
                  <div className="achievement-card__desc">{ach.description}</div>
                  <div className="achievement-card__date">Earned {formatDate(ach.earnedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Achievements (locked ones) */}
      <section className="section" style={{ marginTop: 'var(--space-8)' }}>
        <h3 className="section__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          All Achievements
        </h3>
        <div className="achievement-grid">
          {LOCKED_ACHIEVEMENTS.map((def, i) => {
            const earned = earnedTypes.has(def.type);
            return (
              <div
                key={def.type}
                className={`glass-card achievement-card ${earned ? '' : 'glass-card--subtle'}`}
                style={{ opacity: earned ? 1 : 0.5, animationDelay: `${i * 30}ms` }}
              >
                <div
                  className="achievement-card__icon"
                  style={{
                    background: earned ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    color: earned ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ACHIEVEMENT_ICONS[def.type] || 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z'} />
                  </svg>
                </div>
                <div className="achievement-card__content">
                  <div className="achievement-card__title">{def.title}</div>
                  <div className="achievement-card__desc">{def.description}</div>
                  {earned ? (
                    <span className="badge badge--success" style={{ marginTop: 'var(--space-1)' }}>Earned</span>
                  ) : (
                    <span className="badge badge--neutral" style={{ marginTop: 'var(--space-1)' }}>Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
