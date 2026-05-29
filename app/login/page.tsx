'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace('/account');
    } else {
      router.replace('/');
      openLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
