'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Пароль повинен містити не менше 6 символів');
      return;
    }
    const result = await register(name, email, password);
    if (result === 'ok') {
      router.push('/account');
    } else {
      setError('Акаунт з таким email вже існує');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-(--card) border border-(--border) rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-2 text-center">Реєстрація</h1>
          <p className="text-center text-(--muted) text-sm mb-6">
            Вже є акаунт?{' '}
            <Link href="/login" className="text-(--accent) hover:underline font-semibold">
              Увійти
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Ім&apos;я</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Іван Петренко"
                required
                className="w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
              />
            </div>

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
                placeholder="Мінімум 6 символів"
                required
                className="w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors mt-2"
            >
              Зареєструватися
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
