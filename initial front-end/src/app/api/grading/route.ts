import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Get grading rubric (public, cacheable)
export async function GET() {
  try {
    const rubric = await prisma.gradingRubric.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(rubric, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Grading GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
