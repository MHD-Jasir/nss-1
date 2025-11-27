import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
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
          { error: 'Program not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(program[0], { status: 200 });
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(programs);

    if (search) {
      query = query.where(like(programs.title, `%${search}%`));
    }

    const results = await query.limit(limit).offset(offset);

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
    const { title, description, date, time, venue, coordinatorIds, participantIds } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required', code: 'MISSING_DATE' },
        { status: 400 }
      );
    }

    if (!time) {
      return NextResponse.json(
        { error: 'Time is required', code: 'MISSING_TIME' },
        { status: 400 }
      );
    }

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue is required', code: 'MISSING_VENUE' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedDate = date.trim();
    const sanitizedTime = time.trim();
    const sanitizedVenue = venue.trim();

    // Prepare coordinator and participant IDs (ensure they are arrays)
    const sanitizedCoordinatorIds = Array.isArray(coordinatorIds) ? coordinatorIds : [];
    const sanitizedParticipantIds = Array.isArray(participantIds) ? participantIds : [];

    const now = new Date().toISOString();

    // Insert new program
    const newProgram = await db
      .insert(programs)
      .values({
        title: sanitizedTitle,
        description: sanitizedDescription,
        date: sanitizedDate,
        time: sanitizedTime,
        venue: sanitizedVenue,
        coordinatorIds: sanitizedCoordinatorIds,
        participantIds: sanitizedParticipantIds,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newProgram[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if program exists
    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, date, time, venue, coordinatorIds, participantIds } = body;

    // Prepare update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) {
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (date !== undefined) {
      updates.date = date.trim();
    }

    if (time !== undefined) {
      updates.time = time.trim();
    }

    if (venue !== undefined) {
      updates.venue = venue.trim();
    }

    if (coordinatorIds !== undefined) {
      updates.coordinatorIds = Array.isArray(coordinatorIds) ? coordinatorIds : [];
    }

    if (participantIds !== undefined) {
      updates.participantIds = Array.isArray(participantIds) ? participantIds : [];
    }

    // Update program
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if program exists
    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete program
    const deletedProgram = await db
      .delete(programs)
      .where(eq(programs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Program deleted successfully',
        program: deletedProgram[0],
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