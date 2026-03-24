'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { categoryLabels, categoryEmojis, Category } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const totalCount = useCartStore((s) => s.totalCount());

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
      <div className="hidden md:block bg-[#f2f2f2] text-[#333] text-xs py-1.5">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-5">
            <Link href="#" className="hover:text-[--accent] transition-colors">Доставка і оплата</Link>
            <Link href="#" className="hover:text-[--accent] transition-colors">Гарантія і повернення</Link>
            <Link href="#" className="hover:text-[--accent] transition-colors">Сервісний центр</Link>
          </div>
          <div className="flex gap-5">
            <span>м. Київ</span>
            <Link href="#" className="hover:text-[--accent] transition-colors">Відстежити замовлення</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-[--bg] border-b border-[--border]">
        <div className="max-w-[1440px] mx-auto px-4 h-[60px] flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold whitespace-nowrap tracking-tight">
            Tech<span className="text-[--accent]">Store</span>
          </Link>

          {/* Catalog button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden md:flex items-center gap-2 bg-[--accent] text-white px-5 h-9 text-sm font-bold whitespace-nowrap hover:bg-[--accent-hover] transition-colors"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          >
            ☰ Каталог
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук товарів..."
              className="w-full h-9 bg-[--card] border border-[--border] text-[--text] text-sm px-3 pr-10 rounded focus:border-[--muted] outline-none transition-colors placeholder:text-[--muted]"
            />
            <button type="submit" className="absolute right-0 top-0 w-10 h-9 flex items-center justify-center text-[--muted] hover:text-[--text] transition-colors">
              🔍
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button className="hidden md:flex items-center px-3 py-2 text-[--muted] hover:text-[--text] hover:bg-[--card] rounded transition-all text-lg">
              ⚖️
            </button>
            <button className="hidden md:flex items-center px-3 py-2 text-[--muted] hover:text-[--text] hover:bg-[--card] rounded transition-all text-lg">
              ♡
            </button>
            <Link
              href="/cart"
              className="relative flex items-center px-3 py-2 text-[--muted] hover:text-[--text] hover:bg-[--card] rounded transition-all text-lg"
            >
              🛒
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-[--accent] text-white text-[10px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center leading-none">
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden ml-2 text-[--text] text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

      </header>

      {/* Subnav */}
      <div className="hidden md:block bg-[--card] border-b border-[--border]">
        <div className="max-w-[1440px] mx-auto px-4 flex gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/catalog?category=${cat}`}
              className="block px-3 py-2.5 text-[13px] font-semibold text-[--muted] hover:text-[--text] transition-colors whitespace-nowrap"
            >
              {categoryEmojis[cat]} {categoryLabels[cat]}
            </Link>
          ))}
          <Link
            href="/catalog?badge=sale"
            className="block px-3 py-2.5 text-[13px] font-semibold text-[--accent] hover:opacity-80 transition-opacity whitespace-nowrap ml-auto"
          >
            🔥 Акції
          </Link>
        </div>
      </div>

      {/* Mobile / catalog dropdown overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-[--card] p-6 flex flex-col gap-2 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-bold mb-4 text-[--text]">Каталог</div>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/catalog?category=${cat}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded text-[--muted] hover:bg-[--bg] hover:text-[--text] transition-all text-[15px] font-medium"
              >
                <span className="text-xl w-7 text-center">{categoryEmojis[cat]}</span>
                {categoryLabels[cat]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
