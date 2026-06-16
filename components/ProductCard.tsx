'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useT } from '@/hooks/useT';

const badgeConfig = {
  new:  { label: 'Новинка', bg: 'var(--badge-purple)' },
  hit:  { label: 'Хіт',     bg: '#e68a00' },
  sale: { label: 'Акція',   bg: 'var(--accent)' },
};

export default function ProductCard({ product }: { product: Product }) {
  const t = useT();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));

  const toggleCompare = useCompareStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.has(product.id));

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product.id);
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    const ok = toggleCompare(product.id);
    if (!ok) alert('Можна порівнювати не більше 4 товарів');
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-(--card) border border-(--border) hover:border-(--accent) hover:shadow-md rounded-md flex flex-col transition-all duration-200 relative overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-square flex items-center justify-center bg-(--bg)">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-5"
          />
        ) : (
          <span className="text-[80px]">{product.emoji}</span>
        )}

        {badge && (
          <span
            className="absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-1"
            style={{
              background: badge.bg,
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}
          >
            {discount ? `−${discount}%` : badge.label}
          </span>
        )}

        {/* Wishlist & Compare buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlist}
            title={inWishlist ? 'Видалити з обраного' : 'Додати в обране'}
            className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-sm hover:scale-110 transition-transform"
            style={{ color: inWishlist ? '#c42a2c' : '#aaa' }}
          >
            {inWishlist ? '♥' : '♡'}
          </button>
          <button
            onClick={handleCompare}
            title={inCompare ? 'Видалити з порівняння' : 'Додати до порівняння'}
            className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-sm hover:scale-110 transition-transform"
            style={{ color: inCompare ? '#2563eb' : '#aaa' }}
          >
            ⚖️
          </button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-(--muted) text-sm font-bold">
            {t.outOfStockFull}
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-0.5 pt-2.5 px-3">
        {product.reviewCount > 0 ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < product.rating ? 'var(--star)' : '#ddd', fontSize: 12 }}>
                ★
              </span>
            ))}
            <span className="text-(--muted) text-[11px] ml-1">({product.reviewCount})</span>
          </>
        ) : (
          <span className="text-(--muted) text-[11px]">{t.noReviews}</span>
        )}
      </div>

      {/* Title */}
      <div className="text-[13px] font-semibold text-(--text) text-center px-3 py-1.5 leading-snug line-clamp-2 min-h-[40px]">
        {product.name}
      </div>

      {/* Colors */}
      {product.colors && (
        <div className="flex justify-center gap-1.5 px-3 pb-2">
          {product.colors.map((c) => (
            <span
              key={c}
              className="w-4 h-4 rounded-full border border-(--border) inline-block"
              style={{ background: c }}
            />
          ))}
        </div>
      )}

      {/* Price + cart button */}
      <div className="flex items-center justify-between px-3 pb-3 mt-auto pt-1">
        <div>
          <div className="text-[18px] font-bold text-(--text) leading-tight">
            {product.price.toLocaleString('uk-UA')} ₴
          </div>
          {product.oldPrice && (
            <div className="text-[11px] text-(--old-price) line-through">
              {product.oldPrice.toLocaleString('uk-UA')} ₴
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          title={product.inStock ? t.inCart : t.outOfStockFull}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 transition-all duration-200 ${
            added
              ? 'bg-green-600 text-white scale-110'
              : product.inStock
              ? 'bg-(--accent) hover:bg-(--accent-hover) text-white hover:scale-110 active:scale-95'
              : 'bg-(--border) text-(--muted) cursor-not-allowed'
          }`}
        >
          {added ? '✓' : '🛒'}
        </button>
      </div>
    </Link>
  );
}
