import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">😕</div>
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-(--muted) text-lg mb-8">Сторінку не знайдено</p>
      <Link
        href="/"
        className="inline-block bg-(--accent) text-white font-bold px-8 py-3 rounded hover:bg-(--accent-hover) transition-colors"
      >
        На головну
      </Link>
    </div>
  );
}
