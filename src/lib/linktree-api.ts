import type {
  LinktreePage,
  LinktreeProfile,
  LinkItem,
  CreateLinktreeRequest,
  UpdateLinktreeRequest,
  CreateLinkRequest,
  UpdateLinkRequest,
  LinktreeResponse,
  LinktreeListResponse,
  LinkAnalyticsResponse,
  LinktreeAnalytics
} from './linktree-types';

const API_BASE = '/api/linktree';

// Profile Management
export async function createLinktreeProfile(data: CreateLinktreeRequest): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function getLinktreeProfile(username: string): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${username}`);
  
  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function updateLinktreeProfile(username: string, data: UpdateLinktreeRequest): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${username}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function deleteLinktreeProfile(username: string): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${username}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function getAllLinktreeProfiles(): Promise<LinktreeListResponse> {
  const res = await fetch(`${API_BASE}/profile`);
  
  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

// Link Management
export async function createLink(profileId: string, data: CreateLinkRequest): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function updateLink(profileId: string, linkId: string, data: UpdateLinkRequest): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/links/${linkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function deleteLink(profileId: string, linkId: string): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/links/${linkId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

export async function reorderLinks(profileId: string, linkIds: string[]): Promise<LinktreeResponse> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/links/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkIds }),
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

// Analytics
export async function getLinktreeAnalytics(profileId: string, timeRange: '7d' | '30d' | '90d' = '30d'): Promise<LinkAnalyticsResponse> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/analytics?range=${timeRange}`);
  
  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

// QR Code
export async function generateQRCode(profileId: string): Promise<{ success: boolean; qrCode?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/profile/${profileId}/qr`, {
    method: 'POST',
  });

  if (!res.ok) {
    const error = await res.text();
    return { success: false, error };
  }

  return res.json();
}

// Track views and clicks
export async function trackView(profileId: string, linkId?: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/profile/${profileId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: linkId ? 'click' : 'view',
        linkId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
}

// Utility functions
export function extractVideoId(url: string, platform: 'youtube' | 'vimeo' | 'tiktok'): string | null {
  const patterns = {
    youtube: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ],
    vimeo: /vimeo\.com\/(?:.*#|.*\/videos\/)?(\d+)/,
    tiktok: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/
  };

  const platformPatterns = Array.isArray(patterns[platform]) 
    ? patterns[platform] 
    : [patterns[platform]];
    
  for (const pattern of platformPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📷',
    twitter: '🐦',
    facebook: '📘',
    linkedin: '💼',
    youtube: '📺',
    tiktok: '🎵',
    github: '🐙',
    discord: '💬',
    telegram: '✈️',
    whatsapp: '📱',
  };
  return icons[platform] || '🔗';
}

export function getVideoThumbnail(videoId: string, platform: 'youtube' | 'vimeo' | 'tiktok'): string {
  switch (platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    case 'vimeo':
      return `https://vumbnail.com/${videoId}.jpg`;
    case 'tiktok':
      return `https://p16-sign-va.tiktokcdn-us.com/obj/tos-useast5-p-0068-tx/placeholder.jpg`;
    default:
      return '';
  }
}
