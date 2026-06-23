'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

type Product = {
  id: string; name: string; brand: string; category: string;
  price: number; inStock: boolean; emoji: string; image: string; isStatic: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!user.isAdmin) { router.replace('/account'); return; }
  }, [user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Видалити "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    else {
      const data = await res.json();
      alert(data.error || 'Помилка видалення');
    }
  }

  if (!user?.isAdmin) return null;

  const inStock = products.filter((p) => p.inStock).length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">⚙️ Панель адміністратора</h1>
          <p className="text-(--muted) text-sm mt-1">Управління товарами магазину</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="bg-(--bg) border border-(--border) hover:border-(--accent) text-(--text) font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
            📋 Замовлення
          </Link>
          <Link href="/admin/slides" className="bg-(--bg) border border-(--border) hover:border-(--accent) text-(--text) font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
            🖼 Слайди
          </Link>
          <Link href="/admin/products/new" className="bg-(--accent) hover:bg-(--accent-hover) text-white font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
            + Додати товар
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Всього товарів', value: products.length, icon: '📦' },
          { label: 'Власні товари', value: products.filter((p) => !p.isStatic).length, icon: '✏️' },
          { label: 'В наявності', value: inStock, icon: '✓' },
          { label: 'Немає в наявності', value: products.length - inStock, icon: '✗' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-(--card) border border-(--border) rounded-xl p-5 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-(--muted) text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border) font-bold text-sm text-(--muted) uppercase tracking-wide">
          {loading ? 'Завантаження...' : `Список товарів (${products.length})`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--border) bg-(--bg)">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Товар</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Категорія</th>
                <th className="text-right px-5 py-3 text-[12px] font-semibold text-(--muted)">Ціна</th>
                <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Наявність</th>
                <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Дії</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-(--border) hover:bg-(--bg) transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative text-2xl w-8 h-8 flex items-center justify-center bg-(--bg) rounded-md overflow-hidden shrink-0">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill sizes="32px" className="object-contain p-0.5" />
                        ) : (
                          product.emoji
                        )}
                      </span>
                      <div>
                        <div className="text-[13px] font-semibold line-clamp-1">{product.name}</div>
                        <div className="text-[11px] text-(--muted)">{product.brand}</div>
                      </div>
                      {!product.isStatic && (
                        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-(--muted)">{product.category}</td>
                  <td className="px-5 py-3 text-right text-[13px] font-bold">{product.price.toLocaleString('uk-UA')} ₴</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {product.inStock ? 'Є' : 'Немає'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/product/${product.id}`} className="text-[11px] text-(--muted) hover:text-(--text) underline transition-colors">Перегляд</Link>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-[11px] text-blue-600 hover:text-blue-800 underline transition-colors">Редагувати</Link>
                      {!product.isStatic && (
                        <button onClick={() => handleDelete(product.id, product.name)} className="text-[11px] text-(--accent) hover:opacity-70 underline transition-opacity">Видалити</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
