import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const user = await prisma.user.create({
      data: { username, password },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'User already exists or invalid' }, { status: 400 });
  }
}
