import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { coordinators } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const coordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .limit(1);

    if (coordinator.length === 0) {
      return NextResponse.json(
        { error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(coordinator[0], { status: 200 });
  } catch (error: any) {
    console.error('GET coordinator error:', error);
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
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingCoordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .limit(1);

    if (existingCoordinator.length === 0) {
      return NextResponse.json(
        { error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, department, password, isActive } = body;

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

    if (department !== undefined) {
      if (typeof department !== 'string' || department.trim().length === 0) {
        return NextResponse.json(
          { error: 'Department must be a non-empty string', code: 'INVALID_DEPARTMENT' },
          { status: 400 }
        );
      }
      updates.department = department.trim();
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length === 0) {
        return NextResponse.json(
          { error: 'Password must be a non-empty string', code: 'INVALID_PASSWORD' },
          { status: 400 }
        );
      }
      updates.password = password;
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
      return NextResponse.json(existingCoordinator[0], { status: 200 });
    }

    const updatedCoordinator = await db
      .update(coordinators)
      .set(updates)
      .where(eq(coordinators.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedCoordinator[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT coordinator error:', error);
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
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingCoordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .limit(1);

    if (existingCoordinator.length === 0) {
      return NextResponse.json(
        { error: 'Coordinator not found' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Coordinator deleted successfully',
        coordinator: deleted[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE coordinator error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}