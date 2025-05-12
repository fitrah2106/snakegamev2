import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies(); // Await cookies to resolve the promise
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: number; username: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }
}