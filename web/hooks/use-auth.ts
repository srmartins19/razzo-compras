'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

export function useAuth(requireAuth = true) {
  const router       = useRouter();
  const pathname     = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some(r => pathname?.startsWith(r));
    if (requireAuth && !isAuthenticated && !isPublic) {
      router.replace('/auth/login');
    }
    if (!requireAuth && isAuthenticated && isPublic) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, pathname, requireAuth, router]);

  return { user, isAuthenticated };
}

export function useRequireRole(...roles: string[]) {
  const user = useAuthStore(s => s.user);
  return roles.length === 0 || (!!user && roles.includes(user.role));
}
