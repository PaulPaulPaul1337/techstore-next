'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';

const badgeConfig = {
  new:  { label: 'Новинка', bg: 'var(--badge-purple)' },
  hit:  { label: 'Хіт',     bg: '#e68a00' },
  sale: { label: 'Акція',   bg: 'var(--accent)' },
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const badge = product.badge ? badgeConfig[product.badge] : null;
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-(--card) border border-transparent hover:border-(--muted) rounded-md flex flex-col transition-all duration-300 relative overflow-hidden"
    >
      {/* Image area */}
      <div className="relative aspect-square flex items-center justify-center text-[80px] p-5 bg-(--bg)">
        {product.emoji}
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
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-(--muted) text-sm font-bold">
            Немає в наявності
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-0.5 pt-2.5 px-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < product.rating ? 'var(--star)' : 'var(--muted)', fontSize: 12 }}>
            ★
          </span>
        ))}
        <span className="text-(--muted) text-[11px] ml-1">({product.reviewCount})</span>
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

      {/* Price */}
      <div className="text-center px-3 pb-1">
        <div className="text-[18px] font-bold text-(--text)">
          {product.price.toLocaleString('uk-UA')} ₴
        </div>
        {product.oldPrice && (
          <div className="text-[12px] text-(--old-price) line-through mt-0.5">
            {product.oldPrice.toLocaleString('uk-UA')} ₴
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className={`mx-3 mb-3 mt-2 h-8 text-[13px] font-bold rounded text-white transition-all duration-200 ${
          added
            ? 'bg-green-800'
            : product.inStock
            ? 'bg-(--accent) hover:bg-(--accent-hover) hover:-translate-y-px active:translate-y-0'
            : 'bg-(--border) cursor-not-allowed'
        }`}
      >
        {added ? '✓ Додано!' : product.inStock ? 'В кошик' : 'Немає'}
      </button>
    </Link>
  );
}
