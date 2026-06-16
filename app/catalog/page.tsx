'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { categoryLabels, categoryEmojis, Category } from '@/data/products';
import type { Product } from '@/data/products';
import { useT } from '@/hooks/useT';

const categories = Object.keys(categoryLabels) as Category[];

function CatalogContent() {
  const t = useT();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);

  const [category, setCategory] = useState<Category | ''>((searchParams.get('category') as Category) || '');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [badge, setBadge] = useState(searchParams.get('badge') || '');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { setAllProducts(data); setDbLoaded(true); })
      .catch(() => setDbLoaded(true));
  }, []);

  useEffect(() => {
    setCategory((searchParams.get('category') as Category) || '');
    setSearch(searchParams.get('q') || '');
    setBadge(searchParams.get('badge') || '');
  }, [searchParams]);

  const products = allProducts;
  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (category) result = result.filter((p) => p.category === category);
    if (badge) result = result.filter((p) => p.badge === badge);
    if (inStockOnly) result = result.filter((p) => p.inStock);
    if (maxPrice < 100000) result = result.filter((p) => p.price <= maxPrice);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'price_asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'name': return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [category, badge, inStockOnly, maxPrice, search, sort]);

  function resetFilters() {
    setCategory('');
    setBadge('');
    setSearch('');
    setSort('default');
    setMaxPrice(100000);
    setInStockOnly(false);
  }

  const sortOptions = [
    { value: 'default', label: t.sortDefault },
    { value: 'price_asc', label: t.sortPriceAsc },
    { value: 'price_desc', label: t.sortPriceDesc },
    { value: 'rating', label: t.sortRating },
    { value: 'name', label: t.sortName },
  ];

  const badgeOptions = [
    { value: '', label: t.all },
    { value: 'new', label: t.badgeNew },
    { value: 'hit', label: t.badgeHit },
    { value: 'sale', label: t.badgeSale },
  ];

  const pageTitle =
    badge === 'sale' ? t.salePageTitle
    : badge === 'hit' ? t.hitPageTitle
    : category ? `${categoryEmojis[category as Category]} ${categoryLabels[category as Category]}`
    : search ? t.searchTitle(search)
    : t.allCatalog;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:flex flex-col gap-5 w-56 flex-shrink-0">

          {/* Search */}
          <div>
            <div className="text-[13px] font-bold mb-2 text-(--muted) uppercase tracking-wide">{t.searchLabel}</div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-9 bg-(--card) border border-(--border) text-(--text) text-sm px-3 rounded focus:border-(--muted) outline-none"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="text-[13px] font-bold mb-2 text-(--muted) uppercase tracking-wide">{t.categoryLabel}</div>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setCategory('')}
                className={`text-left px-2.5 py-2 rounded text-[13px] transition-colors ${!category ? 'bg-(--accent) text-white font-semibold' : 'text-(--muted) hover:text-(--text) hover:bg-(--card)'}`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left px-2.5 py-2 rounded text-[13px] transition-colors ${category === cat ? 'bg-(--accent) text-white font-semibold' : 'text-(--muted) hover:text-(--text) hover:bg-(--card)'}`}
                >
                  {categoryEmojis[cat]} {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <div className="text-[13px] font-bold mb-2 text-(--muted) uppercase tracking-wide">{t.typeLabel}</div>
            <div className="flex flex-col gap-0.5">
              {badgeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setBadge(value)}
                  className={`text-left px-2.5 py-2 rounded text-[13px] transition-colors ${badge === value ? 'bg-(--accent) text-white font-semibold' : 'text-(--muted) hover:text-(--text) hover:bg-(--card)'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="text-[13px] font-bold mb-2 text-(--muted) uppercase tracking-wide">
              {t.maxPriceLabel} {maxPrice.toLocaleString('uk-UA')} ₴
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-(--accent)"
            />
            <div className="flex justify-between text-[11px] text-(--muted) mt-1">
              <span>1 000 ₴</span>
              <span>100 000 ₴</span>
            </div>
          </div>

          {/* In stock */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-(--accent)"
            />
            <span className="text-[13px]">{t.inStockOnly}</span>
          </label>

          <button
            onClick={resetFilters}
            className="text-[13px] text-(--muted) hover:text-(--text) transition-colors underline text-left"
          >
            {t.resetFilters}
          </button>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-(--muted) text-sm">
              {t.foundLabel} <strong className="text-(--text)">{filtered.length}</strong> {t.productsUnit}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-(--card) border border-(--border) text-(--text) text-sm px-3 h-9 rounded outline-none focus:border-(--muted)"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {!dbLoaded ? (
            <div className="text-center py-20 text-(--muted)">
              <div className="text-4xl mb-3 animate-pulse">⏳</div>
              <div className="text-sm">{t.loadingProducts}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-(--muted)">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-lg font-semibold mb-2">{t.nothingFound}</div>
              <button onClick={resetFilters} className="text-(--accent) underline text-sm hover:opacity-80">{t.resetFilters}</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-(--muted)"><div className="text-4xl animate-pulse">⏳</div></div>}>
      <CatalogContent />
    </Suspense>
  );
}
