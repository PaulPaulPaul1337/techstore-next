'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Category, categoryLabels } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

type FormState = {
  name: string; brand: string; category: Category;
  price: string; oldPrice: string; emoji: string;
  badge: '' | 'new' | 'hit' | 'sale';
  specs: string; description: string; inStock: boolean;
  colors: string; rating: string; reviewCount: string;
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!user.isAdmin) { router.replace('/account'); return; }
  }, [user, router]);

  // Fetch the product from the API when the component mounts
  useEffect(() => {
    if (!user?.isAdmin) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name: p.name,
          brand: p.brand,
          category: p.category as Category,
          price: String(p.price),
          oldPrice: p.oldPrice ? String(p.oldPrice) : '',
          emoji: p.emoji,
          badge: (p.badge ?? '') as FormState['badge'],
          specs: (p.specs as string[]).join('\n'),
          description: p.description,
          inStock: p.inStock,
          colors: (p.colors as string[]).join(', '),
          rating: String(p.rating),
          reviewCount: String(p.reviewCount),
        });
      })
      .catch(() => router.replace('/admin'));
  }, [id, user, router]);

  if (!user?.isAdmin || !form) return (
    <div className="flex items-center justify-center h-40 text-(--muted)">Завантаження...</div>
  );

  function set(key: keyof FormState, value: string | boolean) {
    setForm((f) => f ? { ...f, [key]: value } : f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
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

    if (!res.ok) { setError('Помилка збереження'); setSaving(false); return; }

    setSaved(true);
    setTimeout(() => router.push('/admin'), 1000);
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-(--muted) hover:text-(--text) transition-colors">← Назад</Link>
        <h1 className="text-2xl font-bold">Редагувати товар</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-(--card) border border-(--border) rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Назва товару *"><input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Бренд *"><input required value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inp} /></Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Категорія">
            <select value={form.category} onChange={(e) => set('category', e.target.value as Category)} className={inp}>
              {categories.map((cat) => <option key={cat} value={cat}>{categoryLabels[cat]}</option>)}
            </select>
          </Field>
          <Field label="Емодзі"><input value={form.emoji} onChange={(e) => set('emoji', e.target.value)} className={inp} /></Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Ціна (₴) *"><input required type="number" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} className={inp} /></Field>
          <Field label="Стара ціна (₴)"><input type="number" value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} className={inp} /></Field>
          <Field label="Бейдж">
            <select value={form.badge} onChange={(e) => set('badge', e.target.value)} className={inp}>
              <option value="">Без бейджа</option>
              <option value="new">Новинка</option>
              <option value="hit">Хіт</option>
              <option value="sale">Акція</option>
            </select>
          </Field>
        </div>

        <Field label="Характеристики (кожна з нового рядка)">
          <textarea value={form.specs} onChange={(e) => set('specs', e.target.value)} className={`${inp} h-28 resize-none`} />
        </Field>
        <Field label="Опис">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inp} h-24 resize-none`} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Рейтинг">
            <select value={form.rating} onChange={(e) => set('rating', e.target.value)} className={inp}>
              {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </Field>
          <Field label="Відгуки"><input type="number" min="0" value={form.reviewCount} onChange={(e) => set('reviewCount', e.target.value)} className={inp} /></Field>
          <Field label="Кольори (через кому)"><input value={form.colors} onChange={(e) => set('colors', e.target.value)} className={inp} /></Field>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-4 h-4 accent-(--accent)" />
          <span className="text-sm font-semibold">Є в наявності</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className={`flex-1 h-11 font-bold rounded-lg text-white transition-colors disabled:opacity-60 ${saved ? 'bg-green-600' : 'bg-(--accent) hover:bg-(--accent-hover)'}`}>
            {saved ? '✓ Збережено!' : saving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
          <Link href="/admin" className="h-11 px-5 border border-(--border) rounded-lg font-semibold text-sm text-(--muted) hover:text-(--text) transition-colors flex items-center">Скасувати</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-semibold mb-1.5">{label}</label>{children}</div>;
}

const inp = 'w-full border border-(--border) rounded-lg px-3 py-2.5 text-sm bg-(--card) text-(--text) outline-none focus:border-(--accent) transition-colors';
