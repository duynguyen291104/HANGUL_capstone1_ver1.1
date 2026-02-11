import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/vocabulary - Lấy danh sách từ vựng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { ko: { contains: search, mode: 'insensitive' } },
        { vi: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    const [vocabulary, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { stt: 'asc' },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    return NextResponse.json({
      data: vocabulary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary' },
      { status: 500 }
    );
  }
}

// POST /api/vocabulary - Thêm từ vựng mới (hỗ trợ cả single và bulk insert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a bulk insert (array) or single insert
    if (Array.isArray(body)) {
      // Bulk insert
      const validItems = body.filter(item => item.ko && item.vi);
      
      if (validItems.length === 0) {
        return NextResponse.json(
          { error: 'No valid vocabulary items provided' },
          { status: 400 }
        );
      }

      const vocabularyItems = await prisma.vocabulary.createMany({
        data: validItems.map(item => ({
          ko: item.ko,
          vi: item.vi,
          category: item.category || null,
          difficulty: item.difficulty?.toUpperCase() || 'BEGINNER',
          tags: item.tags || [],
          stt: item.stt || null,
        })),
        skipDuplicates: true,
      });

      return NextResponse.json(
        { 
          message: `Successfully added ${vocabularyItems.count} vocabulary items`,
          count: vocabularyItems.count 
        }, 
        { status: 201 }
      );
    } else {
      // Single insert
      const { ko, vi, category, difficulty, tags } = body;

      if (!ko || !vi) {
        return NextResponse.json(
          { error: 'Korean word and Vietnamese meaning are required' },
          { status: 400 }
        );
      }

      const vocabulary = await prisma.vocabulary.create({
        data: {
          ko,
          vi,
          category,
          difficulty: difficulty?.toUpperCase() || 'BEGINNER',
          tags: tags || [],
        },
      });

      return NextResponse.json(vocabulary, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to create vocabulary' },
      { status: 500 }
    );
  }
}
