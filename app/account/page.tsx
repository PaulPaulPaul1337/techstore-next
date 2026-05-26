'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.totalCount());
  const cartTotal = useCartStore((s) => s.totalPrice());
  const wishCount = useWishlistStore((s) => s.count());
  const compareCount = useCompareStore((s) => s.count());

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-(--muted)">Завантаження...</div>
  );
  if (!user) return null;

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Мій акаунт</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="bg-(--card) border border-(--border) rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-(--bg) rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                👤
              </div>
              <div className="font-bold text-lg">{user.name}</div>
              <div className="text-(--muted) text-sm">{user.email}</div>
              {user.isAdmin && (
                <span className="inline-block mt-2 bg-(--accent) text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Адміністратор
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full h-9 border border-(--border) rounded-lg text-sm text-(--muted) hover:text-(--accent) hover:border-(--accent) transition-colors font-semibold"
            >
              Вийти з акаунту
            </button>
          </div>
        </div>

        {/* Stats + links */}
        <div className="md:col-span-2 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Кошик', value: cartCount, sub: `${cartTotal.toLocaleString('uk-UA')} ₴`, href: '/cart', icon: '🛒' },
              { label: 'Обране', value: wishCount, sub: 'товарів', href: '/wishlist', icon: '♡' },
              { label: 'Порівняння', value: compareCount, sub: 'товарів', href: '/compare', icon: '⚖️' },
            ].map(({ label, value, sub, href, icon }) => (
              <Link
                key={label}
                href={href}
                className="bg-(--card) border border-(--border) rounded-xl p-4 text-center hover:border-(--accent) hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-[12px] text-(--muted)">{label}</div>
                <div className="text-[11px] text-(--muted)">{sub}</div>
              </Link>
            ))}
          </div>

          {/* Menu items */}
          <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
            {[
              { label: '🛒 Кошик', href: '/cart' },
              { label: '♡ Список обраного', href: '/wishlist' },
              { label: '⚖️ Порівняння товарів', href: '/compare' },
              { label: '📦 Каталог товарів', href: '/catalog' },
              ...(user.isAdmin ? [{ label: '⚙️ Панель адміністратора', href: '/admin' }] : []),
            ].map(({ label, href }, idx, arr) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-5 py-3.5 text-[14px] font-medium hover:bg-(--bg) transition-colors ${
                  idx < arr.length - 1 ? 'border-b border-(--border)' : ''
                }`}
              >
                {label}
                <span className="text-(--muted)">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
