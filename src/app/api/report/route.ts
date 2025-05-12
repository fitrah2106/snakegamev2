import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Simpan skor (POST)
export async function POST(req: Request) {
  try {
    const { score } = await req.json();

    // Sementara hardcoded userId = 1
    const userId = 1;

    const report = await prisma.gameReport.create({
      data: {
        score,
        userId,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Gagal menyimpan skor' }, { status: 500 });
  }
}

// Ambil skor terbaru (GET)
export async function GET() {
  try {
    const userId = 1; // Sementara hardcoded, nanti bisa pakai session login
    const reports = await prisma.gameReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Gagal mengambil skor' }, { status: 500 });
  }
}
