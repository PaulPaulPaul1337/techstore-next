export default function ContactsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Контакти</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-(--card) border border-(--border) rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">📞 Зв&apos;язок</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-(--muted) text-xs font-semibold uppercase tracking-wide mb-0.5">Телефон (безкоштовно)</div>
                <div className="text-xl font-bold">0 800 000 000</div>
              </div>
              <div>
                <div className="text-(--muted) text-xs font-semibold uppercase tracking-wide mb-0.5">Email</div>
                <div className="font-semibold">support@techstore.ua</div>
              </div>
              <div>
                <div className="text-(--muted) text-xs font-semibold uppercase tracking-wide mb-0.5">Графік роботи</div>
                <div>Пн–Пт: 9:00–21:00</div>
                <div>Сб–Нд: 10:00–20:00</div>
              </div>
            </div>
          </div>

          <div className="bg-(--card) border border-(--border) rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">🏪 Наш магазин</h2>
            <div className="space-y-2 text-sm text-(--muted)">
              <p><strong className="text-(--text)">Адреса:</strong> м. Київ, вул. Хрещатик, 1</p>
              <p><strong className="text-(--text)">Метро:</strong> Хрещатик</p>
              <p><strong className="text-(--text)">Графік:</strong> Щодня 10:00–21:00</p>
            </div>
          </div>
        </div>

        <div className="bg-(--card) border border-(--border) rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">✉️ Написати нам</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Ваше ім&apos;я</label>
              <input className="w-full h-10 border border-(--border) rounded-lg px-3 text-sm bg-(--card) text-(--text) outline-none focus:border-(--accent) transition-colors" placeholder="Іван Петренко" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input type="email" className="w-full h-10 border border-(--border) rounded-lg px-3 text-sm bg-(--card) text-(--text) outline-none focus:border-(--accent) transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Повідомлення</label>
              <textarea className="w-full h-28 border border-(--border) rounded-lg px-3 py-2.5 text-sm bg-(--card) text-(--text) outline-none focus:border-(--accent) transition-colors resize-none" placeholder="Ваше запитання..." />
            </div>
            <button type="submit" className="w-full h-10 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg transition-colors text-sm">
              Надіслати
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
