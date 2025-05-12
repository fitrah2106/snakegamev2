import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies(); // Await cookies to resolve the promise
    const token = cookieStore.get('token');

    console.log('Received game report request');
    console.log('Token present:', !!token);

    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(
        token.value,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: number };

      console.log('Token decoded successfully, userId:', decoded.userId);

      const { score } = await request.json();
      console.log('Received score:', score);

      if (typeof score !== 'number') {
        console.log('Invalid score type:', typeof score);
        return NextResponse.json(
          { message: 'Invalid score' },
          { status: 400 }
        );
      }

      const gameReport = await prisma.gameReport.create({
        data: {
          score,
          userId: decoded.userId,
        },
      });

      console.log('Game report created successfully:', gameReport);

      return NextResponse.json(gameReport, { status: 201 });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error saving game report:', error);
    return NextResponse.json(
      { error: 'Failed to process game report' },
      { status: 500 }
    );
  }
}