'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function OrderSuccessContent() {
  const params = useSearchParams();
  const order = params.get('order') ?? '—';
  const tracking = params.get('tracking') ?? '';
  const phone = params.get('phone') ?? '';
  const total = params.get('total') ?? '';
  const smsSent = params.get('sms') === '1' && !!phone;

  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(tracking).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">✅</div>
      <h1 className="text-2xl font-bold mb-3">Дякуємо за покупку!</h1>
      <p className="text-(--muted) mb-6">Ваше замовлення успішно оформлено та прийняте в обробку.</p>

      <div className="bg-(--card) border border-(--border) rounded-xl p-6 mb-8 space-y-2">
        <div className="text-sm text-(--muted)">Номер замовлення</div>
        <div className="font-mono font-bold text-2xl text-(--accent)">{order}</div>
        {total && (
          <div className="text-sm text-(--muted) pt-2">
            Сума замовлення: <span className="font-semibold text-(--text)">{Number(total).toLocaleString('uk-UA')} ₴</span>
          </div>
        )}
        {phone && (
          <div className="text-sm text-(--muted)">
            Ми зателефонуємо на номер <span className="font-semibold text-(--text)">{phone}</span> для підтвердження деталей доставки.
          </div>
        )}
      </div>

      {smsSent && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center justify-center gap-2">
          <span>📩</span>
          <span>СМС з номером ТТН надіслано на <span className="font-semibold">{phone}</span></span>
        </div>
      )}

      {tracking && (
        <div className="bg-(--card) border border-(--border) rounded-xl p-6 mb-8">
          <div className="text-sm text-(--muted) mb-2">ТТН для відстеження посилки</div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-mono font-bold text-xl tracking-wider">{tracking}</span>
            <button
              onClick={handleCopy}
              title="Копіювати"
              className="w-8 h-8 flex items-center justify-center text-(--muted) hover:text-(--accent) border border-(--border) rounded-lg transition-colors text-sm"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>

          {/* Status timeline */}
          <div className="flex items-center justify-between max-w-[420px] mx-auto mt-4 text-[11px] text-(--muted)">
            {['Прийнято', 'Обробка', 'Відправлено', 'Доставлено'].map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute top-2.5 right-1/2 w-full h-0.5 ${i === 1 ? 'bg-(--accent)' : 'bg-(--border)'}`} />
                )}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                    i <= 1 ? 'bg-(--accent) text-white' : 'bg-(--border) text-(--muted)'
                  }`}
                >
                  {i <= 1 ? '✓' : ''}
                </div>
                <span className="mt-1.5">{step}</span>
              </div>
            ))}
          </div>

          <p className="text-[12px] text-(--muted) mt-4">
            Статус посилки оновлюватиметься автоматично. Збережіть номер ТТН, щоб відстежувати доставку у службі перевезення.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="h-11 px-6 flex items-center justify-center bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors"
        >
          На головну
        </Link>
        <Link
          href="/catalog"
          className="h-11 px-6 flex items-center justify-center border border-(--border) rounded-lg font-semibold text-sm text-(--muted) hover:text-(--text) transition-colors"
        >
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
