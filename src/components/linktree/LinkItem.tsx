"use client";
import { useState } from 'react';
import type { LinkItem, VideoItem, SocialItem, ProductItem } from '@/lib/linktree-types';
import { trackView } from '@/lib/linktree-api';

interface LinkItemProps {
  link: LinkItem | VideoItem | SocialItem | ProductItem;
  profileId: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function LinkItemComponent({ link, profileId, theme = 'auto' }: LinkItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    // Track the click
    await trackView(profileId, link.id);
    
    // Open the link
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = () => {
    if (link.iconType === 'image' && link.icon) {
      return (
        <img 
          src={link.icon} 
          alt={link.title}
          className="w-6 h-6 rounded object-cover"
        />
      );
    }
    
    return (
      <span className="text-2xl">
        {link.icon || '🔗'}
      </span>
    );
  };

  const renderVideoThumbnail = () => {
    if (link.type === 'video') {
      const videoLink = link as VideoItem;
      return (
        <div className="relative group">
          <img
            src={videoLink.thumbnail || `https://img.youtube.com/vi/${videoLink.videoId}/maxresdefault.jpg`}
            alt={link.title}
            className="w-full h-32 object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg group-hover:bg-opacity-60 transition-all">
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getThemeClasses = () => {
    const baseClasses = "w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group";
    
    if (theme === 'dark') {
      return `${baseClasses} bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750 text-white`;
    }
    
    if (theme === 'light') {
      return `${baseClasses} bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900`;
    }
    
    // Auto theme - use system preference
    return `${baseClasses} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white`;
  };

  return (
    <div
      className={getThemeClasses()}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {link.type === 'video' && renderVideoThumbnail()}
      
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">
            {link.title}
          </h3>
          {link.description && (
            <p className="text-sm opacity-75 truncate mt-1">
              {link.description}
            </p>
          )}
          
          {link.type === 'product' && (link as ProductItem).price && (
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
              ${(link as ProductItem).price}
              {(link as ProductItem).currency && ` ${(link as ProductItem).currency}`}
            </div>
          )}
          
          {link.type === 'social' && (link as SocialItem).username && (
            <div className="text-sm opacity-60 mt-1">
              @{(link as SocialItem).username}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <svg 
            className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
      
      {link.clickCount > 0 && (
        <div className="text-xs opacity-50 mt-2">
          {link.clickCount} clicks
        </div>
      )}
    </div>
  );
}
