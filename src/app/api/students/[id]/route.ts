import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
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

    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (student.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student[0], { status: 200 });
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

    const body = await request.json();
    const { name, department, password, profileImageUrl } = body;

    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (department !== undefined) {
      if (typeof department !== 'string' || department.trim() === '') {
        return NextResponse.json(
          { error: 'Department must be a non-empty string', code: 'INVALID_DEPARTMENT' },
          { status: 400 }
        );
      }
      updates.department = department.trim();
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.trim() === '') {
        return NextResponse.json(
          { error: 'Password must be a non-empty string', code: 'INVALID_PASSWORD' },
          { status: 400 }
        );
      }
      updates.password = password;
    }

    if (profileImageUrl !== undefined) {
      if (profileImageUrl !== null && typeof profileImageUrl !== 'string') {
        return NextResponse.json(
          { error: 'Profile image URL must be a string or null', code: 'INVALID_PROFILE_IMAGE_URL' },
          { status: 400 }
        );
      }
      updates.profileImageUrl = profileImageUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingStudent[0], { status: 200 });
    }

    const updatedStudent = await db
      .update(students)
      .set(updates)
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (updatedStudent.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStudent[0], { status: 200 });
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

    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(students)
      .where(eq(students.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Student deleted successfully',
        student: deleted[0]
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