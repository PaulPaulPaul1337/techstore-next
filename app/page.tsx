import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import { products, categoryLabels, categoryEmojis, Category } from '@/data/products';

const categories = Object.keys(categoryLabels) as Category[];

const promoItems = [
  { icon: '🚀', title: 'Швидка доставка', desc: '1–2 дні по всій Україні' },
  { icon: '✅', title: 'Офіційна гарантія', desc: 'Тільки оригінальні товари' },
  { icon: '💳', title: 'Розстрочка 0%', desc: 'Monobank, PrivatBank' },
  { icon: '🔄', title: 'Легке повернення', desc: '14 днів без питань' },
];

export default function HomePage() {
  const featured = products.slice(0, 10);
  const hits = products.filter((p) => p.badge === 'hit');

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-5 space-y-8">
      {/* Hero */}
      <HeroSlider />

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Категорії</h2>
          <Link href="/catalog" className="text-[--muted] text-sm hover:text-[--text] transition-colors">
            Всі товари →
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/catalog?category=${cat}`}
              className="bg-[--card] border border-transparent hover:border-[--muted] rounded-md py-5 px-2.5 text-center transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2">{categoryEmojis[cat]}</div>
              <div className="text-[11px] font-semibold text-[--muted] leading-snug">{categoryLabels[cat]}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <div className="bg-[--card] border border-[--border] rounded-md grid grid-cols-2 lg:grid-cols-4">
        {promoItems.map((item, idx) => (
          <div
            key={item.title}
            className={`flex items-center gap-3.5 px-6 py-5 ${idx < promoItems.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-[--border]' : ''}`}
          >
            <span className="text-3xl flex-shrink-0">{item.icon}</span>
            <div>
              <h4 className="text-[13px] font-bold mb-0.5">{item.title}</h4>
              <p className="text-[11px] text-[--muted] leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Популярні товари</h2>
          <Link href="/catalog" className="text-[--muted] text-sm hover:text-[--text] transition-colors">
            Всі товари →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Hits */}
      {hits.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🔥 Хіти продажів</h2>
            <Link href="/catalog?badge=hit" className="text-[--muted] text-sm hover:text-[--text] transition-colors">
              Дивитись всі →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {hits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
