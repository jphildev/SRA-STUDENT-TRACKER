'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { GradingRubricData } from '@/types';

// Fallback grading data for when database isn't connected
const FALLBACK_RUBRIC: GradingRubricData[] = [
  { id: '1', levelName: 'Outstanding', minScore: 90, maxScore: 100, description: 'Mastery demonstrated across all comprehension areas', interpretation: 'Student is ready to advance to the next SRA color level. Comprehension, vocabulary, and critical thinking skills are exceptional.', order: 1 },
  { id: '2', levelName: 'Very Good', minScore: 80, maxScore: 89, description: 'Strong comprehension with minor areas for improvement', interpretation: 'Student shows strong reading skills and is approaching mastery. A few more practice sessions at this level will solidify understanding.', order: 2 },
  { id: '3', levelName: 'Good', minScore: 70, maxScore: 79, description: 'Solid understanding with some gaps in comprehension', interpretation: 'Student demonstrates adequate comprehension. Continue practicing at the current level to strengthen weak areas before advancing.', order: 3 },
  { id: '4', levelName: 'Satisfactory', minScore: 60, maxScore: 69, description: 'Adequate performance with notable areas needing practice', interpretation: 'Student meets minimum expectations but needs focused practice. Consider reviewing difficult passages and vocabulary at this level.', order: 4 },
  { id: '5', levelName: 'Needs Improvement', minScore: 0, maxScore: 59, description: 'Significant gaps in reading comprehension', interpretation: 'Student should revisit materials at the current or previous level. Focus on building foundational vocabulary and reading strategies.', order: 5 },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [rubric, setRubric] = useState<GradingRubricData[]>(FALLBACK_RUBRIC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const rubricRes = await fetch('/api/grading');
        if (rubricRes.ok) {
          const data = await rubricRes.json();
          if (data.length > 0) setRubric(data);
        }
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const gradeColors = ['var(--color-success)', 'var(--color-info)', 'var(--color-primary)', 'var(--color-warning)', 'var(--color-danger)'];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="page-header" style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', letterSpacing: '-0.03em' }}>
          Welcome{session?.user?.username ? `, ${session.user.username}` : ' to SRA SkillTrack'}
        </h1>
        <p style={{ maxWidth: 600, marginTop: 'var(--space-2)' }}>
          Track your SRA reading progress, understand your performance, and work toward your comprehension goals.
        </p>
      </div>

      {/* Quick Stats (Demo Data) */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="glass-card stat-card animate-slide-up">
          <div className="stat-card__label">Power Builders</div>
          <div className="stat-card__value">0</div>
          <div className="stat-card__sub">completed total</div>
        </div>
        <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="stat-card__label">Average Score</div>
          <div className="stat-card__value" style={{ color: 'var(--color-text-tertiary)' }}>--</div>
          <div className="stat-card__sub">add entries to see</div>
        </div>
        <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="stat-card__label">Achievements</div>
          <div className="stat-card__value" style={{ color: 'var(--color-primary)' }}>0</div>
          <div className="stat-card__sub">of 13 total</div>
        </div>
        <div className="glass-card stat-card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="stat-card__label">Current Level</div>
          <div className="stat-card__value" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)' }}>
            Not set
          </div>
          <div className="stat-card__sub">SRA color level</div>
        </div>
      </div>

      {/* Grading System Overview */}
      <section className="section">
        <h2 className="section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          SRA Grading System
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 640 }}>
          Your Power Builder scores are evaluated against the following grading rubric. Aim for &ldquo;Outstanding&rdquo; (90%+) to advance to the next color level.
        </p>

        <div className="grading-grid">
          {rubric.map((level, i) => (
            <div key={level.id} className="glass-card grading-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="grading-card__range" style={{ color: gradeColors[i] || 'var(--color-text)' }}>
                {level.minScore}&ndash;{level.maxScore}%
              </div>
              <div className="grading-card__label">{level.levelName}</div>
              <div className="grading-card__desc">{level.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Score Interpretation */}
      <section className="section" style={{ marginTop: 'var(--space-10)' }}>
        <h2 className="section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Score Interpretation
        </h2>
        <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
          {rubric.map((level, i) => (
            <div key={level.id} className="glass-card glass-card--subtle" style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: gradeColors[i] || 'var(--color-primary)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <span style={{ color: gradeColors[i] || 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  {level.minScore}%
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{level.levelName}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {level.interpretation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading Comprehension Levels */}
      <section className="section" style={{ marginTop: 'var(--space-10)' }}>
        <h2 className="section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Understanding SRA Color Levels
        </h2>
        <div className="glass-card" style={{ maxWidth: 720 }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            The SRA Reading Laboratory organizes reading materials by color-coded difficulty levels. Each color corresponds to a grade level and Lexile reading measure. As you improve, you progress through colors from Rose (beginner) through Purple (advanced).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-2)' }}>
            {[
              { label: 'Series 1a-1c', desc: 'Grades 1-3', colors: ['#FF007F', '#FF0000', '#FF8C00', '#FFD700'] },
              { label: 'Series 2a-2b', desc: 'Grades 4-8', colors: ['#800080', '#8A2BE2', '#DB7093', '#DC143C'] },
              { label: 'Series 3a-3b', desc: 'Grades 9-12', colors: ['#C4A882', '#7CFC00', '#006400', '#4B0082'] },
            ].map((series) => (
              <div key={series.label} style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{series.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{series.desc}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {series.colors.map((c) => (
                    <span key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid var(--color-border)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Expectations */}
      <section className="section" style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-16)' }}>
        <h2 className="section__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          Progress Expectations
        </h2>
        <div className="glass-card" style={{ maxWidth: 720 }}>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {[
              { title: 'Daily Practice', desc: 'Complete at least 1-2 Power Builders per day to maintain steady progress.' },
              { title: 'Score Target', desc: 'Aim for 80% or higher consistently before moving to the next level.' },
              { title: 'Level Advancement', desc: 'Score 90%+ on 3 consecutive Power Builders to demonstrate mastery and advance.' },
              { title: 'Weekly Goal', desc: 'Complete 5-10 Power Builders per week with increasing accuracy over time.' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{item.title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
