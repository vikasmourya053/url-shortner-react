import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername, trackView } from '@/lib/linktree-storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const body = await request.json();
    const { type, linkId, timestamp, userAgent, referrer } = body;

    // Get profile to get profile ID
    const profile = getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Track the view/click
    trackView(profile.id, linkId);

    // Log the tracking event for debugging
    console.log('Tracking event:', {
      profileId: profile.id,
      linkId,
      type,
      timestamp: timestamp || new Date().toISOString(),
      userAgent,
      referrer,
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Event tracked successfully' },
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
