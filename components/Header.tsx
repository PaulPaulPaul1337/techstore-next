'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { useThemeStore } from '@/store/themeStore';
import CatalogMenu from '@/components/CatalogMenu';

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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }
  function closeMenu() { setMenuOpen(false); }
  function scheduleClose() {
    closeTimer.current = setTimeout(closeMenu, 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const totalCount = useCartStore((s) => s.totalCount());
  const wishCount = useWishlistStore((s) => s.count());
  const compareCount = useCompareStore((s) => s.count());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const openAccount = useAuthModalStore((s) => s.openAccount);
  const dark = useThemeStore((s) => s.dark);
  const toggleTheme = useThemeStore((s) => s.toggle);

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
            <button
              onClick={toggleTheme}
              title={dark ? 'Світла тема' : 'Темна тема'}
              className="w-8 h-[18px] rounded-full relative transition-colors duration-300 flex items-center shrink-0"
              style={{ background: dark ? '#c42a2c' : '#444' }}
            >
              <span
                className="absolute w-[14px] h-[14px] bg-white rounded-full shadow transition-transform duration-300"
                style={{ transform: dark ? 'translateX(17px)' : 'translateX(2px)' }}
              />
            </button>
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
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
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
              className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors relative"
            >
              <span className="text-lg leading-none relative">
                ⚖️
                <Badge count={compareCount} />
              </span>
              <span className="text-[10px] mt-0.5 text-white">Порівняння</span>
            </Link>

            <Link
              href="/wishlist"
              className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors relative"
            >
              <span className={`text-lg leading-none relative ${dark ? 'text-white' : 'text-[#111]'}`}>
                ♡
                <Badge count={wishCount} />
              </span>
              <span className="text-[10px] mt-0.5 text-white">Обране</span>
            </Link>

            {user ? (
              <button
                onClick={openAccount}
                className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">👤</span>
                <span className="text-[10px] mt-0.5 max-w-[60px] truncate text-white">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">👤</span>
                <span className="text-[10px] mt-0.5 text-white">Увійти</span>
              </button>
            )}

            <Link
              href="/cart"
              className="flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors"
            >
              <span className="text-lg leading-none relative">
                🛒
                <Badge count={totalCount} />
              </span>
              <span className="text-[10px] mt-0.5 text-white">Кошик</span>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden ml-2 text-white text-2xl"
            onClick={menuOpen ? closeMenu : openMenu}
          >
            ☰
          </button>
        </div>
      </header>

      <CatalogMenu isOpen={menuOpen} onClose={closeMenu} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} />
    </>
  );
}
