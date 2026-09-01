"use client";
import { useEffect, useState } from 'react';
import { LinkItemComponent } from './LinkItem';
import { QRCodeModal } from './QRCodeModal';
import { trackView } from '@/lib/linktree-api';
import type { LinktreePage as LinktreePageType, LinkItem } from '@/lib/linktree-types';

interface LinktreePageProps {
  username: string;
  initialData?: LinktreePageType;
}

export function LinktreePage({ username, initialData }: LinktreePageProps) {
  const [data, setData] = useState<LinktreePageType | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (!initialData) {
      fetchLinktreeData();
    }
    
    // Track page view
    if (data?.profile.username) {
      trackView(data.profile.username);
    }
  }, [username, initialData]);

  const fetchLinktreeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/linktree/profile/${username}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load Linktree');
      }
    } catch (err) {
      setError('Failed to load Linktree');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Linktree...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Linktree not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'This Linktree profile does not exist'}
          </p>
        </div>
      </div>
    );
  }

  const { profile, links } = data;
  const activeLinks = links.filter(link => link.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className={`min-h-screen transition-colors ${
      profile.theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : profile.theme === 'light' 
        ? 'bg-white text-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white'
    }`}>
      {/* Custom CSS */}
      {profile.customCss && (
        <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
      )}
      
      {/* Background Image */}
      {profile.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${profile.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {profile.avatar && (
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={profile.avatar} 
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-2xl font-bold mb-2">
              {profile.displayName}
            </h1>
            
            {profile.bio && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {profile.bio}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span>{profile.totalViews} views</span>
              <span>{profile.totalClicks} clicks</span>
            </div>
            
            {/* QR Code Button */}
            <button
              onClick={() => setShowQRCode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-4v4m-6-4h.01M12 16h.01M16 20h4M4 4h4m0 0v4m0-4v4m0 0h4m-4 0v4m0-4v4m0 0h4m-4 0v4" />
              </svg>
              QR Code
            </button>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            {activeLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🔗</div>
                <p>No links available yet</p>
              </div>
            ) : (
              activeLinks.map((link) => (
                <LinkItemComponent
                  key={link.id}
                  link={link}
                  profileId={profile.username}
                  theme={profile.theme}
                />
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>Powered by Linktree</p>
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRCode && data.qrCode && (
        <QRCodeModal
          qrCode={data.qrCode}
          username={username}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
}
