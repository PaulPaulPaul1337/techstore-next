'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (onChange ? hovered || value : value);
        return (
          <button
            key={i}
            type={onChange ? 'button' : undefined}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => onChange && setHovered(i + 1)}
            onMouseLeave={() => onChange && setHovered(0)}
            className={onChange ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
            style={{ fontSize: onChange ? 28 : 16, color: filled ? 'var(--star)' : 'var(--border)', lineHeight: 1 }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 30) return new Date(dateStr).toLocaleDateString('uk-UA');
  if (d > 0) return `${d} дн. тому`;
  if (h > 0) return `${h} год. тому`;
  if (m > 0) return `${m} хв. тому`;
  return 'щойно';
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const user = useAuthStore((s) => s.user);
  const openLogin = useAuthModalStore((s) => s.openLogin);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); });
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError('Будь ласка, оберіть оцінку'); return; }
    if (!comment.trim()) { setError('Напишіть відгук'); return; }
    if (!user && !guestName.trim()) { setError("Вкажіть ваше ім'я"); return; }

    setSubmitting(true);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, userName: guestName }),
    });
    setSubmitting(false);

    if (!res.ok) { setError('Помилка. Спробуйте ще раз'); return; }
    const review = await res.json();
    setReviews((prev) => [review, ...prev]);
    setRating(0);
    setComment('');
    setGuestName('');
    setFormOpen(false);
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Відгуки{reviews.length > 0 && <span className="text-(--muted) font-normal text-base ml-2">({reviews.length})</span>}
        </h2>
        <button
          onClick={() => {
            if (!user) { openLogin(); return; }
            setFormOpen((v) => !v);
          }}
          className="h-9 px-5 bg-(--accent) hover:bg-(--accent-hover) text-white text-sm font-bold rounded-lg transition-colors"
        >
          {formOpen ? 'Скасувати' : '+ Написати відгук'}
        </button>
      </div>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-6 items-center">
          <div className="text-center shrink-0">
            <div className="text-5xl font-bold text-(--text)">{avg}</div>
            <Stars value={Math.round(Number(avg))} />
            <div className="text-xs text-(--muted) mt-1">{reviews.length} відгуків</div>
          </div>
          <div className="flex-1 w-full space-y-1.5">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-(--muted) w-3 text-right">{star}</span>
                <span style={{ color: 'var(--star)' }}>★</span>
                <div className="flex-1 h-2 bg-(--border) rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%', background: 'var(--star)' }}
                  />
                </div>
                <span className="text-(--muted) w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {formOpen && (
        <div className="bg-(--card) border border-(--border) rounded-xl p-5 mb-6">
          <h3 className="font-bold mb-4">Ваш відгук</h3>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Оцінка</label>
              <Stars value={rating} onChange={setRating} />
            </div>
            {!user && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ваше ім&apos;я</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Іван"
                  className="w-full h-10 border border-(--border) rounded-lg px-3 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-1.5">Відгук</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Розкажіть про свій досвід з товаром..."
                rows={4}
                className="w-full border border-(--border) rounded-lg px-3 py-2.5 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text) resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="h-10 px-6 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm"
              >
                {submitting ? 'Збереження...' : 'Опублікувати'}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="h-10 px-5 border border-(--border) rounded-lg text-sm text-(--muted) hover:text-(--text) transition-colors"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-8 text-(--muted)">Завантаження відгуків...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-(--muted)">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-semibold">Відгуків поки немає</p>
          <p className="text-sm mt-1">Будьте першим, хто залишить відгук</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-(--card) border border-(--border) rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-(--bg) flex items-center justify-center text-base font-bold text-(--muted) shrink-0">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.userName}</div>
                    <div className="text-xs text-(--muted)">{timeAgo(r.createdAt)}</div>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-(--text) leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
