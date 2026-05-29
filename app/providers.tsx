'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import AuthModal from '@/components/AuthModal';
import FloatingContact from '@/components/FloatingContact';

export default function Providers({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    init();
    initTheme();
  }, [init, initTheme]);

  return (
    <>
      {children}
      <AuthModal />
      <FloatingContact />
    </>
  );
}
