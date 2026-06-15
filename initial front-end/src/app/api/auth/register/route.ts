import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const ALLOWED_DOMAIN = '@gbox.adnu.edu.ph';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, username, email, yearLevel, course, password } = body;

    // Validate required fields
    if (!fullName || !username || !email || !yearLevel || !course || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate email domain
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json(
        { error: 'Please use your gbox account to register.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    // Demo Mode Bypass
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('postgresql://username:password')) {
      return NextResponse.json(
        { message: 'Demo account created successfully. You can now sign in.', userId: 'demo-user-id' },
        { status: 201 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: username.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            fullName,
            yearLevel,
            course,
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json(
      { message: 'Account created successfully.', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
