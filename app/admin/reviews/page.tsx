'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ReviewRow {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: { id: string; name: string; emoji: string } | null;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!user.isAdmin) { router.replace('/account'); return; }
  }, [user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm('Видалити цей відгук?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('Помилка видалення відгуку');
    }
    setDeletingId(null);
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">💬 Відгуки</h1>
          <p className="text-(--muted) text-sm mt-1">Модерація відгуків покупців</p>
        </div>
        <Link href="/admin" className="bg-(--bg) border border-(--border) hover:border-(--accent) text-(--text) font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
          ← Панель адміністратора
        </Link>
      </div>

      <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border) font-bold text-sm text-(--muted) uppercase tracking-wide">
          {loading ? 'Завантаження...' : `Список відгуків (${reviews.length})`}
        </div>

        {!loading && reviews.length === 0 ? (
          <div className="text-center py-12 text-(--muted)">Відгуків ще немає</div>
        ) : (
          <div className="divide-y divide-(--border)">
            {reviews.map((review) => (
              <div key={review.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {review.product && (
                      <Link href={`/product/${review.product.id}`} className="text-[13px] font-semibold text-(--accent) hover:underline">
                        {review.product.emoji} {review.product.name}
                      </Link>
                    )}
                    <span style={{ color: 'var(--star)' }} className="text-sm">{'★'.repeat(review.rating)}</span>
                    <span className="text-(--muted) text-[11px]">
                      {review.userName} · {new Date(review.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[13px] text-(--text) leading-relaxed">{review.comment}</p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                  className="text-[11px] text-(--accent) hover:opacity-70 underline transition-opacity shrink-0 disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
