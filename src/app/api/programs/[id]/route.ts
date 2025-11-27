import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const program = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (program.length === 0) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(program[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      venue,
      coordinatorIds,
      participantIds,
    } = body;

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (date !== undefined) updates.date = date.trim();
    if (time !== undefined) updates.time = time.trim();
    if (venue !== undefined) updates.venue = venue.trim();
    if (coordinatorIds !== undefined) updates.coordinatorIds = coordinatorIds;
    if (participantIds !== undefined) updates.participantIds = participantIds;

    const updatedProgram = await db
      .update(programs)
      .set(updates)
      .where(eq(programs.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProgram[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(programs)
      .where(eq(programs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Program deleted successfully',
        program: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}