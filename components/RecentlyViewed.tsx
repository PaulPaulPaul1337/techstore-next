'use client';

import { useEffect, useState } from 'react';
import { useViewHistoryStore } from '@/store/viewHistoryStore';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/data/products';

export default function RecentlyViewed({ excludeId, limit = 8, className = 'mt-12' }: { excludeId?: string; limit?: number; className?: string }) {
  const ids = useViewHistoryStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return; }
    fetch('/api/products')
      .then((r) => r.json())
      .then((all: Product[]) => {
        const byId = new Map(all.map((p) => [p.id, p]));
        const ordered = ids
          .filter((id) => id !== excludeId)
          .map((id) => byId.get(id))
          .filter((p): p is Product => Boolean(p))
          .slice(0, limit);
        setProducts(ordered);
      })
      .catch(() => {});
  }, [ids, excludeId, limit]);

  if (products.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-xl font-bold mb-4">Ви недавно дивились</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
