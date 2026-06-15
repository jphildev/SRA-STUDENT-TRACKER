import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateAchievements } from '@/lib/achievements';

// GET: List all progress entries for the authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await prisma.progressEntry.findMany({
      where: { userId: session.user.id },
      include: {
        colorLevel: true,
        targetColorLevel: true,
      },
      orderBy: { date: 'desc' },
    });

    // Calculate stats
    const totalPowerBuilders = entries.reduce((sum, e) => sum + e.powerBuildersCompleted, 0);
    const scores = entries.map((e) => Math.round((e.score / e.totalItems) * 100));
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    // Get latest level
    const latestEntry = entries.length > 0 ? entries[0] : null;

    // Get active goal
    const activeGoal = await prisma.goal.findFirst({
      where: { userId: session.user.id, isActive: true },
      include: { targetLevel: true, currentLevel: true },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      totalPowerBuilders,
      averageScore,
      highestScore,
      lowestScore,
      totalEntries: entries.length,
      currentLevel: latestEntry?.colorLevel || null,
      targetLevel: activeGoal?.targetLevel || latestEntry?.targetColorLevel || null,
    };

    return NextResponse.json({ entries, stats });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new progress entry
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, colorLevelId, targetColorLevelId, powerBuildersCompleted, score, totalItems, timeframe, notes } = body;

    if (!colorLevelId || !date || score === undefined || totalItems === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (score < 0 || score > totalItems) {
      return NextResponse.json({ error: 'Score must be between 0 and total items.' }, { status: 400 });
    }

    const entry = await prisma.progressEntry.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        colorLevelId,
        targetColorLevelId: targetColorLevelId || null,
        powerBuildersCompleted: powerBuildersCompleted || 1,
        score,
        totalItems: totalItems || 20,
        timeframe: timeframe || 'daily',
        notes: notes || null,
      },
      include: {
        colorLevel: true,
        targetColorLevel: true,
      },
    });

    // Recalculate achievements after adding a progress entry
    await calculateAchievements(session.user.id);

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
