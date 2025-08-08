"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        // Ask our BFF using httpOnly cookies server-side
        let res = await fetch('/api/account/me', { method: 'GET', cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          // Attempt silent refresh, then retry once
          const refresh = await fetch('/api/auth/refresh', { method: 'POST', cache: 'no-store' });
          if (cancelled) return;
          if (refresh.ok) {
            res = await fetch('/api/account/me', { method: 'GET', cache: 'no-store' });
          }
        }
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
          router.push(loginUrl);
        }
      } catch {
        const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}