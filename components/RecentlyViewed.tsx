'use client';

import { useEffect, useState } from 'react';
import { useViewHistoryStore } from '@/store/viewHistoryStore';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/data/products';
import { useT } from '@/hooks/useT';

export default function RecentlyViewed({ excludeId, limit = 8, className = 'mt-12' }: { excludeId?: string; limit?: number; className?: string }) {
  const t = useT();
  const ids = useViewHistoryStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const wantedIds = ids.filter((id) => id !== excludeId).slice(0, limit);
    if (wantedIds.length === 0) { setProducts([]); return; }
    fetch(`/api/products?ids=${wantedIds.join(',')}`)
      .then((r) => r.json())
      .then((fetched: Product[]) => {
        const byId = new Map(fetched.map((p) => [p.id, p]));
        const ordered = wantedIds.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
        setProducts(ordered);
      })
      .catch(() => {});
  }, [ids, excludeId, limit]);

  if (products.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-xl font-bold mb-4">{t.recentlyViewed}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
