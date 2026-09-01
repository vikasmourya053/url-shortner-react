export type LinkType = 'link' | 'video' | 'social' | 'product';

export type VideoPlatform = 'youtube' | 'vimeo' | 'tiktok' | 'facebook' | 'twitch';

export type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'github' | 'discord' | 'telegram' | 'whatsapp';

export type LinkItem = {
  id: string;
  type: LinkType;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  iconType?: 'emoji' | 'image' | 'icon';
  order: number;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
};

export type VideoItem = LinkItem & {
  type: 'video';
  platform: VideoPlatform;
  videoId: string;
  thumbnail?: string;
  duration?: string;
};

export type SocialItem = LinkItem & {
  type: 'social';
  platform: SocialPlatform;
  username?: string;
};

export type ProductItem = LinkItem & {
  type: 'product';
  price?: number;
  currency?: string;
  image?: string;
  category?: string;
};

export type LinktreeProfile = {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  backgroundImage?: string;
  theme: 'light' | 'dark' | 'auto';
  customCss?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  totalViews: number;
  totalClicks: number;
};

export type LinktreePage = {
  profile: LinktreeProfile;
  links: LinkItem[];
  qrCode?: string;
};

export type LinktreeAnalytics = {
  profileId: string;
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{
    linkId: string;
    title: string;
    clicks: number;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
  referrers: Array<{
    source: string;
    count: number;
  }>;
  devices: Array<{
    type: string;
    count: number;
  }>;
};

export type CreateLinktreeRequest = {
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  theme?: 'light' | 'dark' | 'auto';
};

export type UpdateLinktreeRequest = Partial<CreateLinktreeRequest> & {
  backgroundImage?: string;
  customCss?: string;
  isPublic?: boolean;
};

export type CreateLinkRequest = {
  type: LinkType;
  title: string;
  description?: string;
  url: string;
  icon?: string;
  iconType?: 'emoji' | 'image' | 'icon';
  order?: number;
  isActive?: boolean;
};

export type UpdateLinkRequest = Partial<CreateLinkRequest>;

export type LinktreeResponse = {
  success: boolean;
  data?: LinktreePage;
  error?: string;
};

export type LinktreeListResponse = {
  success: boolean;
  data?: LinktreeProfile[];
  error?: string;
};

export type LinkAnalyticsResponse = {
  success: boolean;
  data?: LinktreeAnalytics;
  error?: string;
};
