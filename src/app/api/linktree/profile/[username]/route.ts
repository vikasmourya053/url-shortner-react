import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername, getProfileLinks, updateProfile, deleteProfile } from '@/lib/linktree-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const links = getProfileLinks(profile.id);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        links,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/linktree/${username}`)}`,
      },
    });
  } catch (error) {
    console.error('Error fetching Linktree profile:', error);
    return NextResponse.json(
      { success: false, error: 'Profile not found' },
      { status: 404 }
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

    const updatedProfile = updateProfile(username, body);
    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const links = getProfileLinks(updatedProfile.id);

    return NextResponse.json({
      success: true,
      data: {
        profile: updatedProfile,
        links,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/linktree/${username}`)}`,
      },
    });
  } catch (error) {
    console.error('Error updating Linktree profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    const deleted = deleteProfile(username);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Profile deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting Linktree profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
