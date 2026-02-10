import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/stats - Lấy thống kê người dùng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default';

    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      // Tạo stats mặc định nếu chưa có
      const newStats = await prisma.userStats.create({
        data: {
          user: {
            connectOrCreate: {
              where: { id: userId },
              create: { id: userId },
            },
          },
        },
      });
      return NextResponse.json(newStats);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// PUT /api/stats - Cập nhật thống kê
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', ...updates } = body;

    const stats = await prisma.userStats.upsert({
      where: { userId },
      update: updates,
      create: {
        user: {
          connectOrCreate: {
            where: { id: userId },
            create: { id: userId },
          },
        },
        ...updates,
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
