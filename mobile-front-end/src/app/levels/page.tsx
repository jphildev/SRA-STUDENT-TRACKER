'use client';

import { SRA_LEVELS, COMPLETED_LEVELS, TOTAL_LEVELS } from '@/lib/levels';

export default function LevelsPage() {
  return (
    <div className="col gap-5">
      <div>
        <div className="page-title">My Journey</div>
        <div className="page-sub">You&rsquo;ve completed {COMPLETED_LEVELS} of {TOTAL_LEVELS} levels</div>
      </div>

      {/* Step progress */}
      <div className="card">
        <div style={{ display: 'flex', gap: 6 }}>
          {SRA_LEVELS.map((lv, i) => (
            <div
              key={lv.name}
              style={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                background: i < COMPLETED_LEVELS ? 'var(--dot-dark)' : 'var(--tile-strong)',
              }}
            />
          ))}
        </div>
        <div className="small muted" style={{ marginTop: 12 }}>You are here → Blue</div>
      </div>

      {/* Journey list */}
      <div className="col gap-3">
        {SRA_LEVELS.map((lv) => {
          const locked = lv.status === 'locked';
          const current = lv.status === 'current';
          return (
            <div
              key={lv.name}
              className="tile"
              style={{ background: current ? '#e3e3e6' : 'var(--tile)' }}
            >
              <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
                <span
                  className="dot dot--lg"
                  style={{ background: locked ? 'var(--dot-locked)' : lv.color }}
                />
                <div style={{ flex: 1 }}>
                  <div className="row-between">
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{lv.name}</div>
                    <div
                      className="small"
                      style={{ fontWeight: 600, color: locked ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}
                    >
                      {locked ? 'Locked' : `${lv.progress}%`}
                    </div>
                  </div>
                  <div className="small muted" style={{ marginTop: 2 }}>{lv.desc}</div>
                  {!locked && (
                    <div className="progress" style={{ marginTop: 12 }}>
                      <div className="progress__fill" style={{ width: `${lv.progress}%`, background: lv.color }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Colour palette table */}
      <section className="col gap-3">
        <div className="section-title">Colour Levels</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {SRA_LEVELS.map((lv, i) => (
            <div
              key={lv.name}
              className="row"
              style={{
                gap: 14,
                padding: '13px 16px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: lv.color,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{lv.name}</div>
                <div className="tiny muted">{lv.grade}</div>
              </div>
              <div className="tiny muted" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
                {lv.hex.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
