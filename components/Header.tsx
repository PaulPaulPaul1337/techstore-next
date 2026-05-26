'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useAuthStore } from '@/store/authStore';
import { categoryLabels, categoryEmojis, Category } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-(--accent) text-white text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const totalCount = useCartStore((s) => s.totalCount());
  const wishCount = useWishlistStore((s) => s.count());
  const compareCount = useCompareStore((s) => s.count());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#1c1c1c] text-[#999] text-xs py-2 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/delivery" className="hover:text-white transition-colors">Доставка і оплата</Link>
            <Link href="/warranty" className="hover:text-white transition-colors">Гарантія і повернення</Link>
            <Link href="/contacts" className="hover:text-white transition-colors">Сервісний центр</Link>
            <Link href="/catalog?badge=sale" className="hover:text-white transition-colors">Акції</Link>
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-white font-medium">0 800 000 000</span>
            <span>м. Київ</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-[#111111] shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 h-[64px] flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="text-[22px] font-bold whitespace-nowrap tracking-tight text-white mr-1">
            Tech<span className="text-(--accent)">Store</span>
          </Link>

          {/* Catalog button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden md:flex items-center gap-2 bg-(--accent) text-white px-5 h-10 text-sm font-bold whitespace-nowrap hover:bg-(--accent-hover) transition-colors rounded"
          >
            ☰ Каталог
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук товарів, брендів..."
              className="flex-1 h-10 bg-white text-[#111] text-sm px-4 rounded-l outline-none placeholder:text-[#aaa]"
            />
            <button
              type="submit"
              className="w-12 h-10 flex items-center justify-center bg-(--accent) text-white rounded-r hover:bg-(--accent-hover) transition-colors text-base"
            >
              🔍
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            <Link
              href="/compare"
              className="hidden md:flex flex-col items-center px-3 py-1 text-[#aaa] hover:text-white transition-colors relative"
            >
              <span className="text-lg leading-none relative">
                ⚖️
                <Badge count={compareCount} />
              </span>
              <span className="text-[10px] mt-0.5">Порівняння</span>
            </Link>

            <Link
              href="/wishlist"
              className="hidden md:flex flex-col items-center px-3 py-1 text-[#aaa] hover:text-white transition-colors relative"
            >
              <span className="text-lg leading-none relative">
                ♡
                <Badge count={wishCount} />
              </span>
              <span className="text-[10px] mt-0.5">Обране</span>
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href={user.isAdmin ? '/admin' : '/account'}
                  className="flex flex-col items-center px-3 py-1 text-[#aaa] hover:text-white transition-colors"
                >
                  <span className="text-lg leading-none">👤</span>
                  <span className="text-[10px] mt-0.5 max-w-[60px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] text-[#666] hover:text-[#aaa] transition-colors px-1"
                  title="Вийти"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex flex-col items-center px-3 py-1 text-[#aaa] hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">👤</span>
                <span className="text-[10px] mt-0.5">Увійти</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="flex flex-col items-center px-3 py-1 text-[#aaa] hover:text-white transition-colors"
            >
              <span className="text-lg leading-none relative">
                🛒
                <Badge count={totalCount} />
              </span>
              <span className="text-[10px] mt-0.5">Кошик</span>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden ml-2 text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Catalog / mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[15px] font-bold px-5 py-4 border-b border-[#eee] text-[#111]">
              Каталог товарів
            </div>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/catalog?category=${cat}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-5 py-3 text-[#333] hover:bg-[#f5f5f5] hover:text-[--accent] transition-colors border-b border-[#f0f0f0] text-[14px] font-medium"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{categoryEmojis[cat]}</span>
                  {categoryLabels[cat]}
                </span>
                <span className="text-[#ccc] text-lg">›</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
