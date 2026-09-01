import { NextRequest, NextResponse } from 'next/server';
import { getAllProfiles, createProfile, getProfileByUsername } from '@/lib/linktree-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, displayName, bio, avatar, theme } = body;

    // Validate required fields
    if (!username || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Username and display name are required' },
        { status: 400 }
      );
    }

    // Check if username is available
    const existingProfile = getProfileByUsername(username);
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create new profile
    const newProfile = createProfile({
      username,
      displayName,
      bio,
      avatar,
      backgroundImage: null,
      theme: theme || 'auto',
      customCss: null,
      isPublic: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: newProfile,
        links: [],
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/linktree/${username}`)}`,
      },
    });
  } catch (error) {
    console.error('Error creating Linktree profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const profiles = getAllProfiles();
    return NextResponse.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error('Error fetching Linktree profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
