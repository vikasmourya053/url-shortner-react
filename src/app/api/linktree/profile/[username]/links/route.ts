import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername, addLink, reorderLinks } from '@/lib/linktree-storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const body = await request.json();
    const { type, title, description, url, icon, iconType, order, isActive } = body;

    // Validate required fields
    if (!type || !title || !url) {
      return NextResponse.json(
        { success: false, error: 'Type, title, and URL are required' },
        { status: 400 }
      );
    }

    // Get profile to get profile ID
    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Create new link
    const newLink = addLink(profile.id, {
      type,
      title,
      description,
      url,
      icon: icon || '🔗',
      iconType: iconType || 'emoji',
      order: order || 0,
      isActive: isActive !== false,
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: { id: profile.id },
        links: [newLink],
        qrCode: null,
      },
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const body = await request.json();
    const { linkIds } = body;

    // Get profile to get profile ID
    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Reorder links
    if (linkIds && Array.isArray(linkIds)) {
      const success = reorderLinks(profile.id, linkIds);
      if (success) {
        return NextResponse.json({
          success: true,
          data: { message: 'Links reordered successfully' },
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to reorder links' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error reordering links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
