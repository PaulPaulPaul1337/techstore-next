'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useT } from '@/hooks/useT';
import type { Translations } from '@/lib/i18n';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  emoji: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  trackingNumber: string | null;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

function getPaymentLabels(t: Translations): Record<string, string> {
  return {
    card: t.pmCardFull,
    apay: t.pmApayFull,
    cash: t.pmCashFull,
  };
}

function getStatusLabels(t: Translations): Record<string, string> {
  return {
    processing: t.statusProcessing,
    shipped: t.statusShipped,
    delivered: t.statusDelivered,
  };
}

export default function OrdersPage() {
  const t = useT();
  const paymentLabels = getPaymentLabels(t);
  const statusLabels = getStatusLabels(t);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading || !user) return (
    <div className="flex items-center justify-center h-40 text-(--muted)">{t.loading}</div>
  );

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="text-(--muted) hover:text-(--text) transition-colors">←</Link>
        <h1 className="text-2xl font-bold">{t.orderHistory}</h1>
      </div>

      {ordersLoading ? (
        <div className="text-center py-12 text-(--muted)">{t.loading}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <p className="font-semibold mb-1">{t.noOrders}</p>
          <p className="text-(--muted) text-sm mb-6">{t.noOrdersDesc}</p>
          <Link href="/catalog" className="inline-block bg-(--accent) text-white font-bold px-6 py-2.5 rounded hover:bg-(--accent-hover) transition-colors">
            {t.toCatalog}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-(--border) bg-(--bg)">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-(--accent)">{order.orderNumber}</span>
                  <span className="text-(--muted) text-xs">
                    {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-(--card) border border-(--border) px-2.5 py-1 rounded-full">
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {order.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.productId}`}
                    className="flex items-center gap-3 hover:text-(--accent) transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center text-2xl bg-(--bg) rounded-md shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                      <div className="text-xs text-(--muted)">{item.qty} {t.pcs} × {item.price.toLocaleString('uk-UA')} ₴</div>
                    </div>
                    <div className="text-sm font-bold shrink-0">{(item.price * item.qty).toLocaleString('uk-UA')} ₴</div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-t border-(--border) text-sm">
                <div className="text-(--muted)">
                  {paymentLabels[order.paymentMethod] ?? order.paymentMethod}
                  {order.trackingNumber && (
                    <span className="ml-3">
                      {t.ttnLabel} <span className="font-mono font-semibold text-(--text)">{order.trackingNumber}</span>
                    </span>
                  )}
                </div>
                <div className="font-bold text-lg">{order.total.toLocaleString('uk-UA')} ₴</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
