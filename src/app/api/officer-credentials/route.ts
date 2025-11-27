import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { officerCredentials } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const officerId = searchParams.get('officerId') ?? 'OFFICER001';

    const credentials = await db.select()
      .from(officerCredentials)
      .where(eq(officerCredentials.officerId, officerId))
      .limit(1);

    if (credentials.length === 0) {
      return NextResponse.json(
        { error: 'Officer credentials not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(credentials[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const officerId = searchParams.get('officerId');

    if (!officerId || officerId.trim() === '') {
      return NextResponse.json(
        { error: 'Officer ID is required', code: 'MISSING_OFFICER_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Password is required', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    const existingCredentials = await db.select()
      .from(officerCredentials)
      .where(eq(officerCredentials.officerId, officerId))
      .limit(1);

    if (existingCredentials.length === 0) {
      return NextResponse.json(
        { error: 'Officer credentials not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updated = await db.update(officerCredentials)
      .set({
        password: password.trim(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(officerCredentials.officerId, officerId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update officer credentials', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}