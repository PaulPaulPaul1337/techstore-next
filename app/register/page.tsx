'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const openRegister = useAuthModalStore((s) => s.openRegister);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace('/account');
    } else {
      router.replace('/');
      openRegister();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
