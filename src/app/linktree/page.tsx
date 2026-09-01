import { LinktreeDashboard } from '@/components/linktree/LinktreeDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Linktree Dashboard - Manage Your Links',
  description: 'Create and manage your Linktree profile with unlimited links, video embeds, and analytics.',
};

export default function LinktreeManagementPage() {
  return <LinktreeDashboard />;
}
