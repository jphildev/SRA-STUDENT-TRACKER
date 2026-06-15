import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { calculateAchievements, getUserAchievements } from '@/lib/achievements';

// GET: List achievements for the authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First recalculate to pick up any new achievements
    await calculateAchievements(session.user.id);

    const achievements = await getUserAchievements(session.user.id);
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Achievements GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
