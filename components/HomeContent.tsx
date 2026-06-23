'use client';

import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import { categoryEmojis, Category } from '@/data/products';
import type { Product } from '@/data/products';
import { getCategoryLabels } from '@/lib/i18n';
import { useT } from '@/hooks/useT';

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Xiaomi', 'Lenovo', 'ASUS', 'Dell'];

export default function HomeContent({ featured, hits }: { featured: Product[]; hits: Product[] }) {
  const t = useT();
  const catLabels = getCategoryLabels(t);
  const categories = Object.keys(catLabels) as Category[];

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-5">
      <div className="flex gap-4">

        {/* Left sidebar — categories */}
        <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0">
          <div className="bg-(--card) border border-(--border) rounded-md overflow-hidden">
            {categories.map((cat, idx) => (
              <Link
                key={cat}
                href={`/catalog?category=${cat}`}
                className={`flex items-center justify-between px-4 py-[11px] text-[13px] font-medium text-(--text) hover:bg-(--accent) hover:text-white transition-colors group ${
                  idx < categories.length - 1 ? 'border-b border-(--border)' : ''
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base w-5 text-center">{categoryEmojis[cat]}</span>
                  {catLabels[cat]}
                </span>
                <span className="text-(--border) group-hover:text-white/70 text-lg leading-none">›</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">

          <HeroSlider />

          {/* Brands */}
          <div className="bg-(--card) border border-(--border) rounded-md px-6 py-4">
            <div className="flex items-center justify-around gap-2 overflow-x-auto">
              {brands.map((brand) => (
                <Link key={brand} href={`/catalog?q=${brand}`} className="text-[14px] font-bold text-(--muted) hover:text-(--accent) transition-colors whitespace-nowrap px-2 py-1">
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured products */}
          {featured.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold">{t.popularProducts}</h2>
                <Link href="/catalog" className="text-(--muted) text-sm hover:text-(--accent) transition-colors">{t.viewAllProducts}</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Hits */}
          {hits.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold">{t.hitsSection}</h2>
                <Link href="/catalog?badge=hit" className="text-(--muted) text-sm hover:text-(--accent) transition-colors">{t.viewAllHits}</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Recently viewed */}
          <RecentlyViewed limit={10} className="" />

          {featured.length === 0 && (
            <div className="text-center py-20 text-(--muted)">
              <div className="text-5xl mb-4">🗄️</div>
              <div className="text-lg font-semibold mb-2">{t.dbNotConnected}</div>
              <p className="text-sm mb-4">{t.setupDb}</p>
              <code className="bg-(--card) border border-(--border) px-4 py-2 rounded text-xs">
                npx prisma migrate dev && npx prisma db seed
              </code>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
