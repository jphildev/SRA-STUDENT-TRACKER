export type LevelStatus = 'completed' | 'current' | 'upcoming' | 'locked';

export interface SraLevel {
  name: string;
  color: string;   // swatch hex
  hex: string;     // display label
  grade: string;
  desc: string;
  progress: number; // 0..100
  status: LevelStatus;
}

/**
 * The full SRA colour ladder (easiest → hardest).
 * Blue is the learner's current level (6 of 10).
 */
export const SRA_LEVELS: SraLevel[] = [
  { name: 'Aqua',   color: '#5BC8C8', hex: '#5BC8C8', grade: 'Grade 1',   desc: 'Entry level. Short, simple passages.',       progress: 100, status: 'completed' },
  { name: 'Tan',    color: '#CDB48E', hex: '#CDB48E', grade: 'Grade 2',   desc: 'Basic passages with simple inference.',      progress: 100, status: 'completed' },
  { name: 'Lime',   color: '#AFCB46', hex: '#AFCB46', grade: 'Grade 3',   desc: 'Short narratives, finding the main idea.',   progress: 100, status: 'completed' },
  { name: 'Teal',   color: '#2FA39B', hex: '#2FA39B', grade: 'Grade 3–4', desc: 'Sequencing events and details.',            progress: 100, status: 'completed' },
  { name: 'Olive',  color: '#8A9A3C', hex: '#8A9A3C', grade: 'Grade 4',   desc: 'Longer passages, cause and effect.',         progress: 100, status: 'completed' },
  { name: 'Blue',   color: '#3D5BFE', hex: '#3D5BFE', grade: 'Grade 4–5', desc: 'Mixed expository and narrative texts.',      progress: 40,  status: 'current'   },
  { name: 'Orange', color: '#FF9F45', hex: '#FF9F45', grade: 'Grade 5–6', desc: 'Advanced passages, complex ideas.',          progress: 0,   status: 'upcoming'  },
  { name: 'Purple', color: '#9B59D0', hex: '#9B59D0', grade: 'Grade 6–7', desc: 'Multi-layered comprehension texts.',         progress: 0,   status: 'locked'    },
  { name: 'Red',    color: '#E5484D', hex: '#E5484D', grade: 'Grade 7–8', desc: 'Critical reading and synthesis.',            progress: 0,   status: 'locked'    },
  { name: 'Gold',   color: '#E8B62C', hex: '#E8B62C', grade: 'Grade 8+',  desc: 'Mastery-level comprehension passages.',      progress: 0,   status: 'locked'    },
];

export const COMPLETED_LEVELS = SRA_LEVELS.filter((l) => l.status === 'completed').length;
export const TOTAL_LEVELS = SRA_LEVELS.length;
