'use client';

// Providers — wraps the app to initialise client-side state on mount.
// Currently: restores the auth session from the JWT cookie.
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);

  // On first render, check if there's a valid session cookie
  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
