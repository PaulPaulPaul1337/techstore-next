'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Category, categoryLabels, categoryEmojis } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

const categoryMeta: Record<Category, { brands: string[]; highlights: { label: string; href: string }[] }> = {
  smartphones: {
    brands: ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Sony'],
    highlights: [
      { label: 'Новинки', href: '/catalog?category=smartphones&badge=new' },
      { label: 'Акції', href: '/catalog?category=smartphones&badge=sale' },
      { label: 'Хіти продажів', href: '/catalog?category=smartphones&badge=hit' },
    ],
  },
  laptops: {
    brands: ['Apple', 'ASUS', 'Dell', 'Lenovo', 'HP'],
    highlights: [
      { label: 'Для роботи', href: '/catalog?category=laptops' },
      { label: 'Ігрові', href: '/catalog?category=laptops&badge=hit' },
      { label: 'Акції', href: '/catalog?category=laptops&badge=sale' },
    ],
  },
  monitors: {
    brands: ['Samsung', 'LG', 'Dell', 'ASUS', 'AOC'],
    highlights: [
      { label: '4K монітори', href: '/catalog?category=monitors' },
      { label: 'Ігрові 144Hz+', href: '/catalog?category=monitors&badge=new' },
      { label: 'Акції', href: '/catalog?category=monitors&badge=sale' },
    ],
  },
  headphones: {
    brands: ['Sony', 'Apple', 'Bose', 'Sennheiser', 'JBL'],
    highlights: [
      { label: 'З шумоподавленням', href: '/catalog?category=headphones' },
      { label: 'Бездротові', href: '/catalog?category=headphones&badge=hit' },
      { label: 'Акції', href: '/catalog?category=headphones&badge=sale' },
    ],
  },
  cameras: {
    brands: ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic'],
    highlights: [
      { label: 'Повнокадрові', href: '/catalog?category=cameras' },
      { label: 'Для відео', href: '/catalog?category=cameras&badge=hit' },
      { label: 'Акції', href: '/catalog?category=cameras&badge=sale' },
    ],
  },
  consoles: {
    brands: ['Sony', 'Microsoft', 'Nintendo'],
    highlights: [
      { label: 'PlayStation 5', href: '/catalog?category=consoles' },
      { label: 'Xbox Series', href: '/catalog?category=consoles&badge=hit' },
      { label: 'Акції', href: '/catalog?category=consoles&badge=sale' },
    ],
  },
  watches: {
    brands: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Xiaomi'],
    highlights: [
      { label: 'Apple Watch', href: '/catalog?category=watches' },
      { label: 'Спортивні', href: '/catalog?category=watches&badge=hit' },
      { label: 'Акції', href: '/catalog?category=watches&badge=sale' },
    ],
  },
  accessories: {
    brands: ['Apple', 'Logitech', 'Anker', 'Belkin', 'Samsung'],
    highlights: [
      { label: 'Клавіатури та миші', href: '/catalog?category=accessories' },
      { label: 'Зарядні пристрої', href: '/catalog?category=accessories&badge=hit' },
      { label: 'Акції', href: '/catalog?category=accessories&badge=sale' },
    ],
  },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function CatalogMenu({ isOpen, onClose, onMouseEnter, onMouseLeave }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('smartphones');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveCategory('smartphones');
      requestAnimationFrame(() => setVisible(true));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const meta = categoryMeta[activeCategory];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop — starts below header */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Panel — drops from top */}
      <div
        className="relative w-full transition-all duration-300 ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Spacer for sticky header height */}
        <div className="h-[104px]" />

        <div className="max-w-[1440px] mx-auto px-4">
          <div className="bg-(--card) rounded-b-xl shadow-2xl overflow-hidden flex" style={{ maxHeight: 'calc(100vh - 120px)' }}>

            {/* Left: category list */}
            <div className="w-64 shrink-0 bg-(--bg) border-r border-(--border) overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => { onClose(); }}
                  className={`w-full flex items-center justify-between px-5 py-3 text-[14px] font-medium transition-colors border-b border-(--border) text-left ${
                    activeCategory === cat
                      ? 'bg-(--card) text-(--accent) border-l-[3px] border-l-(--accent)'
                      : 'text-(--text) hover:bg-(--card) hover:text-(--accent) border-l-[3px] border-l-transparent'
                  }`}
                >
                  <Link
                    href={`/catalog?category=${cat}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1"
                  >
                    <span className="text-lg w-6 text-center">{categoryEmojis[cat]}</span>
                    {categoryLabels[cat]}
                  </Link>
                  <span className="text-(--muted) text-base ml-2">›</span>
                </button>
              ))}
            </div>

            {/* Right: brands + highlights */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-(--text)">
                  {categoryEmojis[activeCategory]} {categoryLabels[activeCategory]}
                </h3>
                <Link
                  href={`/catalog?category=${activeCategory}`}
                  onClick={onClose}
                  className="text-sm text-(--accent) hover:underline font-semibold"
                >
                  Переглянути всі →
                </Link>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-(--muted) uppercase tracking-wider mb-3">Бренди</p>
                <div className="flex flex-wrap gap-2">
                  {meta.brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/catalog?category=${activeCategory}&brand=${encodeURIComponent(brand)}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-(--bg) hover:bg-(--accent) hover:text-white text-[13px] font-semibold rounded-lg transition-colors text-(--text)"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <p className="text-xs font-semibold text-(--muted) uppercase tracking-wider mb-3">Підбірки</p>
                <div className="flex flex-col gap-1">
                  {meta.highlights.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-(--bg) text-[14px] text-(--text) hover:text-(--accent) transition-colors font-medium"
                    >
                      <span className="text-(--accent) text-base">›</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
