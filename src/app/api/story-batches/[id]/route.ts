import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyBatches } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const batchId = parseInt(id);

    // Check if record exists
    const existingBatch = await db
      .select()
      .from(storyBatches)
      .where(eq(storyBatches.id, batchId))
      .limit(1);

    if (existingBatch.length === 0) {
      return NextResponse.json(
        { error: 'Story batch not found', code: 'BATCH_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the batch
    const deleted = await db
      .delete(storyBatches)
      .where(eq(storyBatches.id, batchId))
      .returning();

    return NextResponse.json(
      {
        message: 'Story batch deleted successfully',
        batch: deleted[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}