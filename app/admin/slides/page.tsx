'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  bg: string;
  emoji: string;
  href: string;
  imageUrl: string | null;
  active: boolean;
  order: number;
}

const emptySlide = (): Omit<Slide, 'id' | 'order' | 'active'> => ({
  title: '',
  subtitle: '',
  badge: '',
  badgeColor: '#c42a2c',
  bg: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
  emoji: '📱',
  href: '/catalog',
  imageUrl: null,
});

export default function SlidesAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptySlide());
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/slides').then(r => r.json()).then(setSlides);
  }, []);

  function openEdit(slide: Slide) {
    setEditing(slide);
    setForm({
      title: slide.title, subtitle: slide.subtitle, badge: slide.badge,
      badgeColor: slide.badgeColor, bg: slide.bg, emoji: slide.emoji,
      href: slide.href, imageUrl: slide.imageUrl,
    });
    setIsNew(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptySlide());
    setIsNew(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/slides/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm(f => ({ ...f, imageUrl: data.url }));
  }

  async function handleSave() {
    setSaving(true);
    if (isNew) {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const slide = await res.json();
      setSlides(prev => [...prev, slide]);
    } else if (editing) {
      const res = await fetch(`/api/slides/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, active: editing.active }),
      });
      const updated = await res.json();
      setSlides(prev => prev.map(s => s.id === updated.id ? updated : s));
    }
    setSaving(false);
    setEditing(null);
    setIsNew(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Видалити слайд?')) return;
    await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    setSlides(prev => prev.filter(s => s.id !== id));
  }

  async function toggleActive(slide: Slide) {
    const res = await fetch(`/api/slides/${slide.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...slide, active: !slide.active }),
    });
    const updated = await res.json();
    setSlides(prev => prev.map(s => s.id === updated.id ? updated : s));
  }

  const formOpen = isNew || editing !== null;

  const inputClass = 'w-full h-10 border border-(--border) rounded-lg px-3 text-sm outline-none focus:border-(--accent) bg-(--card) text-(--text) transition-colors';

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-(--muted) hover:text-(--text) transition-colors">← Адмінпанель</Link>
          <h1 className="text-2xl font-bold mt-1">Управління слайдами</h1>
        </div>
        <button
          onClick={openNew}
          className="h-10 px-5 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors text-sm"
        >
          + Додати слайд
        </button>
      </div>

      {/* Edit / create form */}
      {formOpen && (
        <div className="bg-(--card) border border-(--border) rounded-xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">{isNew ? 'Новий слайд' : 'Редагувати слайд'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Заголовок</label>
                <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Смартфони" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Підзаголовок</label>
                <input className={inputClass} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Флагмани та бюджетні" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Бейдж</label>
                <input className={inputClass} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="до -20%" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Колір бейджу</label>
                <div className="flex gap-2">
                  <input type="color" value={form.badgeColor} onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))} className="h-10 w-12 rounded border border-(--border) cursor-pointer p-0.5" />
                  <input className={`${inputClass} flex-1`} value={form.badgeColor} onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Посилання (href)</label>
                <input className={inputClass} value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} placeholder="/catalog?category=smartphones" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Emoji (якщо немає картинки)</label>
                <input className={inputClass} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="📱" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Фон (CSS gradient або колір)</label>
                <textarea
                  className="w-full border border-(--border) rounded-lg px-3 py-2 text-sm outline-none focus:border-(--accent) bg-(--card) text-(--text) transition-colors font-mono resize-none"
                  rows={3}
                  value={form.bg}
                  onChange={e => setForm(f => ({ ...f, bg: e.target.value }))}
                  placeholder="linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)"
                />
                <div className="mt-1 h-10 rounded-lg border border-(--border)" style={{ background: form.bg }} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Картинка</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    value={form.imageUrl ?? ''}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value || null }))}
                    placeholder="URL або завантажте файл"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="h-10 px-4 bg-(--bg) border border-(--border) hover:border-(--accent) rounded-lg text-sm font-semibold transition-colors shrink-0"
                  >
                    {uploading ? '...' : '📁'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
                {form.imageUrl && (
                  <div className="mt-2 relative h-24 rounded-lg overflow-hidden border border-(--border)">
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm(f => ({ ...f, imageUrl: null }))}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5 hover:bg-black/80"
                    >✕</button>
                  </div>
                )}
              </div>

              {/* Preview card */}
              <div>
                <label className="block text-xs font-semibold text-(--muted) mb-1">Попередній перегляд</label>
                <div
                  className="relative h-28 rounded-xl overflow-hidden flex flex-col justify-between p-3"
                  style={{ background: form.bg }}
                >
                  <span className="self-start text-white text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: form.badgeColor }}>
                    {form.badge || 'Бейдж'}
                  </span>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{form.title || 'Заголовок'}</div>
                    <div className="text-white/50 text-[11px]">{form.subtitle || 'Підзаголовок'}</div>
                  </div>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="absolute bottom-0 right-0 h-24 object-contain opacity-90" />
                  ) : (
                    <span className="absolute bottom-1 right-2 text-[48px] leading-none opacity-85">{form.emoji}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-6 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm"
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false); }}
              className="h-10 px-5 border border-(--border) rounded-lg text-sm text-(--muted) hover:text-(--text) transition-colors"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Slides list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {slides.map((slide) => (
          <div key={slide.id} className={`bg-(--card) border rounded-xl overflow-hidden transition-opacity ${slide.active ? 'border-(--border)' : 'border-(--border) opacity-50'}`}>
            <div
              className="relative h-32 flex flex-col justify-between p-3"
              style={{ background: slide.bg }}
            >
              <span className="self-start text-white text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: slide.badgeColor }}>
                {slide.badge}
              </span>
              <div>
                <div className="text-white font-bold text-sm">{slide.title}</div>
                <div className="text-white/50 text-[11px]">{slide.subtitle}</div>
              </div>
              {slide.imageUrl ? (
                <img src={slide.imageUrl} alt="" className="absolute bottom-0 right-0 h-24 object-contain opacity-90" />
              ) : (
                <span className="absolute bottom-1 right-2 text-[48px] leading-none opacity-85">{slide.emoji}</span>
              )}
            </div>
            <div className="flex gap-1 p-2">
              <button
                onClick={() => openEdit(slide)}
                className="flex-1 h-8 text-xs font-semibold bg-(--bg) hover:bg-(--border) rounded transition-colors"
              >
                Редагувати
              </button>
              <button
                onClick={() => toggleActive(slide)}
                className={`h-8 px-2 text-xs font-semibold rounded transition-colors ${slide.active ? 'text-green-600 hover:bg-green-50' : 'text-(--muted) hover:bg-(--bg)'}`}
                title={slide.active ? 'Приховати' : 'Показати'}
              >
                {slide.active ? '👁' : '🙈'}
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="h-8 px-2 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
