"use client";
import { useState, useEffect } from 'react';
import { LinkItemComponent } from './LinkItem';
import { AddLinkModal } from './AddLinkModal';
import { EditProfileModal } from './EditProfileModal';
import { CreateProfileModal } from './CreateProfileModal';
import { AnalyticsModal } from './AnalyticsModal';
import { ShareButton } from './ShareButton';
import { getAllLinktreeProfiles, getLinktreeProfile, createLink, updateLink, deleteLink, reorderLinks } from '@/lib/linktree-api';
import type { LinktreePage, LinkItem, CreateLinkRequest } from '@/lib/linktree-types';

export function LinktreeDashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<LinktreePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await getAllLinktreeProfiles();
      if (response.success && response.data) {
        setProfiles(response.data);
        if (response.data.length > 0) {
          await selectProfile(response.data[0].username);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectProfile = async (username: string) => {
    try {
      const response = await getLinktreeProfile(username);
      if (response.success && response.data) {
        setSelectedProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleAddLink = async (linkData: CreateLinkRequest) => {
    if (!selectedProfile) return;
    
    try {
      const response = await createLink(selectedProfile.profile.username, linkData);
      if (response.success) {
        await selectProfile(selectedProfile.profile.username);
        setShowAddLink(false);
      }
    } catch (error) {
      console.error('Failed to add link:', error);
    }
  };

  const handleUpdateLink = async (linkId: string, linkData: Partial<CreateLinkRequest>) => {
    if (!selectedProfile) return;
    
    try {
      const response = await updateLink(selectedProfile.profile.username, linkId, linkData);
      if (response.success) {
        await selectProfile(selectedProfile.profile.username);
        setEditingLink(null);
      }
    } catch (error) {
      console.error('Failed to update link:', error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!selectedProfile) return;
    
    try {
      const response = await deleteLink(selectedProfile.profile.username, linkId);
      if (response.success) {
        await selectProfile(selectedProfile.profile.username);
      }
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const handleReorderLinks = async (newOrder: LinkItem[]) => {
    if (!selectedProfile) return;
    
    try {
      const linkIds = newOrder.map(link => link.id);
      const response = await reorderLinks(selectedProfile.profile.username, linkIds);
      if (response.success) {
        await selectProfile(selectedProfile.profile.username);
      }
    } catch (error) {
      console.error('Failed to reorder links:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedProfile) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-2">No Linktree profiles found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first Linktree profile to get started
        </p>
        <button
          onClick={() => setShowCreateProfile(true)}
          className="btn btn-primary"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Linktree Dashboard</h1>
          <p className="text-muted-foreground">Manage your Linktree profiles and links</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAnalytics(true)}
            className="btn btn-secondary"
          >
            Analytics
          </button>
          <button
            onClick={() => setShowEditProfile(true)}
            className="btn btn-secondary"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowAddLink(true)}
            className="btn btn-primary"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Profile Selector */}
      {profiles.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Profile</label>
          <select
            value={selectedProfile.profile.username}
            onChange={(e) => selectProfile(e.target.value)}
            className="input max-w-xs"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.username}>
                {profile.displayName} (@{profile.username})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Profile Preview */}
      <div className="card-elevated p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          {selectedProfile.profile.avatar && (
            <img
              src={selectedProfile.profile.avatar}
              alt={selectedProfile.profile.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{selectedProfile.profile.displayName}</h2>
            <p className="text-muted-foreground">@{selectedProfile.profile.username}</p>
            {selectedProfile.profile.bio && (
              <p className="text-sm mt-1">{selectedProfile.profile.bio}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          <span>{selectedProfile.profile.totalViews} views</span>
          <span>{selectedProfile.profile.totalClicks} clicks</span>
          <span>{selectedProfile.links.length} links</span>
        </div>
        
        <div className="flex gap-3">
          <ShareButton 
            username={selectedProfile.profile.username}
            displayName={selectedProfile.profile.displayName}
            className="flex-1"
          />
          <a
            href={`/linktree/${selectedProfile.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Preview
          </a>
        </div>
      </div>

      {/* Links Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Links</h3>
          <span className="text-sm text-muted-foreground">
            {selectedProfile.links.length} links
          </span>
        </div>

        {selectedProfile.links.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <div className="text-4xl mb-2">🔗</div>
            <p className="text-muted-foreground mb-4">No links yet</p>
            <button
              onClick={() => setShowAddLink(true)}
              className="btn btn-primary"
            >
              Add your first link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProfile.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <div key={link.id} className="card p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{link.icon || '🔗'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{link.title}</h4>
                      {link.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {link.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {link.clickCount} clicks
                      </span>
                      <button
                        onClick={() => setEditingLink(link)}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddLink && (
        <AddLinkModal
          onClose={() => setShowAddLink(false)}
          onAdd={handleAddLink}
        />
      )}

      {editingLink && (
        <AddLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onAdd={(data) => handleUpdateLink(editingLink.id, data)}
        />
      )}

      {showCreateProfile && (
        <>
          <div className="fixed inset-0 bg-red-500 z-40 flex items-center justify-center">
            <div className="text-white text-2xl">Modal should be here!</div>
          </div>
          <CreateProfileModal
            onClose={() => setShowCreateProfile(false)}
            onSuccess={() => {
              setShowCreateProfile(false);
              fetchProfiles();
            }}
          />
        </>
      )}

      {showEditProfile && selectedProfile && (
        <EditProfileModal
          profile={selectedProfile.profile}
          onClose={() => setShowEditProfile(false)}
          onSave={() => {
            setShowEditProfile(false);
            selectProfile(selectedProfile.profile.username);
          }}
        />
      )}

      {showAnalytics && selectedProfile && (
        <AnalyticsModal
          profileId={selectedProfile.profile.username}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
}
