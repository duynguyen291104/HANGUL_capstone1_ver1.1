import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/vocabulary/[id] - Lấy chi tiết từ vựng
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id },
      include: {
        progress: true,
      },
    });

    if (!vocabulary) {
      return NextResponse.json(
        { error: 'Vocabulary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vocabulary);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary' },
      { status: 500 }
    );
  }
}

// PUT /api/vocabulary/[id] - Cập nhật từ vựng
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const vocabulary = await prisma.vocabulary.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(vocabulary);
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to update vocabulary' },
      { status: 500 }
    );
  }
}

// DELETE /api/vocabulary/[id] - Xóa từ vựng
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.vocabulary.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Vocabulary deleted successfully' });
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to delete vocabulary' },
      { status: 500 }
    );
  }
}
