import { PublicLinktreePage } from '@/components/linktree/PublicLinktreePage';
import { getLinktreeProfile } from '@/lib/linktree-api';
import type { Metadata } from 'next';

interface LinktreePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: LinktreePageProps): Promise<Metadata> {
  const { username } = params;
  
  try {
    const response = await getLinktreeProfile(username);
    if (response.success && response.data) {
      const { profile } = response.data;
      return {
        title: `${profile.displayName} (@${profile.username}) - Linktree`,
        description: profile.bio || `Visit ${profile.displayName}'s Linktree to discover their links and content.`,
        openGraph: {
          title: `${profile.displayName} (@${profile.username})`,
          description: profile.bio || `Visit ${profile.displayName}'s Linktree to discover their links and content.`,
          images: profile.avatar ? [profile.avatar] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${profile.displayName} (@${profile.username})`,
          description: profile.bio || `Visit ${profile.displayName}'s Linktree to discover their links and content.`,
          images: profile.avatar ? [profile.avatar] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: `@${username} - Linktree`,
    description: `Visit @${username}'s Linktree to discover their links and content.`,
  };
}

export default async function Page({ params }: LinktreePageProps) {
  const { username } = params;
  
  let initialData = null;
  
  try {
    const response = await getLinktreeProfile(username);
    if (response.success && response.data) {
      initialData = response.data;
    }
  } catch (error) {
    console.error('Error fetching Linktree data:', error);
  }

  return (
    <PublicLinktreePage 
      username={username} 
      initialData={initialData}
    />
  );
}
