'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { categoryLabels, categoryEmojis } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useViewHistoryStore } from '@/store/viewHistoryStore';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import RecentlyViewed from '@/components/RecentlyViewed';

interface DBProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  emoji: string;
  badge?: string | null;
  specs: string[];
  description: string;
  inStock: boolean;
  colors: string[];
  rating: number;
  reviewCount: number;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [similar, setSimilar] = useState<DBProduct[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound'>('loading');

  const addItem = useCartStore((s) => s.addItem);
  const addView = useViewHistoryStore((s) => s.addView);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStatus('loading');
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) { setStatus('notfound'); return null; }
        return r.json();
      })
      .then((data: DBProduct | null) => {
        if (!data) return;
        setProduct(data);
        setSelectedColor(data.colors?.[0] ?? null);
        setStatus('ok');
        addView(data.id);
        fetch(`/api/products?category=${data.category}`)
          .then((r) => r.json())
          .then((all: DBProduct[]) =>
            setSimilar(all.filter((p) => p.id !== data.id).slice(0, 4))
          )
          .catch(() => {});
      })
      .catch(() => setStatus('notfound'));
  }, [id, addView]);

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-[40vh] text-(--muted) text-sm">
      Завантаження...
    </div>
  );

  if (status === 'notfound' || !product) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="text-5xl">😕</div>
      <p className="text-lg font-bold">Товар не знайдено</p>
      <Link href="/catalog" className="text-(--accent) hover:underline text-sm">← До каталогу</Link>
    </div>
  );

  const cat = product.category as keyof typeof categoryLabels;
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  function handleAdd() {
    if (!product!.inStock) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (let i = 0; i < qty; i++) addItem(product as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-(--muted) mb-6">
        <Link href="/" className="hover:text-(--text) transition-colors">Головна</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.category}`} className="hover:text-(--text) transition-colors">
          {categoryEmojis[cat]} {categoryLabels[cat]}
        </Link>
        <span>/</span>
        <span className="text-(--text) truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="bg-(--card) rounded-lg flex items-center justify-center aspect-square text-[160px] relative">
          {product.emoji}
          {discount && (
            <span
              className="absolute top-4 left-4 text-white text-[13px] font-bold px-3 py-1.5"
              style={{ background: 'var(--accent)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))' }}
            >
              −{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-(--muted) text-sm font-semibold mb-1">{product.brand}</div>
            <h1 className="text-2xl font-bold leading-snug">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < product.rating ? 'var(--star)' : 'var(--muted)', fontSize: 16 }}>★</span>
              ))}
            </div>
            <span className="text-(--muted) text-sm">{product.reviewCount} відгуків</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">{product.price.toLocaleString('uk-UA')} ₴</span>
            {product.oldPrice && (
              <span className="text-lg text-(--old-price) line-through">{product.oldPrice.toLocaleString('uk-UA')} ₴</span>
            )}
          </div>

          <div className={`text-sm font-semibold ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
            {product.inStock ? '✓ Є в наявності' : '✗ Немає в наявності'}
          </div>

          {product.colors && product.colors.length > 1 && (
            <div>
              <div className="text-sm font-semibold text-(--muted) mb-2">Колір:</div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} type="button" onClick={() => setSelectedColor(c)}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{ background: c, outline: selectedColor === c ? '2px solid white' : '2px solid transparent', outlineOffset: 2 }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.inStock && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-(--card) border border-(--border) rounded overflow-hidden">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 text-xl text-(--muted) hover:text-(--text) transition-colors">−</button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="w-10 h-11 text-xl text-(--muted) hover:text-(--text) transition-colors">+</button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 h-11 font-bold text-white rounded transition-all duration-200 ${added ? 'bg-green-700' : 'bg-(--accent) hover:bg-(--accent-hover) hover:-translate-y-0.5'}`}
              >
                {added ? '✓ Додано до кошику!' : 'В кошик'}
              </button>
              <Link href="/cart" className="h-11 px-5 border border-(--border) rounded font-semibold text-sm text-(--muted) hover:text-(--text) hover:border-(--muted) transition-all flex items-center">
                🛒 Кошик
              </Link>
            </div>
          )}

          <div className="bg-(--card) rounded-lg p-4 mt-2">
            <h3 className="font-bold mb-3">Характеристики</h3>
            <ul className="space-y-2">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-2 text-sm text-(--muted)">
                  <span className="text-(--accent)">•</span>{spec}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Опис</h3>
            <p className="text-(--muted) text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection productId={product.id} />

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Схожі товари</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {similar.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
