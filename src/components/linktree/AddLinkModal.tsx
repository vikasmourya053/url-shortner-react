"use client";
import { useState, useEffect } from 'react';
import type { LinkItem, CreateLinkRequest, VideoPlatform, SocialPlatform } from '@/lib/linktree-types';
import { extractVideoId, getSocialIcon } from '@/lib/linktree-api';

interface AddLinkModalProps {
  link?: LinkItem;
  onClose: () => void;
  onAdd: (data: CreateLinkRequest) => void;
}

export function AddLinkModal({ link, onClose, onAdd }: AddLinkModalProps) {
  const [formData, setFormData] = useState({
    type: 'link' as const,
    title: '',
    description: '',
    url: '',
    icon: '',
    iconType: 'emoji' as const,
    isActive: true,
  });

  const [videoPlatform, setVideoPlatform] = useState<VideoPlatform>('youtube');
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('instagram');

  useEffect(() => {
    if (link) {
      setFormData({
        type: link.type,
        title: link.title,
        description: link.description || '',
        url: link.url,
        icon: link.icon || '',
        iconType: link.iconType || 'emoji',
        isActive: link.isActive,
      });
    }
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      alert('Title and URL are required');
      return;
    }

    // Auto-generate icon for social links
    if (formData.type === 'social' && !formData.icon) {
      formData.icon = getSocialIcon(socialPlatform);
    }

    // Extract video ID for video links
    if (formData.type === 'video') {
      const videoId = extractVideoId(formData.url, videoPlatform);
      if (!videoId) {
        alert('Invalid video URL for the selected platform');
        return;
      }
    }

    onAdd(formData);
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    
    // Auto-detect video platform and extract video ID
    if (formData.type === 'video') {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        setVideoPlatform('youtube');
        const videoId = extractVideoId(url, 'youtube');
        if (videoId && !formData.title) {
          setFormData(prev => ({ ...prev, title: 'YouTube Video' }));
        }
      } else if (url.includes('vimeo.com')) {
        setVideoPlatform('vimeo');
        const videoId = extractVideoId(url, 'vimeo');
        if (videoId && !formData.title) {
          setFormData(prev => ({ ...prev, title: 'Vimeo Video' }));
        }
      } else if (url.includes('tiktok.com')) {
        setVideoPlatform('tiktok');
        const videoId = extractVideoId(url, 'tiktok');
        if (videoId && !formData.title) {
          setFormData(prev => ({ ...prev, title: 'TikTok Video' }));
        }
      }
    }
  };

  const getPlaceholderUrl = () => {
    switch (formData.type) {
      case 'video':
        switch (videoPlatform) {
          case 'youtube': return 'https://youtube.com/watch?v=...';
          case 'vimeo': return 'https://vimeo.com/...';
          case 'tiktok': return 'https://tiktok.com/@username/video/...';
          default: return 'https://...';
        }
      case 'social':
        switch (socialPlatform) {
          case 'instagram': return 'https://instagram.com/username';
          case 'twitter': return 'https://twitter.com/username';
          case 'facebook': return 'https://facebook.com/username';
          default: return 'https://...';
        }
      default:
        return 'https://example.com';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {link ? 'Edit Link' : 'Add New Link'}
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
          {/* Link Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Link Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="input"
            >
              <option value="link">Regular Link</option>
              <option value="video">Video</option>
              <option value="social">Social Media</option>
              <option value="product">Product</option>
            </select>
          </div>

          {/* Platform Selection for Video/Social */}
          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium mb-2">Video Platform</label>
              <select
                value={videoPlatform}
                onChange={(e) => setVideoPlatform(e.target.value as VideoPlatform)}
                className="input"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="twitch">Twitch</option>
              </select>
            </div>
          )}

          {formData.type === 'social' && (
            <div>
              <label className="block text-sm font-medium mb-2">Social Platform</label>
              <select
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value as SocialPlatform)}
                className="input"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="github">GitHub</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter link title"
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter link description"
              className="input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2">URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={getPlaceholderUrl()}
              className="input"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex gap-2">
              <select
                value={formData.iconType}
                onChange={(e) => setFormData(prev => ({ ...prev, iconType: e.target.value as any }))}
                className="input flex-shrink-0 w-24"
              >
                <option value="emoji">Emoji</option>
                <option value="image">Image</option>
                <option value="icon">Icon</option>
              </select>
              <input
                type={formData.iconType === 'image' ? 'url' : 'text'}
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder={formData.iconType === 'emoji' ? '🔗' : 'Enter icon URL or text'}
                className="input flex-1"
              />
            </div>
            {formData.iconType === 'emoji' && (
              <p className="text-xs text-muted-foreground mt-1">
                Popular: 🔗 🌐 📺 🐦 📷 💼 🎵 📱 ✈️ 💬
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active (visible on your Linktree)
            </label>
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
              {link ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
