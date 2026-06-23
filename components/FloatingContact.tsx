'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useT';

const messengers = [
  {
    name: 'Viber',
    href: 'viber://chat?number=380800000000',
    bg: '#7360f2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.4 0C6.4.2 2.1 3.8 1.2 8.7c-.5 2.6-.1 5.1 1 7.3L1 21.5c-.1.4.3.8.7.7l5.6-1.2c1.8.9 3.8 1.4 5.8 1.4h.1c6.1 0 11-4.9 11-11C24.2 5 18.3-.2 11.4 0zm.1 20.3h-.1c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.7.8.8-3.6-.2-.4C1.6 14 1.1 11.4 1.8 9c.9-4 4.6-6.9 8.7-7C16.4 1.8 21.2 6.7 21.2 12c0 4.6-3.8 8.3-8.5 8.3H11.5zm4.7-6.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1s-.7.9-.8 1.1c-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-4-3.4-.3-.5.3-.5.9-1.6.1-.2 0-.4-.1-.5L8.2 7.5c-.2-.2-.3-.2-.5-.2H7c-.2 0-.5.1-.7.3C5.5 8.4 5 9.2 5 10.1c0 1 .6 2 1.7 3.3C8.8 15.7 11 17.5 13.5 18.2c.8.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.4-.4z"/>
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me/techstore_ua',
    bg: '#26A5E4',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/380800000000',
    bg: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.45-1.37c1.38.73 2.94 1.14 4.59 1.14h.01c5.45 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm0 18.14h-.01c-1.5 0-2.97-.4-4.25-1.17l-.3-.18-3.15.8.82-3.05-.2-.31a7.85 7.85 0 0 1-1.23-4.22c0-4.38 3.57-7.95 7.95-7.95 2.12 0 4.12.83 5.62 2.33a7.9 7.9 0 0 1 2.32 5.62c-.01 4.38-3.57 7.93-7.57 7.93zm4.36-5.95c-.24-.12-1.4-.69-1.62-.77-.21-.08-.37-.12-.53.12-.16.24-.62.77-.76.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.4-1.31-1.63-.14-.24-.01-.36.1-.48.1-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.27-.72-1.74-.19-.45-.38-.39-.53-.4l-.45-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.59 4.1 3.63.57.25 1.02.4 1.37.51.57.18 1.1.15 1.51.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z"/>
      </svg>
    ),
  },
];

export default function FloatingContact() {
  const t = useT();
  const [chatOpen, setChatOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  function handleCallbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPhone('');
      setCallbackOpen(false);
    }, 3000);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">

      {/* Messenger bubbles */}
      {messengers.map((m, i) => (
        <a
          key={m.name}
          href={m.href}
          target="_blank"
          rel="noopener noreferrer"
          title={m.name}
          className="flex items-center gap-2 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-300"
          style={{
            background: m.bg,
            opacity: chatOpen ? 1 : 0,
            transform: chatOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
            transitionDelay: chatOpen ? `${(messengers.length - 1 - i) * 60}ms` : `${i * 40}ms`,
            pointerEvents: chatOpen ? 'auto' : 'none',
            padding: '10px 16px 10px 12px',
          }}
        >
          {m.icon}
          {m.name}
        </a>
      ))}

      {/* Callback popup */}
      {callbackOpen && (
        <div className="bg-(--card) border border-(--border) rounded-2xl shadow-2xl p-5 w-[280px] mb-1">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-(--text) text-sm">{t.orderCallback}</span>
            <button
              onClick={() => { setCallbackOpen(false); setSent(false); setPhone(''); }}
              className="text-(--muted) hover:text-(--text) transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
          {sent ? (
            <div className="text-center py-3">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-semibold text-(--text)">{t.thankYou}</p>
              <p className="text-xs text-(--muted) mt-1">{t.callbackSoon}</p>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="space-y-3">
              <p className="text-xs text-(--muted)">{t.enterPhone}</p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380 __ ___ __ __"
                required
                autoFocus
                className="w-full h-10 border border-(--border) rounded-lg px-3 text-sm outline-none focus:border-(--accent) transition-colors bg-(--card) text-(--text)"
              />
              <button
                type="submit"
                className="w-full h-10 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors text-sm"
              >
                {t.callBackMe}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Bottom buttons row */}
      <div className="flex gap-3">
        {/* Callback button */}
        <button
          onClick={() => { setCallbackOpen((v) => !v); setChatOpen(false); }}
          title={t.orderCallback}
          className="w-14 h-14 rounded-full bg-(--accent) hover:bg-(--accent-hover) text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </button>

        {/* Chat button */}
        <button
          onClick={() => { setChatOpen((v) => !v); setCallbackOpen(false); }}
          title={t.writeUs}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ transform: chatOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s, background 0.2s' }}
        >
          {chatOpen ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
