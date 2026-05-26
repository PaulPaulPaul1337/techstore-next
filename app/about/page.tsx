export default function AboutPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Про нас</h1>

      <div className="space-y-6">
        <div className="bg-(--card) border border-(--border) rounded-xl p-8">
          <h2 className="text-4xl font-bold mb-2">
            Tech<span className="text-(--accent)">Store</span>
          </h2>
          <p className="text-(--muted) text-sm mb-6">Офіційний магазин електроніки в Україні</p>
          <p className="text-(--muted) leading-relaxed">
            TechStore — це сучасний магазин електроніки, де ви знайдете найкращі смартфони, ноутбуки, навушники, камери та аксесуари від провідних світових брендів. Ми пропонуємо виключно оригінальну продукцію з офіційною гарантією.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '10 000+', label: 'Товарів в асортименті' },
            { value: '50 000+', label: 'Задоволених клієнтів' },
            { value: '5 років', label: 'На ринку України' },
            { value: '5★', label: 'Середній рейтинг' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-(--card) border border-(--border) rounded-xl p-5 text-center">
              <div className="text-2xl font-bold text-(--accent)">{value}</div>
              <div className="text-(--muted) text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-(--card) border border-(--border) rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">🎯 Наші переваги</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '✅', title: 'Офіційна гарантія', desc: 'Тільки оригінальні товари від офіційних дистриб\'юторів' },
              { icon: '🚀', title: 'Швидка доставка', desc: 'Доставка Новою Поштою за 1–2 дні по всій Україні' },
              { icon: '💳', title: 'Розстрочка 0%', desc: 'Оплата частинами без переплати на 24 місяці' },
              { icon: '🔄', title: 'Легке повернення', desc: '14 днів на повернення без пояснення причин' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-(--muted) text-xs mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
