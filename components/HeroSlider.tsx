'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

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
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/slides').then(r => r.json()).then((data: Slide[]) => {
      if (Array.isArray(data) && data.length > 0) setSlides(data);
    }).catch(() => {});
  }, []);

  // Group slides into pages of 4
  const pages = slides.length > 0
    ? Array.from({ length: Math.ceil(slides.length / 4) }, (_, i) => slides.slice(i * 4, i * 4 + 4))
    : [];

  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(pages.length, 1)), [pages.length]);
  const prev = () => setCurrent(c => (c - 1 + Math.max(pages.length, 1)) % Math.max(pages.length, 1));

  useEffect(() => {
    if (pages.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, pages.length]);

  if (slides.length === 0) return null;

  const cards = pages[current] ?? [];

  return (
    <div>
      <div className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="relative h-[400px] md:h-[560px] rounded-xl overflow-hidden flex flex-col justify-between p-5 md:p-8 group hover:-translate-y-1 transition-transform duration-200"
              style={{ background: card.bg }}
            >
              {/* Badge */}
              <span
                className="self-start text-white text-[13px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: card.badgeColor }}
              >
                {card.badge}
              </span>

              {/* Title */}
              <div>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">{card.title}</h3>
                <p className="text-white/50 text-[14px] mt-1">{card.subtitle}</p>
              </div>

              {/* Image or emoji */}
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="absolute bottom-0 right-0 h-[55%] object-contain opacity-90 group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <span className="absolute bottom-5 right-5 text-[120px] md:text-[160px] leading-none select-none opacity-85 group-hover:scale-110 transition-transform duration-200">
                  {card.emoji}
                </span>
              )}
            </Link>
          ))}
        </div>

        {pages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#111] text-xl shadow-lg transition-all"
            >‹</button>
            <button
              onClick={next}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#111] text-xl shadow-lg transition-all"
            >›</button>
          </>
        )}
      </div>

      {pages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? 'var(--accent)' : '#ccc' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
