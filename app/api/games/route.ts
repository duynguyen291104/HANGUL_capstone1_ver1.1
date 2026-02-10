import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/games - Lấy kết quả các game
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const gameType = searchParams.get('gameType');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (userId) where.userId = userId;
    if (gameType) where.gameType = gameType.toUpperCase();

    const gameResults = await prisma.gameResult.findMany({
      where,
      orderBy: { playedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(gameResults);
  } catch (error) {
    console.error('Error fetching game results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game results' },
      { status: 500 }
    );
  }
}

// POST /api/games - Lưu kết quả game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameType, score, correctAnswers, totalQuestions, timeSpent } = body;

    if (!gameType || score === undefined || !totalQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const gameResult = await prisma.gameResult.create({
      data: {
        userId,
        gameType: gameType.toUpperCase(),
        score,
        correctAnswers: correctAnswers || 0,
        totalQuestions,
        timeSpent: timeSpent || 0,
      },
    });

    // Cập nhật user stats
    if (userId) {
      const stats = await prisma.userStats.findUnique({
        where: { userId },
      });

      if (stats) {
        const newTotalGames = stats.totalGamesPlayed + 1;
        const newTotalTime = stats.totalTimeSpent + (timeSpent || 0);
        const accuracy = (correctAnswers / totalQuestions) * 100;
        const newAvgAccuracy = 
          (stats.averageAccuracy * stats.totalGamesPlayed + accuracy) / newTotalGames;

        await prisma.userStats.update({
          where: { userId },
          data: {
            totalGamesPlayed: newTotalGames,
            totalTimeSpent: newTotalTime,
            averageAccuracy: newAvgAccuracy,
            xp: { increment: score },
          },
        });
      }
    }

    return NextResponse.json(gameResult, { status: 201 });
  } catch (error) {
    console.error('Error saving game result:', error);
    return NextResponse.json(
      { error: 'Failed to save game result' },
      { status: 500 }
    );
  }
}
