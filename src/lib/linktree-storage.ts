// Simple in-memory storage for Linktree profiles
// In a real app, this would be replaced with a database

import type { LinktreeProfile, LinkItem } from './linktree-types';

// In-memory storage
let profiles: LinktreeProfile[] = [];

let links: Record<string, LinkItem[]> = {};

export function getAllProfiles(): LinktreeProfile[] {
  return [...profiles];
}

export function getProfileByUsername(username: string): LinktreeProfile | null {
  return profiles.find(p => p.username === username) || null;
}

export function createProfile(profileData: Omit<LinktreeProfile, 'id' | 'createdAt' | 'updatedAt' | 'totalViews' | 'totalClicks'>): LinktreeProfile {
  const newProfile: LinktreeProfile = {
    ...profileData,
    id: `profile_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalViews: 0,
    totalClicks: 0,
  };
  
  profiles.push(newProfile);
  links[newProfile.id] = [];
  
  return newProfile;
}

export function updateProfile(username: string, updates: Partial<LinktreeProfile>): LinktreeProfile | null {
  const profileIndex = profiles.findIndex(p => p.username === username);
  if (profileIndex === -1) return null;
  
  profiles[profileIndex] = {
    ...profiles[profileIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return profiles[profileIndex];
}

export function deleteProfile(username: string): boolean {
  const profileIndex = profiles.findIndex(p => p.username === username);
  if (profileIndex === -1) return false;
  
  const profile = profiles[profileIndex];
  delete links[profile.id];
  profiles.splice(profileIndex, 1);
  
  return true;
}

export function getProfileLinks(profileId: string): LinkItem[] {
  return links[profileId] || [];
}

export function addLink(profileId: string, linkData: Omit<LinkItem, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>): LinkItem {
  const newLink: LinkItem = {
    ...linkData,
    id: `link_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clickCount: 0,
  };
  
  if (!links[profileId]) {
    links[profileId] = [];
  }
  
  links[profileId].push(newLink);
  return newLink;
}

export function updateLink(profileId: string, linkId: string, updates: Partial<LinkItem>): LinkItem | null {
  if (!links[profileId]) return null;
  
  const linkIndex = links[profileId].findIndex(l => l.id === linkId);
  if (linkIndex === -1) return null;
  
  links[profileId][linkIndex] = {
    ...links[profileId][linkIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return links[profileId][linkIndex];
}

export function deleteLink(profileId: string, linkId: string): boolean {
  if (!links[profileId]) return false;
  
  const linkIndex = links[profileId].findIndex(l => l.id === linkId);
  if (linkIndex === -1) return false;
  
  links[profileId].splice(linkIndex, 1);
  return true;
}

export function reorderLinks(profileId: string, linkIds: string[]): boolean {
  if (!links[profileId]) return false;
  
  const reorderedLinks: LinkItem[] = [];
  for (const linkId of linkIds) {
    const link = links[profileId].find(l => l.id === linkId);
    if (link) {
      reorderedLinks.push({ ...link, order: reorderedLinks.length });
    }
  }
  
  links[profileId] = reorderedLinks;
  return true;
}

export function trackView(profileId: string, linkId?: string): void {
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    profile.totalViews++;
    profile.updatedAt = new Date().toISOString();
  }
  
  if (linkId && links[profileId]) {
    const link = links[profileId].find(l => l.id === linkId);
    if (link) {
      link.clickCount++;
      link.updatedAt = new Date().toISOString();
    }
  }
}
