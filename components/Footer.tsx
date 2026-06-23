'use client';

import Link from 'next/link';
import { useT } from '@/hooks/useT';

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-(--card) border-t border-(--border) mt-12">
      <div className="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="text-xl font-bold mb-3">
            Tech<span className="text-(--accent)">Store</span>
          </div>
          <p className="text-(--muted) text-[13px] leading-relaxed mb-4" style={{ whiteSpace: 'pre-line' }}>
            {t.footerDesc}
          </p>
          <div className="text-lg font-bold mb-1">☎ 0 800 000 000</div>
          <div className="text-(--muted) text-xs mb-4">{t.freeDaily}</div>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">{t.buyers}</h4>
          <ul className="space-y-2.5">
            {[
              { label: t.delivery, href: '/delivery' },
              { label: t.warranty, href: '/warranty' },
              { label: t.contacts, href: '/contacts' },
              { label: t.sales, href: '/catalog?badge=sale' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-(--muted) text-[13px] hover:text-(--accent) transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">{t.company}</h4>
          <ul className="space-y-2.5">
            {[
              { label: t.aboutUs, href: '/about' },
              { label: t.contacts, href: '/contacts' },
              { label: t.service, href: '/warranty' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-(--muted) text-[13px] hover:text-(--accent) transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column */}
        <div>
          <h4 className="font-bold mb-4">{t.popular}</h4>
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
          <span>{t.copyrights}</span>
          <span>support@techstore.ua &nbsp;|&nbsp; м. Київ, вул. Хрещатик 1</span>
        </div>
      </div>
    </footer>
  );
}
