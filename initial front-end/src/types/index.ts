import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface User {
    username?: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    username?: string;
  }
}

// SRA Color Level
export interface SRALevel {
  id: string;
  code: string;
  name: string;
  hexColor: string;
  order: number;
  gradeLevel: string;
  lexileRange: string | null;
}

// Progress Entry
export interface ProgressEntryData {
  id: string;
  userId: string;
  colorLevelId: string;
  targetColorLevelId: string | null;
  date: string;
  powerBuildersCompleted: number;
  score: number;
  totalItems: number;
  timeframe: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  colorLevel: SRALevel;
  targetColorLevel: SRALevel | null;
}

// Achievement
export interface AchievementData {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  earnedAt: string;
  metadata: string | null;
}

// Goal
export interface GoalData {
  id: string;
  userId: string;
  currentColorLevelId: string;
  targetColorLevelId: string;
  timeframe: string;
  targetDate: string | null;
  isActive: boolean;
  currentLevel: SRALevel;
  targetLevel: SRALevel;
}

// Grading Rubric
export interface GradingRubricData {
  id: string;
  levelName: string;
  minScore: number;
  maxScore: number;
  description: string;
  interpretation: string;
  order: number;
}

// Stats
export interface ProgressStats {
  totalPowerBuilders: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalEntries: number;
  currentLevel: SRALevel | null;
  targetLevel: SRALevel | null;
}
