import { prisma } from './prisma';

interface AchievementCheck {
  type: string;
  title: string;
  description: string;
  check: (userId: string) => Promise<boolean>;
}

const ACHIEVEMENT_DEFINITIONS: AchievementCheck[] = [
  {
    type: 'FIRST_STEPS',
    title: 'First Steps',
    description: 'Completed your first Power Builder entry',
    check: async (userId: string) => {
      const count = await prisma.progressEntry.count({ where: { userId } });
      return count >= 1;
    },
  },
  {
    type: 'GETTING_STARTED',
    title: 'Getting Started',
    description: 'Completed 5 Power Builder entries',
    check: async (userId: string) => {
      const count = await prisma.progressEntry.count({ where: { userId } });
      return count >= 5;
    },
  },
  {
    type: 'DEDICATED_READER',
    title: 'Dedicated Reader',
    description: 'Completed 25 Power Builder entries',
    check: async (userId: string) => {
      const count = await prisma.progressEntry.count({ where: { userId } });
      return count >= 25;
    },
  },
  {
    type: 'CENTURY_MARK',
    title: 'Century Mark',
    description: 'Completed 100 Power Builder entries',
    check: async (userId: string) => {
      const count = await prisma.progressEntry.count({ where: { userId } });
      return count >= 100;
    },
  },
  {
    type: 'SHARP_MIND',
    title: 'Sharp Mind',
    description: 'Scored 90% or higher on a Power Builder',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        select: { score: true, totalItems: true },
      });
      return entries.some((e) => (e.score / e.totalItems) * 100 >= 90);
    },
  },
  {
    type: 'PERFECT_SCORE',
    title: 'Perfect Score',
    description: 'Achieved a perfect score on a Power Builder',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        select: { score: true, totalItems: true },
      });
      return entries.some((e) => e.score === e.totalItems);
    },
  },
  {
    type: 'ON_A_ROLL',
    title: 'On a Roll',
    description: 'Scored 80% or higher on 5 consecutive Power Builders',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        select: { score: true, totalItems: true },
      });
      let streak = 0;
      for (const e of entries) {
        if ((e.score / e.totalItems) * 100 >= 80) {
          streak++;
          if (streak >= 5) return true;
        } else {
          streak = 0;
        }
      }
      return false;
    },
  },
  {
    type: 'LEVEL_UP',
    title: 'Level Up',
    description: 'Advanced to a new SRA color level',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        include: { colorLevel: true },
      });
      if (entries.length < 2) return false;
      const levels = entries.map((e) => e.colorLevel.order);
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1]) return true;
      }
      return false;
    },
  },
  {
    type: 'DOUBLE_JUMP',
    title: 'Double Jump',
    description: 'Advanced 2 or more color levels within a week',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        include: { colorLevel: true },
      });
      if (entries.length < 2) return false;
      for (let i = 0; i < entries.length; i++) {
        const weekLater = new Date(entries[i].date);
        weekLater.setDate(weekLater.getDate() + 7);
        const laterEntries = entries.filter(
          (e) => e.date <= weekLater && e.date >= entries[i].date
        );
        if (laterEntries.length > 0) {
          const minOrder = Math.min(...laterEntries.map((e) => e.colorLevel.order));
          const maxOrder = Math.max(...laterEntries.map((e) => e.colorLevel.order));
          if (maxOrder - minOrder >= 2) return true;
        }
      }
      return false;
    },
  },
  {
    type: 'CONSISTENT',
    title: 'Consistent Learner',
    description: 'Logged progress for 7 consecutive days',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
        select: { date: true },
      });
      if (entries.length < 7) return false;
      const dates = Array.from(new Set(entries.map((e) => e.date.toISOString().split('T')[0]))).sort();
      let streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          if (streak >= 7) return true;
        } else {
          streak = 1;
        }
      }
      return false;
    },
  },
  {
    type: 'GOAL_CRUSHER',
    title: 'Goal Crusher',
    description: 'Reached your target color level within your set timeframe',
    check: async (userId: string) => {
      const goals = await prisma.goal.findMany({
        where: { userId },
        include: { targetLevel: true },
      });
      const latestEntry = await prisma.progressEntry.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { colorLevel: true },
      });
      if (!latestEntry || goals.length === 0) return false;
      return goals.some(
        (g) => latestEntry.colorLevel.order >= g.targetLevel.order &&
               (!g.targetDate || new Date() <= g.targetDate)
      );
    },
  },
  {
    type: 'RISING_AVERAGE',
    title: 'Rising Average',
    description: 'Improved your average score by 10% or more over 2 weeks',
    check: async (userId: string) => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const olderEntries = await prisma.progressEntry.findMany({
        where: { userId, date: { lt: twoWeeksAgo } },
        select: { score: true, totalItems: true },
      });
      const recentEntries = await prisma.progressEntry.findMany({
        where: { userId, date: { gte: twoWeeksAgo } },
        select: { score: true, totalItems: true },
      });
      if (olderEntries.length === 0 || recentEntries.length === 0) return false;
      const oldAvg = olderEntries.reduce((sum, e) => sum + (e.score / e.totalItems) * 100, 0) / olderEntries.length;
      const newAvg = recentEntries.reduce((sum, e) => sum + (e.score / e.totalItems) * 100, 0) / recentEntries.length;
      return newAvg - oldAvg >= 10;
    },
  },
  {
    type: 'SPEED_DEMON',
    title: 'Speed Demon',
    description: 'Completed 5 or more Power Builders in a single day',
    check: async (userId: string) => {
      const entries = await prisma.progressEntry.findMany({
        where: { userId },
        select: { date: true },
      });
      const dateCounts: Record<string, number> = {};
      for (const e of entries) {
        const dateStr = e.date.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      }
      return Object.values(dateCounts).some((count) => count >= 5);
    },
  },
];

export async function calculateAchievements(userId: string): Promise<void> {
  const existingAchievements = await prisma.achievement.findMany({
    where: { userId },
    select: { type: true },
  });
  const existingTypes = new Set(existingAchievements.map((a) => a.type));

  for (const definition of ACHIEVEMENT_DEFINITIONS) {
    if (existingTypes.has(definition.type)) continue;

    try {
      const earned = await definition.check(userId);
      if (earned) {
        await prisma.achievement.create({
          data: {
            userId,
            type: definition.type,
            title: definition.title,
            description: definition.description,
          },
        });
      }
    } catch (error) {
      console.error(`Error checking achievement ${definition.type}:`, error);
    }
  }
}

export async function getUserAchievements(userId: string) {
  return prisma.achievement.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
  });
}
