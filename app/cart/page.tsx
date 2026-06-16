'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import CheckoutModal from '@/components/CheckoutModal';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-3">Кошик порожній</h1>
        <p className="text-(--muted) mb-8">Додайте товари до кошику та вони з'являться тут</p>
        <Link
          href="/catalog"
          className="inline-block bg-(--accent) text-white font-bold px-8 py-3 rounded hover:bg-(--accent-hover) transition-colors"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  const delivery = 0; // free
  const total = totalPrice();

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Кошик</h1>
        <button
          onClick={clearCart}
          className="text-(--muted) text-sm hover:text-red-400 transition-colors"
        >
          🗑 Очистити кошик
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="bg-(--card) border border-(--border) rounded-lg p-4 flex gap-4 items-center"
            >
              {/* Image */}
              <Link href={`/product/${product.id}`} className="relative text-5xl flex-shrink-0 w-16 h-16 flex items-center justify-center bg-[#222] rounded-md overflow-hidden">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill sizes="64px" className="object-contain p-1.5" />
                ) : (
                  product.emoji
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.id}`} className="text-sm font-semibold hover:text-(--accent) transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </Link>
                <div className="text-(--muted) text-xs mt-0.5">{product.brand}</div>
              </div>

              {/* Qty controls */}
              <div className="flex items-center bg-(--bg) border border-(--border) rounded overflow-hidden flex-shrink-0">
                <button
                  onClick={() => updateQty(product.id, qty - 1)}
                  className="w-9 h-9 text-lg text-(--muted) hover:text-(--text) transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => updateQty(product.id, qty + 1)}
                  className="w-9 h-9 text-lg text-(--muted) hover:text-(--text) transition-colors"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0 w-28">
                <div className="font-bold">{(product.price * qty).toLocaleString('uk-UA')} ₴</div>
                {qty > 1 && (
                  <div className="text-(--muted) text-xs">{product.price.toLocaleString('uk-UA')} ₴/шт</div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(product.id)}
                className="text-(--muted) hover:text-red-400 transition-colors text-lg flex-shrink-0"
                title="Видалити"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-(--card) border border-(--border) rounded-lg p-5 sticky top-20">
            <h2 className="text-lg font-bold mb-4">Підсумок замовлення</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-(--muted)">
                <span>Товари ({items.reduce((s, i) => s + i.qty, 0)} шт.)</span>
                <span>{total.toLocaleString('uk-UA')} ₴</span>
              </div>
              <div className="flex justify-between text-(--muted)">
                <span>Доставка</span>
                <span className="text-green-400 font-semibold">
                  {delivery === 0 ? 'Безкоштовно' : `${delivery} ₴`}
                </span>
              </div>
              <div className="border-t border-(--border) pt-3 flex justify-between font-bold text-lg">
                <span>Разом</span>
                <span className="text-(--accent)">{total.toLocaleString('uk-UA')} ₴</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full h-12 bg-(--accent) text-white font-bold rounded hover:bg-(--accent-hover) transition-all duration-200 hover:-translate-y-0.5 mb-3"
            >
              Оформити замовлення
            </button>

            <Link
              href="/catalog"
              className="block text-center text-sm text-(--muted) hover:text-(--text) transition-colors"
            >
              ← Продовжити покупки
            </Link>

            {/* Payment badges */}
            <div className="mt-5 pt-4 border-t border-(--border)">
              <div className="text-xs text-(--muted) mb-2 text-center">Способи оплати</div>
              <div className="flex justify-center gap-2 text-lg">
                💳 📱 💵
              </div>
              <div className="text-[11px] text-(--muted) text-center mt-1.5">
                Картка, Apple Pay / Google Pay, оплата при отриманні
              </div>
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
