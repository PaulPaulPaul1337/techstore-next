'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result === 'ok') {
      router.push('/account');
    } else {
      setError('Невірний email або пароль');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-(--card) border border-(--border) rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-2 text-center">Вхід в акаунт</h1>
          <p className="text-center text-(--muted) text-sm mb-6">
            Немає акаунту?{' '}
            <Link href="/register" className="text-(--accent) hover:underline font-semibold">
              Зареєструватися
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors mt-2"
            >
              Увійти
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-(--border) text-xs text-(--muted) text-center space-y-1">
            <p>Для демо-доступу адміністратора:</p>
            <p className="font-mono bg-(--bg) px-3 py-1.5 rounded inline-block">
              admin@techstore.ua / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
