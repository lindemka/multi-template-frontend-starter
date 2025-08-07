import { Suspense } from 'react';
import StartupsClient from './startups-client';
import { Rocket } from 'lucide-react';

export default function StartupsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading startups...</p>
        </div>
      </div>
    }>
      <StartupsClient />
    </Suspense>
  );
}