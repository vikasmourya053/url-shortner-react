import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Mock analytics data
    const analytics = {
      profileId: `profile_${username}`,
      totalViews: Math.floor(Math.random() * 5000) + 1000,
      totalClicks: Math.floor(Math.random() * 1500) + 200,
      uniqueVisitors: Math.floor(Math.random() * 800) + 100,
      topLinks: [
        {
          linkId: 'link_1',
          title: 'My Website',
          clicks: Math.floor(Math.random() * 200) + 50,
        },
        {
          linkId: 'link_2',
          title: 'Follow me on Twitter',
          clicks: Math.floor(Math.random() * 150) + 30,
        },
        {
          linkId: 'link_3',
          title: 'My Latest Video',
          clicks: Math.floor(Math.random() * 300) + 100,
        },
      ],
      viewsByDay: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 20) + 5,
      })),
      referrers: [
        { source: 'Direct', count: Math.floor(Math.random() * 100) + 50 },
        { source: 'Instagram', count: Math.floor(Math.random() * 80) + 30 },
        { source: 'Twitter', count: Math.floor(Math.random() * 60) + 20 },
        { source: 'Facebook', count: Math.floor(Math.random() * 40) + 10 },
        { source: 'Other', count: Math.floor(Math.random() * 30) + 5 },
      ],
      devices: [
        { type: 'Mobile', count: Math.floor(Math.random() * 300) + 200 },
        { type: 'Desktop', count: Math.floor(Math.random() * 200) + 100 },
        { type: 'Tablet', count: Math.floor(Math.random() * 50) + 20 },
      ],
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
