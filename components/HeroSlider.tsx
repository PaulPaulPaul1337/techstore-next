'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';
import { products } from '@/data/products';

const slides = [
  {
    product: products[0],
    bg: 'linear-gradient(120deg, #111 40%, #1a0a0b 100%)',
  },
  {
    product: products[1],
    bg: 'linear-gradient(120deg, #0a0a1a 40%, #101030 100%)',
  },
  {
    product: products[2],
    bg: 'linear-gradient(120deg, #0a1a0a 40%, #0d2010 100%)',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const { product, bg } = slides[current];

  return (
    <div className="relative rounded-lg overflow-hidden h-[360px] md:h-[420px]" style={{ background: bg }}>
      {/* Content */}
      <div className="h-full flex items-center justify-between px-8 md:px-16">
        <div className="max-w-md">
          {product.badge && (
            <span
              className="inline-block text-white text-[11px] font-bold px-3 py-1 mb-4 uppercase tracking-wider"
              style={{
                background: 'var(--accent)',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            >
              {product.badge === 'new' ? 'Новинка' : product.badge === 'hit' ? 'Хіт продажів' : 'Знижка'}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-3">
            {product.name.split(' ').slice(0, 3).join(' ')}<br />
            <span className="text-[--accent]">{product.name.split(' ').slice(3).join(' ')}</span>
          </h2>
          <p className="text-[--muted] text-[15px] mb-5 leading-relaxed">
            {product.specs.slice(0, 2).join(' · ')}
          </p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-[28px] font-bold">
              {product.price.toLocaleString('uk-UA')} ₴
            </span>
            {product.oldPrice && (
              <span className="text-lg text-[--old-price] line-through">
                {product.oldPrice.toLocaleString('uk-UA')} ₴
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="text-white text-sm font-bold px-8 py-3 hover:bg-[--accent-hover] transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--accent)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            Купити зараз
          </button>
        </div>

        <div className="hidden md:flex items-center text-[120px] md:text-[150px] opacity-90 select-none pr-8">
          {product.emoji}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/8 border border-[--border] rounded flex items-center justify-center text-white text-xl hover:bg-white/15 transition-all"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/8 border border-[--border] rounded flex items-center justify-center text-white text-xl hover:bg-white/15 transition-all"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === current ? 'white' : 'var(--muted)' }}
          />
        ))}
      </div>
    </div>
  );
}
