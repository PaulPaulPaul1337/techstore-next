import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import { products, categoryLabels, categoryEmojis, Category } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Xiaomi', 'Lenovo', 'ASUS', 'Dell'];

export default function HomePage() {
  const featured = products.slice(0, 8);
  const hits = products.filter((p) => p.badge === 'hit');

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
                  {categoryLabels[cat]}
                </span>
                <span className="text-(--border) group-hover:text-white/70 text-lg leading-none">›</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Hero slider */}
          <HeroSlider />

          {/* Brands */}
          <div className="bg-(--card) border border-(--border) rounded-md px-6 py-4">
            <div className="flex items-center justify-around gap-2 overflow-x-auto">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  href={`/catalog?q=${brand}`}
                  className="text-[14px] font-bold text-(--muted) hover:text-(--accent) transition-colors whitespace-nowrap px-2 py-1"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured products */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-bold">Популярні товари</h2>
              <Link href="/catalog" className="text-(--muted) text-sm hover:text-(--accent) transition-colors">
                Всі товари →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {/* Hits */}
          {hits.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold">🔥 Хіти продажів</h2>
                <Link href="/catalog?badge=hit" className="text-(--muted) text-sm hover:text-(--accent) transition-colors">
                  Дивитись всі →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
