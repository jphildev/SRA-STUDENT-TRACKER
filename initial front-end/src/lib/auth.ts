import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const ALLOWED_DOMAIN = '@gbox.adnu.edu.ph';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Domain restriction
        if (!email.endsWith(ALLOWED_DOMAIN)) {
          throw new Error('Please use your gbox account to sign in.');
        }

        // Demo Mode Bypass (if no database is connected)
        if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('postgresql://username:password')) {
          return {
            id: 'demo-user-id',
            email: email,
            name: email.split('@')[0],
          };
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });

        if (!user) {
          throw new Error('Invalid email or password.');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
