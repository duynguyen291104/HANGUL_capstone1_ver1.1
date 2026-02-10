import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/progress - Lấy tiến độ học tập
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const vocabId = searchParams.get('vocabId');

    if (vocabId) {
      const progress = await prisma.vocabProgress.findFirst({
        where: { 
          vocabId,
          userId: userId || undefined,
        },
        include: {
          vocabulary: true,
        },
      });

      return NextResponse.json(progress);
    }

    const progress = await prisma.vocabProgress.findMany({
      where: userId ? { userId } : {},
      include: {
        vocabulary: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Cập nhật tiến độ học tập
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vocabId, userId, quality } = body;

    if (!vocabId) {
      return NextResponse.json(
        { error: 'Vocabulary ID is required' },
        { status: 400 }
      );
    }

    // Tìm hoặc tạo progress
    let progress = await prisma.vocabProgress.findFirst({
      where: { vocabId, userId: userId || null },
    });

    const now = new Date();
    
    if (!progress) {
      // Tạo mới progress
      progress = await prisma.vocabProgress.create({
        data: {
          vocabId,
          userId,
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 1,
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +1 day
          correctAnswers: quality >= 3 ? 1 : 0,
          wrongAnswers: quality < 3 ? 1 : 0,
          lastStudied: now,
        },
      });
    } else {
      // Cập nhật progress theo thuật toán SM-2
      let { easeFactor, intervalDays, repetitions } = progress;
      
      if (quality >= 3) {
        repetitions += 1;
        if (repetitions === 1) {
          intervalDays = 1;
        } else if (repetitions === 2) {
          intervalDays = 6;
        } else {
          intervalDays = Math.round(intervalDays * easeFactor);
        }
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      } else {
        repetitions = 0;
        intervalDays = 1;
      }

      easeFactor = Math.max(1.3, easeFactor);
      const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

      progress = await prisma.vocabProgress.update({
        where: { id: progress.id },
        data: {
          easeFactor,
          intervalDays,
          repetitions,
          dueDate,
          correctAnswers: { increment: quality >= 3 ? 1 : 0 },
          wrongAnswers: { increment: quality < 3 ? 1 : 0 },
          lastStudied: now,
        },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// GET /api/progress/due - Lấy từ vựng đến hạn ôn tập
export async function getDueVocabulary(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const dueProgress = await prisma.vocabProgress.findMany({
      where: {
        userId: userId || null,
        dueDate: { lte: new Date() },
      },
      include: {
        vocabulary: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(dueProgress);
  } catch (error) {
    console.error('Error fetching due vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due vocabulary' },
      { status: 500 }
    );
  }
}
