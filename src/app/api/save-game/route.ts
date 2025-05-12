import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { gameId, saveData } = await request.json();

    if (!gameId || !saveData) {
      return NextResponse.json(
        { message: 'Game ID and save data are required' },
        { status: 400 }
      );
    }

    const savedGame = await prisma.savedGame.create({
      data: {
        gameId,
        saveData,
      },
    });

    return NextResponse.json(savedGame, { status: 201 });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}