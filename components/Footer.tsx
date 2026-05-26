import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-(--card) border-t border-(--border) mt-12">
      <div className="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="text-xl font-bold mb-3">
            Tech<span className="text-(--accent)">Store</span>
          </div>
          <p className="text-(--muted) text-[13px] leading-relaxed mb-4">
            Офіційний магазин електроніки в Україні.<br />
            Смартфони, ноутбуки, аксесуари та сервіс.
          </p>
          <div className="text-lg font-bold mb-1">☎ 0 800 000 000</div>
          <div className="text-(--muted) text-xs mb-4">Безкоштовно, щодня 9:00–21:00</div>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">Покупцям</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Доставка і оплата', href: '/delivery' },
              { label: 'Гарантія і повернення', href: '/warranty' },
              { label: 'Контакти', href: '/contacts' },
              { label: 'Акції', href: '/catalog?badge=sale' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-(--muted) text-[13px] hover:text-(--accent) transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">Компанія</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Про нас', href: '/about' },
              { label: 'Контакти', href: '/contacts' },
              { label: 'Сервісний центр', href: '/warranty' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-(--muted) text-[13px] hover:text-(--accent) transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">Популярне</h4>
          <ul className="space-y-2.5">
            {['iPhone', 'MacBook', 'Samsung Galaxy', 'PlayStation', 'AirPods'].map((item) => (
              <li key={item}>
                <Link
                  href={`/catalog?q=${encodeURIComponent(item)}`}
                  className="text-(--muted) text-[13px] hover:text-(--accent) transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-(--border)">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-(--muted) text-xs gap-2">
          <span>© 2026 TechStore. Всі права захищені.</span>
          <span>support@techstore.ua &nbsp;|&nbsp; м. Київ, вул. Хрещатик 1</span>
        </div>
      </div>
    </footer>
  );
}
