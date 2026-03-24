'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

type PromoCard = {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  bg: string;
  emoji: string;
  href: string;
};

const slides: PromoCard[][] = [
  [
    {
      title: 'Смартфони',
      subtitle: 'Флагмани та бюджетні',
      badge: 'до -20%',
      badgeColor: '#2563eb',
      bg: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
      emoji: '📱',
      href: '/catalog?category=smartphones',
    },
    {
      title: 'Ноутбуки',
      subtitle: 'Для роботи і навчання',
      badge: 'до -17%',
      badgeColor: '#7c3aed',
      bg: 'linear-gradient(145deg, #1a1a0a 0%, #14532d 100%)',
      emoji: '💻',
      href: '/catalog?category=laptops',
    },
    {
      title: 'Навушники',
      subtitle: 'Hi-Fi та шумодав',
      badge: 'до -30%',
      badgeColor: '#db2777',
      bg: 'linear-gradient(145deg, #1c0a0a 0%, #450a0a 100%)',
      emoji: '🎧',
      href: '/catalog?category=headphones',
    },
    {
      title: 'Аксесуари',
      subtitle: 'Все для гаджетів',
      badge: 'до -44%',
      badgeColor: '#059669',
      bg: 'linear-gradient(145deg, #0a1a0a 0%, #052e16 100%)',
      emoji: '🖱️',
      href: '/catalog?category=accessories',
    },
  ],
  [
    {
      title: 'Монітори',
      subtitle: '4K та ігрові',
      badge: 'до -25%',
      badgeColor: '#ea580c',
      bg: 'linear-gradient(145deg, #1a0f00 0%, #431407 100%)',
      emoji: '🖥️',
      href: '/catalog?category=monitors',
    },
    {
      title: 'Камери',
      subtitle: 'Фото і відео',
      badge: 'до -15%',
      badgeColor: '#0891b2',
      bg: 'linear-gradient(145deg, #0a1520 0%, #0c4a6e 100%)',
      emoji: '📷',
      href: '/catalog?category=cameras',
    },
    {
      title: 'Ігрова зона',
      subtitle: 'Консолі та геймпади',
      badge: 'Хіт!',
      badgeColor: '#dc2626',
      bg: 'linear-gradient(145deg, #1a0a1a 0%, #3b0764 100%)',
      emoji: '🎮',
      href: '/catalog?category=consoles',
    },
    {
      title: 'Розумний годинник',
      subtitle: 'Фітнес і стиль',
      badge: 'Новинки',
      badgeColor: '#0d9488',
      bg: 'linear-gradient(145deg, #0a1a1a 0%, #134e4a 100%)',
      emoji: '⌚',
      href: '/catalog?category=watches',
    },
  ],
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const cards = slides[current];

  return (
    <div>
      <div className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="relative h-[200px] md:h-[280px] rounded-xl overflow-hidden flex flex-col justify-between p-4 md:p-5 group hover:-translate-y-1 transition-transform duration-200"
              style={{ background: card.bg }}
            >
              {/* Badge */}
              <span
                className="self-start text-white text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: card.badgeColor }}
              >
                {card.badge}
              </span>

              {/* Title */}
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold leading-tight">{card.title}</h3>
                <p className="text-white/50 text-[12px] mt-0.5">{card.subtitle}</p>
              </div>

              {/* Emoji */}
              <span className="absolute bottom-3 right-3 text-[64px] md:text-[80px] leading-none select-none opacity-85 group-hover:scale-110 transition-transform duration-200">
                {card.emoji}
              </span>
            </Link>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#111] text-xl shadow-lg transition-all"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#111] text-xl shadow-lg transition-all"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? 'var(--accent)' : '#ccc',
            }}
          />
        ))}
      </div>
    </div>
  );
}
