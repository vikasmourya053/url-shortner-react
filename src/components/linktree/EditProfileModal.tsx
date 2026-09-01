"use client";
import { useState, useEffect } from 'react';
import type { LinktreeProfile } from '@/lib/linktree-types';

interface EditProfileModalProps {
  profile: LinktreeProfile;
  onClose: () => void;
  onSave: () => void;
}

export function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatar: '',
    backgroundImage: '',
    theme: 'auto' as const,
    customCss: '',
    isPublic: true,
  });

  useEffect(() => {
    setFormData({
      displayName: profile.displayName,
      bio: profile.bio || '',
      avatar: profile.avatar || '',
      backgroundImage: profile.backgroundImage || '',
      theme: profile.theme,
      customCss: profile.customCss || '',
      isPublic: profile.isPublic,
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName) {
      alert('Display name is required');
      return;
    }

    try {
      const response = await fetch(`/api/linktree/profile/${profile.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.text();
        alert(`Failed to update profile: ${error}`);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Name *</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter your display name"
              className="input"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell people about yourself"
              className="input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className="input"
            />
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Background Image URL</label>
            <input
              type="url"
              value={formData.backgroundImage}
              onChange={(e) => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
              placeholder="https://example.com/background.jpg"
              className="input"
            />
            {formData.backgroundImage && (
              <div className="mt-2">
                <img
                  src={formData.backgroundImage}
                  alt="Background preview"
                  className="w-full h-24 rounded object-cover border border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as any }))}
              className="input"
            >
              <option value="auto">Auto (follows system)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Custom CSS */}
          <div>
            <label className="block text-sm font-medium mb-2">Custom CSS</label>
            <textarea
              value={formData.customCss}
              onChange={(e) => setFormData(prev => ({ ...prev, customCss: e.target.value }))}
              placeholder="/* Add custom CSS styles */"
              className="input min-h-[100px] resize-none font-mono text-sm"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Advanced: Add custom CSS to style your Linktree page
            </p>
          </div>

          {/* Public Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Public (visible to everyone)
            </label>
          </div>

          {/* Preview Link */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Your Linktree URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                {typeof window !== 'undefined' ? `${window.location.origin}/linktree/${profile.username}` : ''}
              </code>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`/linktree/${profile.username}`, '_blank');
                  }
                }}
                className="text-xs btn btn-secondary"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
