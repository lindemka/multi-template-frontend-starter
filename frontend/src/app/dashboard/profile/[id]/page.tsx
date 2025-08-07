import ProfileView from './profile-view';

// Dynamic route - will be handled by SPA routing

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProfileView profileId={resolvedParams.id} />;
}