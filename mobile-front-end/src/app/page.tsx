'use client';

import Link from 'next/link';

const weekly = [
  { label: 'Accuracy', value: '87%' },
  { label: 'Answers',  value: '82%' },
  { label: 'Speed',    value: '74%' },
];

const recent = [
  { booklet: 'Blue 18', when: 'Yesterday',  score: '88%' },
  { booklet: 'Blue 17', when: '2 days ago', score: '85%' },
];

export default function HomePage() {
  return (
    <div className="col gap-5">
      {/* Greeting */}
      <div className="row-between">
        <div>
          <div className="muted small">Good afternoon</div>
          <div className="page-title" style={{ marginTop: 2 }}>Maria Santos</div>
        </div>
        <span className="avatar" aria-hidden />
      </div>

      {/* Current level */}
      <div className="card" style={{ background: 'var(--accent-blue)' }}>
        <div className="row-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="small muted">Current Level</div>
            <div className="row gap-3" style={{ marginTop: 8 }}>
              <span className="dot dot--lg" />
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>Blue</div>
                <div className="muted small" style={{ marginTop: 4 }}>Level 6 of 10</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="small muted">Overall Score</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>83</div>
            <div className="muted small">Satisfactory</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="progress progress--thick"><div className="progress__fill" style={{ width: '40%' }} /></div>
          <div className="row-between small muted" style={{ marginTop: 8 }}>
            <span>4 of 10 booklets done</span>
            <span>40%</span>
          </div>
        </div>
      </div>

      {/* Streak + badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="tile" style={{ background: 'var(--accent-peach)' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>12 day streak</div>
          <div className="small muted" style={{ marginTop: 2 }}>Keep it up</div>
        </div>
        <div className="tile" style={{ background: 'var(--accent-green)' }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>6 badges earned</div>
          <div className="small muted" style={{ marginTop: 2 }}>6 to unlock</div>
        </div>
      </div>

      {/* This Week */}
      <section className="col gap-3">
        <div className="section-title">This Week</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {weekly.map((w) => (
            <div key={w.label} className="tile" style={{ padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{w.value}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Motivation */}
      <div className="tile">
        <div style={{ fontWeight: 600 }}>&ldquo;Every page you read is a step forward.&rdquo;</div>
        <div className="small muted" style={{ marginTop: 4 }}>Daily motivation</div>
      </div>

      {/* Recent Sessions */}
      <section className="col gap-3">
        <div className="row-between">
          <div className="section-title">Recent Sessions</div>
          <Link href="/log" className="section-link">See all</Link>
        </div>
        <div className="col gap-3">
          {recent.map((s) => (
            <div key={s.booklet} className="tile row-between">
              <div className="row gap-3">
                <span className="avatar" aria-hidden />
                <div>
                  <div style={{ fontWeight: 700 }}>{s.booklet}</div>
                  <div className="small muted">{s.when}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>{s.score}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
