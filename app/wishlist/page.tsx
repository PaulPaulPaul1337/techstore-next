'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/data/products';
import { useT } from '@/hooks/useT';

export default function WishlistPage() {
  const t = useT();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) { setAllProducts([]); return; }
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data: Product[]) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [ids]);

  const wishItems = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.wishlistTitle}</h1>

      {wishItems.length === 0 ? (
        <div className="text-center py-20 text-(--muted)">
          <div className="text-6xl mb-4">♡</div>
          <div className="text-lg font-semibold mb-2">{t.wishlistEmpty}</div>
          <p className="text-sm mb-6">{t.wishlistEmptyHint}</p>
          <Link href="/catalog" className="bg-(--accent) text-white px-6 py-2.5 rounded font-bold hover:bg-(--accent-hover) transition-colors inline-block">
            {t.backToCatalog}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishItems.map((product) => (
            <div key={product.id} className="bg-(--card) border border-(--border) rounded-md overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square flex items-center justify-center bg-(--bg)">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-5" />
                  ) : (
                    <span className="text-[80px]">{product.emoji}</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[13px] font-semibold text-(--text) line-clamp-2 mb-2">
                    {product.name}
                  </div>
                  <div className="text-[18px] font-bold text-(--text) mb-3">
                    {product.price.toLocaleString('uk-UA')} ₴
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => product.inStock && addItem(product)}
                  disabled={!product.inStock}
                  className={`flex-1 h-9 text-[13px] font-bold rounded text-white transition-colors ${
                    product.inStock ? 'bg-(--accent) hover:bg-(--accent-hover)' : 'bg-[#ccc] cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? t.inCart : t.outOfStock}
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  className="w-9 h-9 rounded border border-(--border) flex items-center justify-center text-[#c42a2c] hover:bg-(--bg) transition-colors"
                  title={t.removeFromWishlist}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
