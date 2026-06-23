'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

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
  customerName: string;
  phone: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: 'processing', label: 'В обробці' },
  { value: 'shipped', label: 'Відправлено' },
  { value: 'delivered', label: 'Доставлено' },
];

const statusBadgeClass: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-600',
  delivered: 'bg-green-100 text-green-700',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!user.isAdmin) { router.replace('/account'); return; }
  }, [user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/orders?all=1')
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleStatusChange(id: string, status: string) {
    setSavingId(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } else {
      alert('Помилка оновлення статусу');
    }
    setSavingId(null);
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">📋 Замовлення</h1>
          <p className="text-(--muted) text-sm mt-1">Управління статусами замовлень</p>
        </div>
        <Link href="/admin" className="bg-(--bg) border border-(--border) hover:border-(--accent) text-(--text) font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
          ← Панель адміністратора
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Всього замовлень', value: orders.length, icon: '📦' },
          { label: 'В обробці', value: orders.filter((o) => o.status === 'processing').length, icon: '⏳' },
          { label: 'Відправлено', value: orders.filter((o) => o.status === 'shipped').length, icon: '🚚' },
          { label: 'Доставлено', value: orders.filter((o) => o.status === 'delivered').length, icon: '✓' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-(--card) border border-(--border) rounded-xl p-5 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-(--muted) text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border) font-bold text-sm text-(--muted) uppercase tracking-wide">
          {loading ? 'Завантаження...' : `Список замовлень (${orders.length})`}
        </div>

        {!loading && orders.length === 0 ? (
          <div className="text-center py-12 text-(--muted)">Замовлень ще немає</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--bg)">
                  <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Замовлення</th>
                  <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Клієнт</th>
                  <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">ТТН</th>
                  <th className="text-right px-5 py-3 text-[12px] font-semibold text-(--muted)">Сума</th>
                  <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-(--border) hover:bg-(--bg) transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-mono font-bold text-(--accent) text-[13px]">{order.orderNumber}</div>
                      <div className="text-[11px] text-(--muted)">
                        {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items.reduce((n, i) => n + i.qty, 0)} шт.
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-[13px] font-semibold">{order.customerName}</div>
                      <div className="text-[11px] text-(--muted)">{order.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono text-(--muted)">{order.trackingNumber ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-[13px] font-bold">{order.total.toLocaleString('uk-UA')} ₴</td>
                    <td className="px-5 py-3 text-center">
                      <select
                        value={order.status}
                        disabled={savingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${statusBadgeClass[order.status] ?? 'bg-(--bg) text-(--muted)'}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
