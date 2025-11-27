import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyAlbums } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    const albumId = parseInt(id);

    // Check if story album exists
    const existingAlbum = await db.select()
      .from(storyAlbums)
      .where(eq(storyAlbums.id, albumId))
      .limit(1);

    if (existingAlbum.length === 0) {
      return NextResponse.json(
        { 
          error: "Story album not found",
          code: "ALBUM_NOT_FOUND" 
        },
        { status: 404 }
      );
    }

    // Delete the story album
    const deleted = await db.delete(storyAlbums)
      .where(eq(storyAlbums.id, albumId))
      .returning();

    return NextResponse.json(
      { 
        message: "Story album deleted successfully",
        deletedAlbum: deleted[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}