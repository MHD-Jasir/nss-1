import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyBatches } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db.select()
      .from(storyBatches)
      .orderBy(desc(storyBatches.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validate required field
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    // Validate name is not empty after trimming
    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: 'Name cannot be empty', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    // Create new story batch with auto-generated timestamp
    const newBatch = await db.insert(storyBatches)
      .values({
        name: trimmedName,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newBatch[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}