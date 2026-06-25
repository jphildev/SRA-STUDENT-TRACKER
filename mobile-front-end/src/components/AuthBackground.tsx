'use client';

import styles from './AuthBackground.module.css';

type Circle = {
  color: string;
  size: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
  peak: number; // peak opacity
};

// SRA colour-level palette, scattered around the screen.
const circles: Circle[] = [
  { color: '#5BC8C8', size: 130, top: '-4%',  left: '-10%', delay: 0.0, duration: 7.5, peak: 0.40 },
  { color: '#3D5BFE', size: 90,  top: '6%',   left: '72%',  delay: 1.1, duration: 8.0, peak: 0.32 },
  { color: '#FF9F45', size: 70,  top: '18%',  left: '14%',  delay: 2.3, duration: 6.5, peak: 0.38 },
  { color: '#AFCB46', size: 110, top: '30%',  left: '78%',  delay: 0.6, duration: 8.5, peak: 0.34 },
  { color: '#9B59D0', size: 80,  top: '44%',  left: '-8%',  delay: 3.0, duration: 7.0, peak: 0.30 },
  { color: '#E8B62C', size: 64,  top: '52%',  left: '60%',  delay: 1.8, duration: 6.8, peak: 0.36 },
  { color: '#E5484D', size: 96,  top: '68%',  left: '8%',   delay: 2.6, duration: 8.2, peak: 0.30 },
  { color: '#2FA39B', size: 120, top: '78%',  left: '70%',  delay: 0.9, duration: 7.8, peak: 0.36 },
  { color: '#CDB48E', size: 76,  top: '88%',  left: '20%',  delay: 3.4, duration: 6.6, peak: 0.34 },
  { color: '#3D5BFE', size: 60,  top: '92%',  left: '50%',  delay: 1.4, duration: 7.2, peak: 0.30 },
  { color: '#8A9A3C', size: 84,  top: '14%',  left: '44%',  delay: 4.0, duration: 8.4, peak: 0.26 },
];

export default function AuthBackground() {
  return (
    <div className={styles.bg} aria-hidden>
      {circles.map((c, i) => (
        <span
          key={i}
          className={styles.circle}
          style={
            {
              '--c': c.color,
              '--peak': c.peak,
              width: c.size,
              height: c.size,
              top: c.top,
              left: c.left,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
