import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername, updateLink, deleteLink } from '@/lib/linktree-storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: { username: string; linkId: string } }
) {
  try {
    const { username, linkId } = params;
    const body = await request.json();

    // Get profile to get profile ID
    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const updatedLink = updateLink(profile.id, linkId, body);
    if (!updatedLink) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: { id: profile.id },
        links: [updatedLink],
        qrCode: null,
      },
    });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string; linkId: string } }
) {
  try {
    const { username, linkId } = params;

    // Get profile to get profile ID
    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const deleted = deleteLink(profile.id, linkId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Link deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
