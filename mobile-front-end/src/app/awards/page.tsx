'use client';

const badges = [
  { name: 'First Finish',   earned: true },
  { name: 'On Fire',        earned: true },
  { name: 'Speed Reader',   earned: true },
  { name: 'Perfect Score',  earned: true },
  { name: 'Level Up',       earned: true },
  { name: 'Consistent',     earned: true },
  { name: 'Eagle Eye',      earned: false },
  { name: 'Rocket Pace',    earned: false },
  { name: 'Star Student',   earned: false },
  { name: 'Bookworm',       earned: false },
  { name: 'Diamond Reader', earned: false },
  { name: 'All-Rounder',    earned: false },
];

export default function AwardsPage() {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="col gap-5">
      <div className="row-between" style={{ alignItems: 'flex-end' }}>
        <div className="page-title">Badges</div>
        <div className="muted small">{earned} of {badges.length} earned</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {badges.map((b) => (
          <div
            key={b.name}
            className="tile col gap-2"
            style={{ alignItems: 'center', textAlign: 'center', padding: '18px 8px' }}
          >
            <span className={`dot ${b.earned ? '' : 'dot--locked'}`} style={{ width: 48, height: 48 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 12.5, lineHeight: 1.2 }}>{b.name}</div>
              <div className="tiny muted" style={{ marginTop: 2 }}>{b.earned ? 'Earned' : 'Locked'}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tile">
        <div style={{ fontWeight: 700 }}>Tip for Maria</div>
        <div className="small muted" style={{ marginTop: 4 }}>
          Finish a booklet under 10 minutes to earn Speed Reader.
        </div>
      </div>
    </div>
  );
}
