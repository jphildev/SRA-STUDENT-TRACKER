'use client';

const steps = [
  { n: '01', title: 'Pick Your Level',  desc: 'Find your color level in the SRA box.' },
  { n: '02', title: 'Read Silently',    desc: 'Read the passage carefully and quietly.' },
  { n: '03', title: 'Answer Questions', desc: 'Flip the card and answer from memory.' },
  { n: '04', title: 'Check Your Work',  desc: 'Use the answer key to score yourself.' },
  { n: '05', title: 'Log Your Session', desc: 'Record your score, booklet, and time.' },
  { n: '06', title: 'Level Up!',        desc: 'Score 80%+ on 3 booklets to advance.' },
];

export default function GuidePage() {
  return (
    <div className="col gap-5">
      <div>
        <div className="page-title">SRA Guide</div>
        <div className="page-sub">How to read smarter, score higher, and level up</div>
      </div>

      <div className="card col gap-4">
        <div style={{ fontWeight: 700 }}>How It Works</div>
        <div className="col gap-3">
          {steps.map((s) => (
            <div key={s.n} className="tile row gap-3" style={{ alignItems: 'flex-start' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 24 }}>
                {s.n}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{s.title}</div>
                <div className="small muted" style={{ marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
