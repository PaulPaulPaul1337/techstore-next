'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

type PaymentMethod = 'card' | 'cash' | 'apay';

const paymentMethods: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'card', label: 'Банківська картка', icon: '💳', desc: 'Visa / Mastercard' },
  { id: 'apay', label: 'Apple Pay / Google Pay', icon: '📱', desc: 'Оплата зі смартфону' },
  { id: 'cash', label: 'Оплата при отриманні', icon: '💵', desc: 'Готівка або картка курʼєру' },
];

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [visible, setVisible] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('TEST USER');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = totalPrice();

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Заповніть усі поля доставки');
      return;
    }

    if (method === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length !== 16) { setError('Невірний номер картки'); return; }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) { setError('Невірний термін дії картки'); return; }
      if (cardCvv.length !== 3) { setError('Невірний CVV код'); return; }
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);

    const orderNumber = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `2045${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    fetch('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        message: `TechStore: ваше замовлення ${orderNumber} оформлено! ТТН для відстеження: ${trackingNumber}`,
      }),
    }).catch(() => {});

    clearCart();

    const query = new URLSearchParams({ order: orderNumber, tracking: trackingNumber, phone, total: String(total), sms: '1' });
    router.push(`/order-success?${query.toString()}`);
  }

  const inputClass =
    'w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-(--bg) text-(--text)';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-(--card) rounded-xl shadow-2xl transition-all duration-300 ease-in-out"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-(--border)">
          <h2 className="text-lg font-bold">Оформлення замовлення</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center text-(--muted) hover:text-(--text) transition-colors text-xl rounded-full hover:bg-(--bg)"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded">
                  {error}
                </div>
              )}

              {/* Delivery info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-(--muted) uppercase tracking-wide">Дані для доставки</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Ім&apos;я та прізвище</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Іван Петренко" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Телефон</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 99 123 45 67" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Адреса доставки</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="м. Київ, Нова Пошта №1" className={inputClass} />
                </div>
              </div>

              {/* Payment methods */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-(--muted) uppercase tracking-wide">Спосіб оплати</h3>
                <div className="space-y-2">
                  {paymentMethods.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        method === m.id ? 'border-(--accent) bg-(--bg)' : 'border-(--border) hover:bg-(--bg)'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                        className="accent-(--accent)"
                      />
                      <span className="text-xl">{m.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{m.label}</div>
                        <div className="text-xs text-(--muted)">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card form */}
              {method === 'card' && (
                <div className="space-y-3 border border-(--border) rounded-lg p-4 bg-(--bg)">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold">Дані картки</h4>
                    <span className="text-[11px] text-(--muted) bg-(--card) border border-(--border) px-2 py-0.5 rounded-full">
                      Тестовий режим
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-(--muted)">Номер картки</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-(--muted)">Термін дії</label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-(--muted)">CVV</label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        inputMode="numeric"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-(--muted)">Ім&apos;я власника картки</label>
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="TEST USER" className={inputClass} />
                  </div>
                  <p className="text-[11px] text-(--muted)">
                    Це демонстраційна форма оплати, реальне списання коштів не відбувається.
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-(--border) pt-4 flex justify-between items-center">
                <span className="font-bold">До сплати</span>
                <span className="text-xl font-bold text-(--accent)">{total.toLocaleString('uk-UA')} ₴</span>
              </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full h-12 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-all duration-200"
          >
            {submitting ? 'Обробка...' : `Підтвердити замовлення · ${total.toLocaleString('uk-UA')} ₴`}
          </button>
        </form>
      </div>
    </div>
  );
}
