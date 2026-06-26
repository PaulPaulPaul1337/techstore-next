'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { useThemeStore } from '@/store/themeStore';
import { useLangStore, type Lang } from '@/store/langStore';
import { useT } from '@/hooks/useT';
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
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
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
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(id: string) {
    setQuery('');
    setShowSuggestions(false);
    router.push(`/product/${id}`);
  }

  // Debounced live search suggestions
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`)
        .then((r) => r.json())
        .then((data: Product[]) => setSuggestions(Array.isArray(data) ? data : []))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#1c1c1c] text-[#999] text-xs py-2 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/delivery" className="hover:text-white transition-colors">{t.delivery}</Link>
            <Link href="/warranty" className="hover:text-white transition-colors">{t.warranty}</Link>
            <Link href="/contacts" className="hover:text-white transition-colors">{t.service}</Link>
            <Link href="/catalog?badge=sale" className="hover:text-white transition-colors">{t.sales}</Link>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-white font-medium">0 800 000 000</span>
            <span>м. Київ</span>
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 bg-[#2a2a2a] rounded-md p-0.5">
              {(['uk', 'ru', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold uppercase transition-colors"
                  style={{
                    background: lang === l ? '#c42a2c' : 'transparent',
                    color: lang === l ? '#fff' : '#999',
                  }}
                >
                  {l === 'uk' ? 'UA' : l === 'ru' ? 'RU' : 'EN'}
                </button>
              ))}
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={dark ? t.lightTheme : t.darkTheme}
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
            ☰ {t.catalog}
          </button>

          {/* Search */}
          <div ref={searchBoxRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t.searchPlaceholder}
                autoComplete="off"
                className="flex-1 h-10 bg-white text-[#111] text-sm px-4 rounded-l outline-none placeholder:text-[#aaa]"
              />
              <button
                type="submit"
                className="w-12 h-10 flex items-center justify-center bg-(--accent) text-white rounded-r hover:bg-(--accent-hover) transition-colors text-base"
              >
                🔍
              </button>
            </form>

            {/* Live suggestions dropdown */}
            {showSuggestions && query.trim().length >= 2 && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-(--card) border border-(--border) rounded-lg shadow-xl overflow-hidden z-[70]">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSuggestionClick(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-(--bg) transition-colors border-b border-(--border) last:border-b-0"
                  >
                    <span className="relative text-2xl w-9 h-9 flex items-center justify-center bg-(--bg) rounded-md shrink-0 overflow-hidden">
                      {p.image ? (
                        <Image src={p.image} alt={p.name} fill sizes="36px" className="object-contain p-1" />
                      ) : (
                        p.emoji
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-(--text) truncate">{p.name}</span>
                      <span className="block text-xs text-(--muted)">{p.brand}</span>
                    </span>
                    <span className="text-sm font-bold text-(--text) shrink-0">{p.price.toLocaleString('uk-UA')} ₴</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full px-3 py-2 text-center text-sm font-semibold text-(--accent) hover:bg-(--bg) transition-colors"
                >
                  {t.allResults(query.trim())}
                </button>
              </div>
            )}
          </div>

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
              <span className="text-[10px] mt-0.5 text-white">{t.compare}</span>
            </Link>

            <Link
              href="/wishlist"
              className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors relative"
            >
              <span className={`text-lg leading-none relative ${dark ? 'text-white' : 'text-[#111]'}`}>
                ♡
                <Badge count={wishCount} />
              </span>
              <span className="text-[10px] mt-0.5 text-white">{t.wishlist}</span>
            </Link>

            {user ? (
              <button
                onClick={openAccount}
                className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">👤</span>
                <span className="text-[10px] mt-0.5 max-w-[60px] truncate text-white">{user.name.split(' ')[0] || t.login}</span>
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="hidden md:flex flex-col items-center px-3 py-1 text-white hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">👤</span>
                <span className="text-[10px] mt-0.5 text-white">{t.login}</span>
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
              <span className="text-[10px] mt-0.5 text-white">{t.cart}</span>
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
