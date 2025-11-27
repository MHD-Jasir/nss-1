import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studentActivities } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
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

    const activityId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { studentCustomId, badge, title, content } = body;

    // Validate badge if provided
    if (badge !== undefined && badge !== 'green' && badge !== 'yellow') {
      return NextResponse.json(
        { error: 'Badge must be either "green" or "yellow"', code: 'INVALID_BADGE' },
        { status: 400 }
      );
    }

    // Check if activity exists
    const existingActivity = await db
      .select()
      .from(studentActivities)
      .where(eq(studentActivities.id, activityId))
      .limit(1);

    if (existingActivity.length === 0) {
      return NextResponse.json(
        { error: 'Student activity not found' },
        { status: 404 }
      );
    }

    // Prepare update data (only include provided fields)
    const updateData: {
      studentCustomId?: string;
      badge?: string;
      title?: string;
      content?: string;
    } = {};

    if (studentCustomId !== undefined) updateData.studentCustomId = studentCustomId;
    if (badge !== undefined) updateData.badge = badge;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    // Update activity
    const updated = await db
      .update(studentActivities)
      .set(updateData)
      .where(eq(studentActivities.id, activityId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

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

    const activityId = parseInt(id);

    // Check if activity exists
    const existingActivity = await db
      .select()
      .from(studentActivities)
      .where(eq(studentActivities.id, activityId))
      .limit(1);

    if (existingActivity.length === 0) {
      return NextResponse.json(
        { error: 'Student activity not found' },
        { status: 404 }
      );
    }

    // Delete activity
    const deleted = await db
      .delete(studentActivities)
      .where(eq(studentActivities.id, activityId))
      .returning();

    return NextResponse.json(
      {
        message: 'Student activity deleted successfully',
        deletedActivity: deleted[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}