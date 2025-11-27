import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyMedia } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const mediaId = parseInt(id);

    // Check if record exists
    const existingMedia = await db
      .select()
      .from(storyMedia)
      .where(eq(storyMedia.id, mediaId))
      .limit(1);

    if (existingMedia.length === 0) {
      return NextResponse.json(
        { error: 'Story media not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { albumId, type, url, title, isFeatured } = body;

    // Validate type if provided
    if (type !== undefined && type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { error: "Type must be 'image' or 'video'", code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (albumId !== undefined) updates.albumId = albumId;
    if (type !== undefined) updates.type = type;
    if (url !== undefined) updates.url = url.trim();
    if (title !== undefined) updates.title = title ? title.trim() : title;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;

    // Update the record
    const updatedMedia = await db
      .update(storyMedia)
      .set(updates)
      .where(eq(storyMedia.id, mediaId))
      .returning();

    return NextResponse.json(updatedMedia[0], { status: 200 });
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
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const mediaId = parseInt(id);

    // Check if record exists
    const existingMedia = await db
      .select()
      .from(storyMedia)
      .where(eq(storyMedia.id, mediaId))
      .limit(1);

    if (existingMedia.length === 0) {
      return NextResponse.json(
        { error: 'Story media not found' },
        { status: 404 }
      );
    }

    // Delete the record
    const deletedMedia = await db
      .delete(storyMedia)
      .where(eq(storyMedia.id, mediaId))
      .returning();

    return NextResponse.json(
      {
        message: 'Story media deleted successfully',
        data: deletedMedia[0],
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