import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyAlbums, storyBatches } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const batchId = searchParams.get('batchId');

    let query = db.select().from(storyAlbums);

    if (batchId) {
      const batchIdInt = parseInt(batchId);
      if (isNaN(batchIdInt)) {
        return NextResponse.json({ 
          error: "Invalid batch ID",
          code: "INVALID_BATCH_ID" 
        }, { status: 400 });
      }
      query = query.where(eq(storyAlbums.batchId, batchIdInt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, name } = body;

    if (!batchId) {
      return NextResponse.json({ 
        error: "Batch ID is required",
        code: "MISSING_BATCH_ID" 
      }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    const batchIdInt = parseInt(batchId);
    if (isNaN(batchIdInt)) {
      return NextResponse.json({ 
        error: "Batch ID must be a valid integer",
        code: "INVALID_BATCH_ID" 
      }, { status: 400 });
    }

    const batchExists = await db.select()
      .from(storyBatches)
      .where(eq(storyBatches.id, batchIdInt))
      .limit(1);

    if (batchExists.length === 0) {
      return NextResponse.json({ 
        error: "Story batch not found",
        code: "BATCH_NOT_FOUND" 
      }, { status: 404 });
    }

    const newAlbum = await db.insert(storyAlbums)
      .values({
        batchId: batchIdInt,
        name: name.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newAlbum[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}