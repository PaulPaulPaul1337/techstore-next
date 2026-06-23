'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/data/products';
import { useT } from '@/hooks/useT';

export default function ComparePage() {
  const t = useT();
  const ids = useCompareStore((s) => s.ids);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: Product[]) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const compareItems = ids.map((id) => allProducts.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

  if (compareItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center text-(--muted)">
        <div className="text-6xl mb-4">⚖️</div>
        <div className="text-lg font-semibold mb-2">{t.noCompare}</div>
        <p className="text-sm mb-6">{t.noCompareHint}</p>
        <Link href="/catalog" className="bg-(--accent) text-white px-6 py-2.5 rounded font-bold hover:bg-(--accent-hover) transition-colors inline-block">
          {t.backToCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t.compareTitle}</h1>
        <button
          onClick={clear}
          className="text-sm text-(--muted) hover:text-(--accent) transition-colors underline"
        >
          {t.clearAll}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <td className="w-40 p-3 text-(--muted) text-sm font-bold border-b border-(--border)">{t.characteristic}</td>
              {compareItems.map((product) => (
                <td key={product.id} className="p-3 border-b border-(--border) min-w-[200px]">
                  <div className="text-center">
                    <div className="relative h-24 my-2 bg-(--bg) rounded-lg overflow-hidden">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill sizes="200px" className="object-contain p-3" />
                      ) : (
                        <span className="text-[60px] flex items-center justify-center h-full">{product.emoji}</span>
                      )}
                    </div>
                    <div className="text-[13px] font-semibold leading-snug mb-2">{product.name}</div>
                    <div className="text-[18px] font-bold text-(--accent) mb-3">
                      {product.price.toLocaleString('uk-UA')} ₴
                    </div>
                    <div className="flex gap-1.5 justify-center">
                      <button
                        onClick={() => product.inStock && addItem(product)}
                        disabled={!product.inStock}
                        className={`flex-1 h-8 text-[12px] font-bold rounded text-white transition-colors ${
                          product.inStock ? 'bg-(--accent) hover:bg-(--accent-hover)' : 'bg-[#ccc] cursor-not-allowed'
                        }`}
                      >
                        {t.inCart}
                      </button>
                      <button
                        onClick={() => toggle(product.id)}
                        className="w-8 h-8 rounded border border-(--border) flex items-center justify-center text-(--muted) hover:text-(--accent) text-sm transition-colors"
                        title={t.remove}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Stock */}
            <tr className="bg-(--bg)">
              <td className="p-3 text-[13px] text-(--muted) font-semibold border-b border-(--border)">{t.availability}</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-3 text-center text-[13px] border-b border-(--border)">
                  <span className={p.inStock ? 'text-green-600 font-semibold' : 'text-red-400'}>
                    {p.inStock ? t.inStockShort : t.outOfStockShort}
                  </span>
                </td>
              ))}
            </tr>
            {/* Rating */}
            <tr>
              <td className="p-3 text-[13px] text-(--muted) font-semibold border-b border-(--border)">{t.rating}</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-3 text-center text-[13px] border-b border-(--border)">
                  <span style={{ color: 'var(--star)' }}>{'★'.repeat(p.rating)}</span>
                  <span className="text-(--muted) ml-1">({p.reviewCount})</span>
                </td>
              ))}
            </tr>
            {/* Brand */}
            <tr className="bg-(--bg)">
              <td className="p-3 text-[13px] text-(--muted) font-semibold border-b border-(--border)">{t.brand}</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-3 text-center text-[13px] font-semibold border-b border-(--border)">{p.brand}</td>
              ))}
            </tr>
            {/* Specs */}
            {compareItems[0].specs.map((spec, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-(--bg)'}>
                <td className="p-3 text-[12px] text-(--muted) border-b border-(--border)">{t.specLabel(idx + 1)}</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-3 text-center text-[12px] text-(--text) border-b border-(--border)">
                    {p.specs[idx] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
