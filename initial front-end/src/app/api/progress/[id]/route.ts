import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateAchievements } from '@/lib/achievements';

// GET: Single progress entry
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await prisma.progressEntry.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { colorLevel: true, targetColorLevel: true },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update progress entry
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.progressEntry.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const body = await request.json();
    const { date, colorLevelId, targetColorLevelId, powerBuildersCompleted, score, totalItems, timeframe, notes } = body;

    const entry = await prisma.progressEntry.update({
      where: { id: params.id },
      data: {
        date: date ? new Date(date) : undefined,
        colorLevelId: colorLevelId || undefined,
        targetColorLevelId: targetColorLevelId || null,
        powerBuildersCompleted: powerBuildersCompleted || undefined,
        score: score !== undefined ? score : undefined,
        totalItems: totalItems || undefined,
        timeframe: timeframe || undefined,
        notes: notes !== undefined ? notes || null : undefined,
      },
      include: { colorLevel: true, targetColorLevel: true },
    });

    await calculateAchievements(session.user.id);

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Progress PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete progress entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.progressEntry.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    await prisma.progressEntry.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('Progress DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
