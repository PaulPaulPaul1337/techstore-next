export default function DeliveryPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Доставка і оплата</h1>

      <div className="space-y-6">
        <Section title="🚚 Способи доставки">
          <Table rows={[
            ['Нова Пошта (відділення)', '1–2 дні', '60–100 ₴'],
            ['Нова Пошта (адресна)', '1–2 дні', '80–150 ₴'],
            ['Укрпошта', '3–5 днів', '30–60 ₴'],
            ['Самовивіз (м. Київ)', 'Сьогодні', 'Безкоштовно'],
            ['Кур&apos;єр по Києву', '2–4 години', '100 ₴'],
          ]} headers={['Спосіб', 'Термін', 'Вартість']} />
        </Section>

        <Section title="💳 Способи оплати">
          <ul className="space-y-3 text-sm text-(--muted)">
            {[
              '💳 Карткою онлайн (Visa, Mastercard)',
              '🏦 Розстрочка 0% — Monobank, PrivatBank (до 24 місяців)',
              '💵 Готівкою при отриманні',
              '🏢 Безготівковий розрахунок для юридичних осіб',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="📦 Безкоштовна доставка">
          <p className="text-sm text-(--muted)">
            При замовленні від <strong className="text-(--text)">3 000 ₴</strong> доставка Новою Поштою на відділення — безкоштовно.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border)">
            {headers.map((h) => <th key={h} className="text-left py-2 pr-6 text-(--muted) font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-(--border) last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 pr-6 text-(--text)" dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
