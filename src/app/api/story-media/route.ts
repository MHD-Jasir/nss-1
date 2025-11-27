import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { storyMedia, storyAlbums } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const albumId = searchParams.get('albumId');
    const isFeatured = searchParams.get('isFeatured');

    let query = db.select().from(storyMedia);

    const conditions = [];

    if (albumId) {
      const albumIdNum = parseInt(albumId);
      if (isNaN(albumIdNum)) {
        return NextResponse.json(
          { error: 'Invalid albumId parameter', code: 'INVALID_ALBUM_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(storyMedia.albumId, albumIdNum));
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      const isFeaturedBool = isFeatured === 'true';
      conditions.push(eq(storyMedia.isFeatured, isFeaturedBool));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
    const { albumId, type, url, title, isFeatured } = body;

    // Validate required fields
    if (!albumId) {
      return NextResponse.json(
        { error: 'albumId is required', code: 'MISSING_ALBUM_ID' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: 'url is required', code: 'MISSING_URL' },
        { status: 400 }
      );
    }

    // Validate albumId is a valid integer
    const albumIdNum = parseInt(albumId);
    if (isNaN(albumIdNum)) {
      return NextResponse.json(
        { error: 'albumId must be a valid integer', code: 'INVALID_ALBUM_ID' },
        { status: 400 }
      );
    }

    // Validate type is either 'image' or 'video'
    if (type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { error: 'type must be either "image" or "video"', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    // Validate that the album exists
    const album = await db
      .select()
      .from(storyAlbums)
      .where(eq(storyAlbums.id, albumIdNum))
      .limit(1);

    if (album.length === 0) {
      return NextResponse.json(
        { error: 'Album not found', code: 'ALBUM_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare insert data with system-generated fields
    const insertData = {
      albumId: albumIdNum,
      type: type.trim(),
      url: url.trim(),
      title: title ? title.trim() : null,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      createdAt: new Date().toISOString(),
    };

    const newMedia = await db.insert(storyMedia).values(insertData).returning();

    return NextResponse.json(newMedia[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}