'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useLangStore } from '@/store/langStore';
import AuthModal from '@/components/AuthModal';
import FloatingContact from '@/components/FloatingContact';

export default function Providers({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);
  const initLang = useLangStore((s) => s.init);

  useEffect(() => {
    init();
    initTheme();
    initLang();
  }, [init, initTheme, initLang]);

  return (
    <>
      {children}
      <AuthModal />
      <FloatingContact />
    </>
  );
}
