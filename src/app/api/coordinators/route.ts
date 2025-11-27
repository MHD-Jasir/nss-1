import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { coordinators } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
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
          { error: 'Coordinator not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(coordinator[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');

    let query = db.select().from(coordinators);

    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(coordinators.name, `%${search}%`),
          like(coordinators.department, `%${search}%`)
        )
      );
    }

    // isActive filter
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(coordinators.isActive, isActiveValue));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(coordinators.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { customId, name, department, password, isActive } = body;

    // Validate required fields
    if (!customId || typeof customId !== 'string' || customId.trim() === '') {
      return NextResponse.json(
        { error: 'customId is required and must be a non-empty string', code: 'MISSING_CUSTOM_ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!department || typeof department !== 'string' || department.trim() === '') {
      return NextResponse.json(
        { error: 'department is required and must be a non-empty string', code: 'MISSING_DEPARTMENT' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        { error: 'password is required and must be a non-empty string', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    // Validate customId format (COORD1001, COORD1002, etc.)
    const customIdPattern = /^COORD\d+$/;
    if (!customIdPattern.test(customId.trim())) {
      return NextResponse.json(
        { error: 'customId must follow format COORD#### (e.g., COORD1001)', code: 'INVALID_CUSTOM_ID_FORMAT' },
        { status: 400 }
      );
    }

    // Check if customId already exists
    const existingCoordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.customId, customId.trim()))
      .limit(1);

    if (existingCoordinator.length > 0) {
      return NextResponse.json(
        { error: 'customId already exists', code: 'DUPLICATE_CUSTOM_ID' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      customId: customId.trim(),
      name: name.trim(),
      department: department.trim(),
      password: password.trim(),
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdAt: new Date().toISOString(),
    };

    const newCoordinator = await db
      .insert(coordinators)
      .values(insertData)
      .returning();

    return NextResponse.json(newCoordinator[0], { status: 201 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if coordinator exists
    const existingCoordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .limit(1);

    if (existingCoordinator.length === 0) {
      return NextResponse.json(
        { error: 'Coordinator not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, department, password, isActive } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (department !== undefined) {
      if (typeof department !== 'string' || department.trim() === '') {
        return NextResponse.json(
          { error: 'department must be a non-empty string', code: 'INVALID_DEPARTMENT' },
          { status: 400 }
        );
      }
      updates.department = department.trim();
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.trim() === '') {
        return NextResponse.json(
          { error: 'password must be a non-empty string', code: 'INVALID_PASSWORD' },
          { status: 400 }
        );
      }
      updates.password = password.trim();
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

    // Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updatedCoordinator = await db
      .update(coordinators)
      .set(updates)
      .where(eq(coordinators.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedCoordinator[0], { status: 200 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if coordinator exists
    const existingCoordinator = await db
      .select()
      .from(coordinators)
      .where(eq(coordinators.id, parseInt(id)))
      .limit(1);

    if (existingCoordinator.length === 0) {
      return NextResponse.json(
        { error: 'Coordinator not found', code: 'NOT_FOUND' },
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
        coordinator: deleted[0],
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