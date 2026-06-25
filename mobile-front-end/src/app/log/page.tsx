'use client';

import { useState } from 'react';

const week = [
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
];

const recent = [
  { booklet: 'Blue 18', meta: '8/10 · 9 min',  score: '80%' },
  { booklet: 'Blue 17', meta: '8/10 · 11 min', score: '80%' },
];

export default function LogPage() {
  const [booklet, setBooklet] = useState('');
  const [correct, setCorrect] = useState(8);
  const [time, setTime] = useState('');
  const [reflection, setReflection] = useState('');

  const percent = Math.round((correct / 10) * 100);

  return (
    <div className="col gap-5">
      <div>
        <div className="page-title">Progress Log</div>
        <div className="page-sub">Track every reading session you complete</div>
      </div>

      {/* This week */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 14 }}>This Week</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {week.map((d, i) => (
            <div key={i} className="col gap-2" style={{ alignItems: 'center' }}>
              <span
                style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: d.done ? 'var(--primary)' : 'var(--tile-strong)',
                }}
              />
              <span className="small muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log a session */}
      <div className="card col gap-5">
        <div style={{ fontWeight: 700, fontSize: 17 }}>Log a Session</div>

        <div className="field">
          <label className="field-label">Booklet</label>
          <input className="input" placeholder="e.g. Blue 19" value={booklet} onChange={(e) => setBooklet(e.target.value)} />
        </div>

        <div className="field">
          <div className="row-between">
            <label className="field-label">Correct Answers</label>
            <span className="small" style={{ fontWeight: 600 }}>{correct}/10 · {percent}%</span>
          </div>
          <input
            type="range" min={0} max={10} value={correct}
            onChange={(e) => setCorrect(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0f0f10' }}
          />
          <div className="row-between small muted"><span>0</span><span>10</span></div>
        </div>

        <div className="field">
          <label className="field-label">Reading Time (min)</label>
          <input className="input" placeholder="e.g. 10" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <div className="field">
          <label className="field-label">Reflection</label>
          <textarea
            className="textarea"
            placeholder="How did it go? What was tricky?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>

        <button className="btn btn--primary btn--block">Save Session</button>
      </div>

      {/* Recent */}
      <section className="col gap-3">
        <div className="section-title">Recent Sessions</div>
        <div className="col gap-3">
          {recent.map((s) => (
            <div key={s.booklet} className="tile row-between">
              <div>
                <div style={{ fontWeight: 700 }}>{s.booklet}</div>
                <div className="small muted">{s.meta}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{s.score}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
