import ProfilePageClient from './profile-client';
import { mockFoundersData } from '@/data/mockMembers';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProfilePageClient params={resolvedParams} />;
}

export async function generateStaticParams() {
  // Generate paths for the mock users
  return mockFoundersData.map((user) => ({
    id: user.id.toString(),
  }));
}