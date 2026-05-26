export default function WarrantyPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Гарантія і повернення</h1>

      <div className="space-y-6">
        <div className="bg-(--card) border border-(--border) rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">🛡️ Гарантія</h2>
          <p className="text-sm text-(--muted) mb-4">
            Всі товари в TechStore — офіційні, з гарантією виробника. Ми продаємо тільки оригінальну продукцію.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📱', label: 'Смартфони', period: '12–24 місяці' },
              { icon: '💻', label: 'Ноутбуки', period: '12–24 місяці' },
              { icon: '🎧', label: 'Аксесуари', period: '6–12 місяців' },
            ].map(({ icon, label, period }) => (
              <div key={label} className="bg-(--bg) rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-(--muted) text-xs mt-1">{period}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-(--card) border border-(--border) rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">🔄 Повернення та обмін</h2>
          <ul className="space-y-3 text-sm text-(--muted)">
            <li className="flex gap-2"><span className="text-green-600 font-bold">✓</span> 14 днів на повернення без пояснення причин</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">✓</span> Товар повинен бути в оригінальній упаковці та без слідів використання</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">✓</span> Повернення коштів протягом 3–5 робочих днів</li>
            <li className="flex gap-2"><span className="text-green-600 font-bold">✓</span> Безкоштовний обмін при наявності дефекту</li>
          </ul>
        </div>

        <div className="bg-(--card) border border-(--border) rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">🔧 Сервісний центр</h2>
          <p className="text-sm text-(--muted) mb-3">
            Власний сервісний центр в Києві. Ремонт в гарантійний та постгарантійний період.
          </p>
          <p className="text-sm text-(--muted)">
            Телефон: <strong className="text-(--text)">0 800 000 000</strong> (безкоштовно)<br />
            Email: <strong className="text-(--text)">service@techstore.ua</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
