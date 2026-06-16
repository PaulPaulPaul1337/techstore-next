'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAuthModalStore } from '@/store/authModalStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';

export default function AuthModal() {
  const { isOpen, mode, close, openLogin, openRegister, openForgot } = useAuthModalStore();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const verifyResetCode = useAuthStore((s) => s.verifyResetCode);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const logout = useAuthStore((s) => s.logout);

  const cartCount = useCartStore((s) => s.totalCount());
  const cartTotal = useCartStore((s) => s.totalPrice());
  const wishCount = useWishlistStore((s) => s.count());
  const compareCount = useCompareStore((s) => s.count());

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'password'>('email');

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
      if (!user) setTimeout(() => firstInputRef.current?.focus(), 200);
    }
  }, [isOpen, user]);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setSubmitting(false);
    setForgotStep('email');
  }, [mode, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  function handleClose() {
    setVisible(false);
    setTimeout(close, 280);
  }

  async function handleLogout() {
    await logout();
    handleClose();
  }

  const inputClass =
    'w-full h-11 border border-(--border) rounded-lg px-4 text-sm outline-none focus:border-(--accent) transition-colors bg-white text-(--text)';

  if (!isOpen) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result === 'ok') {
      handleClose();
    } else {
      setError('Невірний email або пароль');
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Пароль повинен містити не менше 6 символів');
      return;
    }
    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);
    if (result === 'ok') {
      handleClose();
    } else {
      setError('Акаунт з таким email вже існує');
    }
  }

  async function handleForgotEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    const result = await requestPasswordReset(email);
    setSubmitting(false);
    if (result.status === 'ok') {
      setSuccess(
        result.code
          ? `Код підтвердження надіслано на ${email}. (Демо-режим, email не налаштовано — ваш код: ${result.code})`
          : `Код підтвердження надіслано на ${email}.`
      );
      setForgotStep('code');
    } else {
      setError('Користувача з таким email не знайдено');
    }
  }

  async function handleForgotCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    const result = await verifyResetCode(email, code);
    setSubmitting(false);
    if (result === 'ok') {
      setForgotStep('password');
    } else {
      setError('Невірний або застарілий код підтвердження');
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 6) {
      setError('Пароль повинен містити не менше 6 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    setSubmitting(true);
    const result = await resetPassword(email, code, newPassword);
    setSubmitting(false);
    if (result === 'ok') {
      setSuccess('Пароль успішно змінено! Тепер увійдіть з новим паролем.');
      setTimeout(openLogin, 1500);
    } else if (result === 'invalid') {
      setError('Невірний або застарілий код підтвердження');
    } else {
      setError('Користувача з таким email не знайдено');
    }
  }

  const menuItems = [
    { icon: '🛒', label: 'Кошик', href: '/cart', count: cartCount, sub: `${cartTotal.toLocaleString('uk-UA')} ₴` },
    { icon: '♡', label: 'Обране', href: '/wishlist', count: wishCount, sub: `${wishCount} товарів` },
    { icon: '⚖️', label: 'Порівняння', href: '/compare', count: compareCount, sub: `${compareCount} товарів` },
  ];

  const navLinks = [
    { label: '🛒 Кошик', href: '/cart' },
    { label: '♡ Список обраного', href: '/wishlist' },
    { label: '⚖️ Порівняння товарів', href: '/compare' },
    { label: '📦 Каталог товарів', href: '/catalog' },
    { label: '🧾 Історія покупок', href: '/account/orders' },
    ...(user?.isAdmin ? [{ label: '⚙️ Панель адміністратора', href: '/admin' }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className="relative w-full max-w-[380px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: visible ? 'translateX(0)' : 'translateX(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-(--border) shrink-0">
          <span className="text-[20px] font-bold tracking-tight text-[#111]">
            Tech<span className="text-(--accent)">Store</span>
          </span>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center text-[#aaa] hover:text-[#333] transition-colors text-xl rounded-full hover:bg-[#f0f0f0]"
          >
            ✕
          </button>
        </div>

        {user ? (
          /* ── LOGGED IN VIEW ── */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Profile */}
            <div className="px-6 py-5 border-b border-(--border)">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#f0f0f0] rounded-full flex items-center justify-center text-3xl shrink-0">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[16px] truncate">{user.name}</div>
                  <div className="text-(--muted) text-sm truncate">{user.email}</div>
                  {user.isAdmin && (
                    <span className="inline-block mt-1 bg-(--accent) text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Адміністратор
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-(--border)">
              {menuItems.map(({ icon, label, href, count, sub }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className="bg-[#f8f8f8] border border-(--border) rounded-xl p-3 text-center hover:border-(--accent) hover:bg-white transition-all"
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xl font-bold leading-none">{count}</div>
                  <div className="text-[11px] text-(--muted) mt-0.5">{label}</div>
                  <div className="text-[10px] text-(--muted)">{sub}</div>
                </Link>
              ))}
            </div>

            {/* Nav links */}
            <div className="flex-1">
              {navLinks.map(({ label, href }, idx) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className={`flex items-center justify-between px-6 py-3.5 text-[14px] font-medium hover:bg-[#f8f8f8] transition-colors ${
                    idx < navLinks.length - 1 ? 'border-b border-(--border)' : ''
                  }`}
                >
                  {label}
                  <span className="text-(--muted) text-lg leading-none">›</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="px-6 py-5 border-t border-(--border) shrink-0">
              <button
                onClick={handleLogout}
                className="w-full h-10 border border-(--border) rounded-lg text-sm text-(--muted) hover:text-(--accent) hover:border-(--accent) transition-colors font-semibold"
              >
                Вийти з акаунту
              </button>
            </div>
          </div>
        ) : (
          /* ── AUTH FORMS VIEW ── */
          <>
            {/* Tabs */}
            {mode === 'forgot' ? (
              <div className="flex items-center border-b border-(--border) shrink-0 px-6 py-4">
                <button
                  onClick={openLogin}
                  className="text-sm font-bold text-(--muted) hover:text-(--text) transition-colors"
                >
                  ← Назад до входу
                </button>
              </div>
            ) : (
              <div className="flex border-b border-(--border) shrink-0 px-6">
                <button
                  onClick={openLogin}
                  className={`flex-1 pb-3 pt-4 text-sm font-bold transition-colors border-b-2 -mb-px ${
                    mode === 'login'
                      ? 'text-(--accent) border-(--accent)'
                      : 'text-(--muted) border-transparent hover:text-(--text)'
                  }`}
                >
                  Увійти
                </button>
                <button
                  onClick={openRegister}
                  className={`flex-1 pb-3 pt-4 text-sm font-bold transition-colors border-b-2 -mb-px ${
                    mode === 'register'
                      ? 'text-(--accent) border-(--accent)'
                      : 'text-(--muted) border-transparent hover:text-(--text)'
                  }`}
                >
                  Реєстрація
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded mb-4">
                  {success}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email</label>
                    <input
                      ref={firstInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold">Пароль</label>
                      <button
                        type="button"
                        onClick={openForgot}
                        className="text-xs font-semibold text-(--accent) hover:underline"
                      >
                        Забули пароль?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {submitting ? 'Вхід...' : 'Увійти'}
                  </button>

                  <div className="pt-4 border-t border-(--border) text-xs text-(--muted) text-center space-y-1.5">
                    <p>Для демо-доступу адміністратора:</p>
                    <p className="font-mono bg-[#f4f4f4] px-3 py-1.5 rounded inline-block">
                      admin@techstore.ua / admin123
                    </p>
                  </div>
                </form>
              ) : mode === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Ім&apos;я</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Іван Петренко"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Пароль</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Мінімум 6 символів"
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {submitting ? 'Реєстрація...' : 'Зареєструватися'}
                  </button>
                </form>
              ) : forgotStep === 'email' ? (
                <form onSubmit={handleForgotEmail} className="space-y-4">
                  <p className="text-sm text-(--muted)">
                    Вкажіть email вашого акаунту — ми надішлемо код підтвердження.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email</label>
                    <input
                      ref={firstInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {submitting ? 'Надсилання...' : 'Надіслати код'}
                  </button>
                </form>
              ) : forgotStep === 'code' ? (
                <form onSubmit={handleForgotCode} className="space-y-4">
                  <p className="text-sm text-(--muted)">
                    Введіть 6-значний код підтвердження, надісланий на <span className="font-semibold text-(--text)">{email}</span>.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Код підтвердження</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      className={`${inputClass} text-center tracking-[0.4em] font-mono`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {submitting ? 'Перевірка...' : 'Підтвердити'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="w-full text-center text-xs font-semibold text-(--muted) hover:text-(--text) transition-colors"
                  >
                    Змінити email
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-(--muted)">
                    Код підтверджено. Введіть новий пароль для вашого акаунту.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Новий пароль</label>
                    <input
                      ref={firstInputRef}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Мінімум 6 символів"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Підтвердіть пароль</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторіть пароль"
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
                  >
                    {submitting ? 'Зміна паролю...' : 'Змінити пароль'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
