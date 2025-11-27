import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { departments } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const department = await db.select()
        .from(departments)
        .where(eq(departments.id, parseInt(id)))
        .limit(1);

      if (department.length === 0) {
        return NextResponse.json({ 
          error: 'Department not found',
          code: 'DEPARTMENT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(department[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');

    let query = db.select().from(departments);
    const conditions = [];

    // Search by name
    if (search) {
      conditions.push(like(departments.name, `%${search}%`));
    }

    // Filter by isActive
    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      conditions.push(eq(departments.isActive, isActive));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isActive } = body;

    // Validate required field
    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Validate name type
    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Check for duplicate name
    const existing = await db.select()
      .from(departments)
      .where(eq(departments.name, name.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "Department with this name already exists",
        code: "DUPLICATE_NAME" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      name: name.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString()
    };

    const newDepartment = await db.insert(departments)
      .values(insertData)
      .returning();

    return NextResponse.json(newDepartment[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if department exists
    const existing = await db.select()
      .from(departments)
      .where(eq(departments.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Department not found',
        code: 'DEPARTMENT_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, isActive } = body;

    // Build update object with only provided fields
    const updates: Record<string, any> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }

      // Check for duplicate name (excluding current department)
      const duplicate = await db.select()
        .from(departments)
        .where(and(
          eq(departments.name, name.trim()),
          eq(departments.id, parseInt(id))
        ))
        .limit(1);

      // If found and it's not the same department
      const allWithName = await db.select()
        .from(departments)
        .where(eq(departments.name, name.trim()))
        .limit(1);

      if (allWithName.length > 0 && allWithName[0].id !== parseInt(id)) {
        return NextResponse.json({ 
          error: "Department with this name already exists",
          code: "DUPLICATE_NAME" 
        }, { status: 400 });
      }

      updates.name = name.trim();
    }

    if (isActive !== undefined) {
      updates.isActive = Boolean(isActive);
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    const updated = await db.update(departments)
      .set(updates)
      .where(eq(departments.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if department exists
    const existing = await db.select()
      .from(departments)
      .where(eq(departments.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Department not found',
        code: 'DEPARTMENT_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(departments)
      .where(eq(departments.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Department deleted successfully',
      department: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}