import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studentActivities } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const studentId = searchParams.get('studentId');

    let query = db.select().from(studentActivities);

    if (studentId) {
      query = query.where(eq(studentActivities.studentCustomId, studentId));
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
    const { studentCustomId, badge, title, content } = body;

    // Validate required fields
    if (!studentCustomId) {
      return NextResponse.json(
        { error: 'studentCustomId is required', code: 'MISSING_STUDENT_CUSTOM_ID' },
        { status: 400 }
      );
    }

    if (!badge) {
      return NextResponse.json(
        { error: 'badge is required', code: 'MISSING_BADGE' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    // Validate badge value
    if (badge !== 'green' && badge !== 'yellow') {
      return NextResponse.json(
        { error: 'badge must be either "green" or "yellow"', code: 'INVALID_BADGE' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      studentCustomId: studentCustomId.trim(),
      badge: badge.trim(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const newActivity = await db.insert(studentActivities)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newActivity[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}