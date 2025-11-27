import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { departments } from '@/db/schema';
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

    const department = await db
      .select()
      .from(departments)
      .where(eq(departments.id, parseInt(id)))
      .limit(1);

    if (department.length === 0) {
      return NextResponse.json(
        { error: 'Department not found', code: 'DEPARTMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(department[0], { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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
    const { name, isActive } = body;

    const existingDepartment = await db
      .select()
      .from(departments)
      .where(eq(departments.id, parseInt(id)))
      .limit(1);

    if (existingDepartment.length === 0) {
      return NextResponse.json(
        { error: 'Department not found', code: 'DEPARTMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
          { status: 400 }
        );
      }
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingDepartment[0], { status: 200 });
    }

    const updated = await db
      .update(departments)
      .set(updates)
      .where(eq(departments.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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

    const existingDepartment = await db
      .select()
      .from(departments)
      .where(eq(departments.id, parseInt(id)))
      .limit(1);

    if (existingDepartment.length === 0) {
      return NextResponse.json(
        { error: 'Department not found', code: 'DEPARTMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(departments)
      .where(eq(departments.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Department deleted successfully',
        department: deleted[0],
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