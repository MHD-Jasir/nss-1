import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single student by ID
    if (id) {
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
          { error: 'Student not found', code: 'STUDENT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(student[0], { status: 200 });
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(students);

    if (search) {
      query = query.where(
        or(
          like(students.name, `%${search}%`),
          like(students.department, `%${search}%`)
        )
      );
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
    const { customId, name, department, password, profileImageUrl } = body;

    // Validate required fields
    if (!customId) {
      return NextResponse.json(
        { error: 'Custom ID is required', code: 'MISSING_CUSTOM_ID' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!department) {
      return NextResponse.json(
        { error: 'Department is required', code: 'MISSING_DEPARTMENT' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCustomId = customId.trim();
    const sanitizedName = name.trim();
    const sanitizedDepartment = department.trim();
    const sanitizedPassword = password.trim();

    // Check if customId is unique
    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.customId, sanitizedCustomId))
      .limit(1);

    if (existingStudent.length > 0) {
      return NextResponse.json(
        { error: 'Custom ID already exists', code: 'DUPLICATE_CUSTOM_ID' },
        { status: 400 }
      );
    }

    // Create new student
    const newStudent = await db
      .insert(students)
      .values({
        customId: sanitizedCustomId,
        name: sanitizedName,
        department: sanitizedDepartment,
        password: sanitizedPassword,
        profileImageUrl: profileImageUrl || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newStudent[0], { status: 201 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { error: 'Student not found', code: 'STUDENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, department, password, profileImageUrl } = body;

    // Build update object with only provided fields
    const updates: Record<string, any> = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (department !== undefined) {
      updates.department = department.trim();
    }

    if (password !== undefined) {
      updates.password = password.trim();
    }

    if (profileImageUrl !== undefined) {
      updates.profileImageUrl = profileImageUrl;
    }

    // Update student
    const updatedStudent = await db
      .update(students)
      .set(updates)
      .where(eq(students.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedStudent[0], { status: 200 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (existingStudent.length === 0) {
      return NextResponse.json(
        { error: 'Student not found', code: 'STUDENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete student
    const deletedStudent = await db
      .delete(students)
      .where(eq(students.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Student deleted successfully',
        student: deletedStudent[0],
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