import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Get the authenticated user's account details
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            fullName: true,
            yearLevel: true,
            course: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Account GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update account details
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, username, yearLevel, course, currentPassword, newPassword } = body;

    // Handle password change
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { passwordHash: newHash },
      });
    }

    // Check username uniqueness
    if (username) {
      const existing = await prisma.user.findFirst({
        where: {
          username: username.toLowerCase(),
          NOT: { id: session.user.id },
        },
      });
      if (existing) {
        return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 });
      }
    }

    // Update user and profile
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: username?.toLowerCase() || undefined,
        profile: {
          update: {
            fullName: fullName || undefined,
            yearLevel: yearLevel || undefined,
            course: course || undefined,
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            fullName: true,
            yearLevel: true,
            course: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Account PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
