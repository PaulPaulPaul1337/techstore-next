'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Category, categoryLabels } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

const emptyForm = {
  name: '', brand: '', category: 'smartphones' as Category,
  price: '', oldPrice: '', emoji: '📦',
  badge: '' as '' | 'new' | 'hit' | 'sale',
  specs: '', description: '', inStock: true,
  colors: '', rating: '5', reviewCount: '0',
};

export default function NewProductPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!user.isAdmin) router.replace('/account');
  }, [user, router]);

  if (!user?.isAdmin) return null;

  function set(key: keyof typeof emptyForm, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        specs: form.specs.split('\n').map((s) => s.trim()).filter(Boolean),
        colors: form.colors ? form.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
        badge: form.badge || null,
      }),
    });

    if (!res.ok) {
      setError('Помилка збереження');
      setSaving(false);
      return;
    }

    router.push('/admin');
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-(--muted) hover:text-(--text) transition-colors">← Назад</Link>
        <h1 className="text-2xl font-bold">Новий товар</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-(--card) border border-(--border) rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Назва товару *">
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={input} placeholder="iPhone 16 Pro" />
          </Field>
          <Field label="Бренд *">
            <input required value={form.brand} onChange={(e) => set('brand', e.target.value)} className={input} placeholder="Apple" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Категорія">
            <select value={form.category} onChange={(e) => set('category', e.target.value as Category)} className={input}>
              {categories.map((cat) => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
            </select>
          </Field>
          <Field label="Емодзі товару">
            <input value={form.emoji} onChange={(e) => set('emoji', e.target.value)} className={input} placeholder="📱" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Ціна (₴) *">
            <input required type="number" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} className={input} placeholder="29999" />
          </Field>
          <Field label="Стара ціна (₴)">
            <input type="number" min="1" value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} className={input} placeholder="34999" />
          </Field>
          <Field label="Бейдж">
            <select value={form.badge} onChange={(e) => set('badge', e.target.value)} className={input}>
              <option value="">Без бейджа</option>
              <option value="new">Новинка</option>
              <option value="hit">Хіт</option>
              <option value="sale">Акція</option>
            </select>
          </Field>
        </div>

        <Field label="Характеристики (кожна з нового рядка) *">
          <textarea required value={form.specs} onChange={(e) => set('specs', e.target.value)} className={`${input} h-28 resize-none`} placeholder={"6.3\" Display\nA18 Pro chip\n48MP камера"} />
        </Field>

        <Field label="Опис *">
          <textarea required value={form.description} onChange={(e) => set('description', e.target.value)} className={`${input} h-24 resize-none`} placeholder="Короткий опис товару..." />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Рейтинг (1–5)">
            <select value={form.rating} onChange={(e) => set('rating', e.target.value)} className={input}>
              {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </Field>
          <Field label="Кількість відгуків">
            <input type="number" min="0" value={form.reviewCount} onChange={(e) => set('reviewCount', e.target.value)} className={input} />
          </Field>
          <Field label="Кольори (через кому)">
            <input value={form.colors} onChange={(e) => set('colors', e.target.value)} className={input} placeholder="#000, #fff" />
          </Field>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-4 h-4 accent-(--accent)" />
          <span className="text-sm font-semibold">Є в наявності</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 h-11 font-bold rounded-lg text-white bg-(--accent) hover:bg-(--accent-hover) transition-colors disabled:opacity-60">
            {saving ? 'Збереження...' : 'Додати товар'}
          </button>
          <Link href="/admin" className="h-11 px-5 border border-(--border) rounded-lg font-semibold text-sm text-(--muted) hover:text-(--text) transition-colors flex items-center">
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const input = 'w-full border border-(--border) rounded-lg px-3 py-2.5 text-sm bg-(--card) text-(--text) outline-none focus:border-(--accent) transition-colors';
