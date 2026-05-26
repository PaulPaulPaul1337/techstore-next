'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { products } from '@/data/products';
import { useAdminProductsStore } from '@/store/adminProductsStore';

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const adminProducts = useAdminProductsStore((s) => s.products);

  const allProducts = [...products, ...adminProducts];
  const wishItems = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">♡ Обране</h1>

      {wishItems.length === 0 ? (
        <div className="text-center py-20 text-(--muted)">
          <div className="text-6xl mb-4">♡</div>
          <div className="text-lg font-semibold mb-2">Список обраного порожній</div>
          <p className="text-sm mb-6">Натискайте ♡ на картках товарів, щоб додати їх сюди</p>
          <Link href="/catalog" className="bg-(--accent) text-white px-6 py-2.5 rounded font-bold hover:bg-(--accent-hover) transition-colors inline-block">
            До каталогу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishItems.map((product) => (
            <div key={product.id} className="bg-(--card) border border-(--border) rounded-md overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/product/${product.id}`} className="block">
                <div className="aspect-square flex items-center justify-center text-[80px] bg-(--bg)">
                  {product.emoji}
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
                  {product.inStock ? 'В кошик' : 'Немає'}
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  className="w-9 h-9 rounded border border-(--border) flex items-center justify-center text-[#c42a2c] hover:bg-(--bg) transition-colors"
                  title="Видалити з обраного"
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
