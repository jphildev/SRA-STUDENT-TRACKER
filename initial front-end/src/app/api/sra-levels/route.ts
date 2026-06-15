import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: List all SRA color levels (public, cacheable)
export async function GET() {
  try {
    const levels = await prisma.sRAColorLevel.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(levels, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('SRA Levels GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
